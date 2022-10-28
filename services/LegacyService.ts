import axios from 'axios'
import { semaphore } from '../lib/Semaphore'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'

const LEGACY_RGB = 'https://www.legacysurvey.org/viewer/cutout.jpg'
// const LEGACY_RGB = 'https://checker-melted-forsythia.glitch.me/legacy.jpg'
const NEARBY_REDSHIFT = 'https://red-mirror.herokuapp.com/https://www.legacysurvey.org/viewer/spec/1/cat.json'

semaphore.create('legacy_nearby_z', 1)


const CLIENT_STALE_TIME = timeConvert(10, 'day', 'ms')
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CLIENT_STALE_TIME,
    },
  },
})


const fetchNearbyRedshifts = async (ra: any, dec: any) => {
  const delta = 20 / 3600
  const redshifts = []

  const resp = await axios.get(NEARBY_REDSHIFT, {
    params: {
      ralo: parseFloat(ra) - delta,
      rahi: parseFloat(ra) + delta,
      declo: parseFloat(dec) - delta,
      dechi: parseFloat(dec) + delta
    }
  })
  const data = resp.data
  // console.log(data)

  for (let i = 0; i < data.name.length; i++) {
    redshifts.push({
      ra: parseFloat(data.rd[i][0]),
      dec: parseFloat(data.rd[i][1]),
      z: data.name[i]?.match(/z=.*/)?.[0],
      name: data.name
    })
  }

  return redshifts.filter(e => !!e.z)
}


export default class LegacyService {
  getRGBUrl(
    ra: number | string,
    dec: number | string,
    pixelScale: number | string = 0.55
  ) {
    return `${LEGACY_RGB}?ra=${ra}&dec=${dec}&layer=ls-dr10-early-grz&pixscale=${pixelScale}`
  }

  async getNearbyRedshift(ra: any, dec: any, radius: number) {
    return semaphore.enqueue('legacy_nearby_z', () => {
      return queryClient.fetchQuery(
        ['legacy-service-nearby-z', String(ra), String(dec)],
        () => fetchNearbyRedshifts(ra, dec)
      )
    })
  }
}