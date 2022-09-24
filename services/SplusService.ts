import axios, { AxiosInstance } from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { ILuptonConfig, ITrilogyConfig } from '../contexts/XTableConfigContext'


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
const TRILOGY_URL = 'https://checker-melted-forsythia.glitch.me/img'


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
    return `${TRILOGY_URL}?ra=${ra}&dec=${dec}`
  }

  getLuptonUrl(ra: number, dec: number, config: ILuptonConfig) {
    return `${TRILOGY_URL}?ra=${ra}&dec=${dec}`
  }
}