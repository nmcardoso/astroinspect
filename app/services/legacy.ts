import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'

const LEGACY_RGB = 'https://www.legacysurvey.org/viewer/cutout.jpg'
// const LEGACY_RGB = 'https://checker-melted-forsythia.glitch.me/legacy.jpg'


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
  private layer
  
  constructor(
    ra: number, 
    dec: number, 
    size: number, 
    pixscale: number, 
    layer: string = 'ls-dr10'
  ) {
    this.ra = ra
    this.dec = dec
    this.layer = layer
    this.pixscale = pixscale
    this.size = size
  }

  async fetch() {
    return await queryClient.fetchQuery({
      queryKey: [this.ra, this.dec, this.size, this.pixscale, this.layer],
      queryFn: () => axios.get(LEGACY_RGB, { 
        responseType: 'blob', 
        signal: semaphore.getSignal(),
        params: {
          ra: this.ra,
          dec: this.dec,
          size: this.size,
          pixscale: this.pixscale,
          layer: this.layer
        }
      })
    })
  }
}