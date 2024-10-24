import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'
import { SimpleConeSearchClient } from './scs'
import interp1 from 'interp1'
import { processResponse } from './utils'

const LEGACY_RGB = 'https://www.legacysurvey.org/viewer/cutout.jpg'
// const LEGACY_RGB = 'https://checker-melted-forsythia.glitch.me/legacy.jpg'
const SCS_URL = 'https://bittersweet-large-ticket.glitch.me/https://datalab.noirlab.edu/scs/ls_dr10/tractor'
const MAG_R = [0, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5, 100]
const CF_CIRC_LINEAR = [11.50, 11.50, 6.00, 5.90, 5.30, 4.50, 3.95, 3.45, 4.20, 4.80, 7.10, 5.60, 1.50, 1.50]


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: timeConvert(1, 'day', 'ms'),
    },
  },
})


export class LegacyStamp implements IResourceFetch {
  private ra
  private dec
  private size
  private pixscale
  private autoPixscale
  private layer

  constructor(
    ra: number,
    dec: number,
    size: number,
    pixscale: number,
    autoPixscale: boolean = true,
    layer: string = 'ls-dr10'
  ) {
    this.ra = ra
    this.dec = dec
    this.layer = layer
    this.pixscale = pixscale
    this.autoPixscale = autoPixscale
    this.size = size
  }

  async computePixscale() {
    const scs = new SimpleConeSearchClient(SCS_URL)
    try {
      const data = await scs.search(this.ra, this.dec, 1.5 / 3600)
      const mag_r = data?.mag_r
      const shape_r = data?.shape_r
      if (Number.isFinite(mag_r) && Number.isFinite(shape_r)) {
        const correctionFactor = interp1(MAG_R, CF_CIRC_LINEAR, [mag_r], 'linear')
        const fov = 2 * shape_r * correctionFactor[0]
        const pixscale = fov / this.size
        return Math.max(Math.min(pixscale, 10), 0.12)
      }
      return undefined
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  async fetch() {
    let pixscale = this.pixscale
    if (this.autoPixscale) {
      const computedPixscale = await this.computePixscale()
      if (computedPixscale != undefined && computedPixscale != null) {
        pixscale = computedPixscale
      }
    }

    return await queryClient.fetchQuery({
      queryKey: [this.ra, this.dec, this.size, pixscale, this.layer],
      queryFn: () => processResponse(
        () => axios.get(LEGACY_RGB, {
          responseType: 'blob',
          signal: semaphore.getSignal(),
          params: {
            ra: this.ra,
            dec: this.dec,
            size: this.size,
            pixscale: pixscale,
            layer: this.layer
          }
        })
      )
    })
  }
}