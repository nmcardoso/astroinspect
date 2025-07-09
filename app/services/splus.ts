import axios, { AxiosError, AxiosInstance } from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { obj2qs } from '../lib/utils'
import { QueryClient } from '@tanstack/react-query'
import { timeConvert } from '../lib/utils'
import { semaphore } from '../lib/Semaphore'
import { getReplicaUrl, processResponse } from './utils'


type TableType = {
  name?: string,
  table?: any
}

type SchemaType = {
  name?: string,
  table?: any
}



const PUBLIC_TAP_URL = 'https://astrotools.vercel.app/proxy/https://splus.cloud/public-TAP/tap/'
const PRIVATE_TAP_URL = 'https://astrotools.vercel.app/proxy/https://splus.cloud/tap/tap/'
const TRILOGY_URL = [
  'https://astrotools.vercel.app/trilogy.png',
]
const LUPTON_URL = [
  'https://astrotools.vercel.app/lupton.png',
]
// const PHOTOSPEC_URL = 'https://splus-spectra.herokuapp.com/plot'
const PHOTOSPEC_URL = 'https://astrotools.vercel.app/plot'
const FLUX_RADIUS_URL = 'https://checker-melted-forsythia.glitch.me/fluxRadius'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: timeConvert(12, 'hour', 'ms'),
    },
  },
})

semaphore.create('splus-flux-radius', 1)

export default class SplusService {
  httpClient: AxiosInstance
  publicSchemas: SchemaType[] | null
  cachedTables: TableType[] | null

  constructor() {
    this.httpClient = axios.create({
      baseURL: PUBLIC_TAP_URL
    })
    this.publicSchemas = null
    this.cachedTables = null
  }

  async getTables(schema: string) {
    if (this.cachedTables == null) {
      const r = await this.httpClient.get('tables')
      const data = r.data
      const parser = new XMLParser()
      const json = parser.parse(data)
      const schemas = json['vosi:tableset'].schema
      this.publicSchemas = schemas
    }

    const dr = this.publicSchemas?.find(e => e.name == schema)
    let tables = dr && dr.table
    if (!Array.isArray(tables)) tables = [tables]
    const tableNames = tables.map((t: any) => t.name)
    return tableNames
  }

  async getColumns(schema: string, table: string) {
    if (this.publicSchemas == null) {
      return []
    } else {
      const dr = this.publicSchemas.find(e => e.name == schema)
      let tables = dr && dr.table
      if (!Array.isArray(tables)) tables = [tables]
      const targetTable = tables.find((t: any) => t.name == table)
      const columns = targetTable?.column?.map((c: any) => c.name)
      return columns
    }
  }

  getTrilogyUrl(ra: number, dec: number, size: number, config?: ITrilogyConfig) {
    const params = {
      ra,
      dec,
      size,
      r: config?.R?.join(','),
      g: config?.G?.join(','),
      b: config?.B?.join(','),
      noise: config?.noise,
      q: config?.Q
    }
    const qs = obj2qs(params)
    return `${TRILOGY_URL}?${qs}`
  }

  getLuptonUrl(ra: number, dec: number, size: number, config: ILuptonConfig) {
    const params = {
      ra,
      dec,
      size,
      r: config?.R,
      g: config?.G,
      b: config?.B,
      stretch: config?.stretch,
      q: config?.Q
    }
    const qs = obj2qs(params)
    return `${LUPTON_URL}?${qs}`
  }

  getPhotoSpecUrl(ra: number, dec: number, lines: string[] = []) {
    return `${PHOTOSPEC_URL}?ra=${ra}&dec=${dec}&${lines.join('&')}`
  }

  async getFluxRadius(ra: number, dec: number) {
    return semaphore.enqueue('splus-flux-radius', async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['splus-service-flux-radius', ra, dec],
        queryFn: async () => {
          const resp = await axios.get(FLUX_RADIUS_URL, {
            params: { ra, dec }
          })
          return resp.data
        }
      })
      return data
    })
  }
}



export class SplusStamp implements IResourceFetch {
  private ra
  private dec
  private pixscale
  private type
  private config
  private stampSize

  constructor(
    ra: number,
    dec: number,
    pixscale: number,
    type: 'trilogy' | 'lupton',
    config: ILuptonConfig | ITrilogyConfig,
  ) {
    this.ra = ra
    this.dec = dec
    this.pixscale = pixscale
    this.type = type
    this.config = config
    this.stampSize = Math.min(Math.round((this.pixscale * 300) / 0.55), 1000)
  }

  getParams() {
    if (this.type === 'trilogy') {
      return {
        ra: this.ra,
        dec: this.dec,
        size: this.stampSize,
        r: this.config?.R?.join(','),
        g: this.config?.G?.join(','),
        b: this.config?.B?.join(','),
        noise: this.config?.noise,
        q: this.config?.Q
      }
    }
    return {
      ra: this.ra,
      dec: this.dec,
      size: this.stampSize,
      r: this.config?.R,
      g: this.config?.G,
      b: this.config?.B,
      stretch: this.config?.stretch,
      q: this.config?.Q
    }
  }

  getUrl(replicaId: number = 0) {
    if (this.type === 'trilogy') {
      return getReplicaUrl(TRILOGY_URL, replicaId || 0)
    }
    return getReplicaUrl(LUPTON_URL, replicaId || 0)
  }

  async fetch(config: IResourceFetchConfig) {
    return await queryClient.fetchQuery({
      queryKey: [this.ra, this.dec, this.stampSize, this.type, this.config],
      queryFn: () => processResponse(
        () => axios.get(this.getUrl(config.id), {
          responseType: 'blob',
          signal: semaphore.getSignal(),
          params: this.getParams()
        })
      )
    })
  }
}



export class SplusPhotoSpectra implements IResourceFetch {
  private ra
  private dec
  private lines

  constructor(ra: number, dec: number, lines: string[]) {
    this.ra = ra
    this.dec = dec
    this.lines = lines
  }

  async fetch(config: IResourceFetchConfig) {
    return await queryClient.fetchQuery({
      queryKey: [this.ra, this.dec, this.lines],
      queryFn: () => processResponse(
        () => axios.get(PHOTOSPEC_URL, {
          responseType: 'blob',
          signal: semaphore.getSignal(),
          params: {
            ra: this.ra,
            dec: this.dec,
            ...this.lines.reduce((acc: any, line) => { acc[line] = ''; return acc }, {}),
          }
        })
      )
    })
  }
}