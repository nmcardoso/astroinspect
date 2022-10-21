import axios, { AxiosInstance } from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { ILuptonConfig, ITrilogyConfig } from '../contexts/XTableConfigContext'
import { obj2qs } from '../lib/utils'


type TableType = {
  name?: string,
  table?: any
}

type SchemaType = {
  name?: string,
  table?: any
}



const PUBLIC_TAP_URL = 'https://red-mirror.herokuapp.com/https://splus.cloud/public-TAP/tap/'
const PRIVATE_TAP_URL = 'https://red-mirror.herokuapp.com/https://splus.cloud/tap/tap/'
const TRILOGY_URL = 'https://checker-melted-forsythia.glitch.me/trilogy.png'
const LUPTON_URL = 'https://checker-melted-forsythia.glitch.me/lupton.png'
const PHOTOSPEC_URL = 'https://splus-spectra.herokuapp.com/plot'


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

  getTrilogyUrl(ra: number, dec: number, config?: ITrilogyConfig) {
    const params = {
      ra,
      dec,
      r: config?.R?.join(','),
      g: config?.G?.join(','),
      b: config?.B?.join(','),
      noise: config?.noise,
      q: config?.Q
    }
    const qs = obj2qs(params)
    return `${TRILOGY_URL}?${qs}`
  }

  getLuptonUrl(ra: number, dec: number, config: ILuptonConfig) {
    const params = {
      ra,
      dec,
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
}