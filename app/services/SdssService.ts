import { semaphore } from '@/lib/Semaphore'
import axios from 'axios'
import { obj2formData, timeConvert } from '@/lib/utils'
import JSONBigInt from 'json-bigint'
import chunk from 'lodash/chunk'
import { QueryClient, QueryOptions } from '@tanstack/react-query'

semaphore.create('sdss_cone_spec', 1)
semaphore.create('sdss_sql', 2)
semaphore.create('sdss_batch_query', 2)
semaphore.create('sdss_query', 2)

const CONE_SPEC_URL = 'https://skyserver.sdss.org/dr18/SkyServerWS/SpectroQuery/ConeSpectro'
const SQL_URL = 'https://skyserver.sdss.org/dr18/SkyServerWS/SearchTools/SqlSearch'
const CROSSID_SEARCH = 'https://skyserver.sdss.org/dr18/SkyServerWS/SearchTools/CrossIdSearch'
// const SPEC_PLOT_URL = 'https://skyserver.sdss.org/dr18/en/get/SpecById.ashx?id='
const SPEC_PLOT_URL = 'https://astrotools.vercel.app/plot?id='
const CLIENT_STALE_TIME = timeConvert(10, 'day', 'ms')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CLIENT_STALE_TIME,
    },
  },
})

export type SdssColumnDesc = {
  name: string,
  description: string,
  unit: string
}

interface SearchStrategy {
  objType: 'photo' | 'spectro'
  getQuery?: (ra: number, dec: number, table: string, columns: string[]) => string
  getCrossIdQuery: (
    table: string,
    columns: string[]
  ) => string
}

class PositionStrategy implements SearchStrategy {
  objType: 'photo' | 'spectro'
  raColumn: string
  decColumn: string
  pkColumn: string | null

  constructor(options?: {
    objType?: 'photo' | 'spectro',
    raColumn?: string,
    decColumn?: string,
    pkColumn?: string | null
  }) {
    const {
      objType = 'photo',
      raColumn = 'ra',
      decColumn = 'dec',
      pkColumn = null
    } = options || {}
    this.raColumn = raColumn
    this.decColumn = decColumn
    this.pkColumn = pkColumn
    this.objType = objType
  }

  getQuery(ra: number, dec: number, table: string, columns: string[]): string {
    return `SELECT p.fiber2Mag_z ${columns.map(e => `t.${e}`).join(',')}
    FROM PhotoObj p, dbo.fGetNearbyObjEq(326.8952189, 0.7732093, 0.02) n
    WHERE p.objID = n.objID`
  }

  getCrossIdQuery(
    table: string,
    columns: string[]
  ): string {
    const pk = this.objType == 'photo' ? 'objID' : 'specObjID'
    const sql = `
    SELECT 
      ${columns.map(c => `t.${c}`).join(',')}
    FROM #upload u
      JOIN #x x ON x.up_id = u.up_id
      JOIN ${table} t ON t.${this.pkColumn || pk} = x.${pk}
    ORDER by x.up_id
    `.trim()
    return sql
  }
}


const SDSS_TABLES: {
  [key: string]: {
    searchStrategy: SearchStrategy,
    type: 'view' | 'table'
  }
} = {
  'PhotoTag': {
    searchStrategy: new PositionStrategy(),
    type: 'view'
  },
  'SpecObjAll': {
    searchStrategy: new PositionStrategy({ objType: 'spectro' }),
    type: 'table'
  },
  // 'GalaxyTag': {
  //   searchStrategy: new PositionStrategy(),
  //   type: 'view'
  // },
  // 'StarTag': {
  //   searchStrategy: new PositionStrategy(),
  //   type: 'table'
  // },
  'emissionLinesPort': {
    searchStrategy: new PositionStrategy({ objType: 'spectro' }),
    type: 'table'
  },
  'TwoMass': {
    searchStrategy: new PositionStrategy(),
    type: 'table'
  },
  'zooSpec': {
    searchStrategy: new PositionStrategy(),
    type: 'table'
  },
  'zooNoSpec': {
    searchStrategy: new PositionStrategy(),
    type: 'table'
  },
  'zoo2MainSpecZ': {
    searchStrategy: new PositionStrategy({ pkColumn: 'dr8objid' }),
    type: 'table'
  }
}


export default class SdssService {
  getObjSpecId(ra: number | string | null, dec: number | string | null):
    Promise<string | null | undefined> {
    return semaphore.enqueue('sdss_cone_spec', async () => {
      try {
        const resp = await queryClient.fetchQuery({
          queryKey: ['sdss-service-specid', ra, dec],
          queryFn: () => axios.get(CONE_SPEC_URL, {
            params: {
              ra,
              dec,
              radius: 0.01667,
              limit: 1,
              format: 'xml',
              specparams: 'specObjID',
              imgparams: 'none',
              zWarning: 'on'
            },
            signal: semaphore.getSignal()
          })
        })
        const parser = new DOMParser()
        const xml = parser.parseFromString(resp.data, 'application/xml')
        const id = xml.querySelector('Table[name="Table1"] > Row > Item[name="specObjID"]')
        return id?.textContent
      } catch (e) {
        console.log(typeof (e))
        console.log(e)
      }
    })
  }

  async getSpecPlotUrl(ra: number | string | null, dec: number | string | null): Promise<string> {
    const specObjId = await this.getObjSpecId(ra, dec)
    return `${SPEC_PLOT_URL}${specObjId}`
  }

  getSpecPlotUrlById(specObjId: string): string {
    return `${SPEC_PLOT_URL}${specObjId}`
  }

  getTables() {
    return Object.keys(SDSS_TABLES)
  }

  async getColumns(table: string): Promise<SdssColumnDesc[] | undefined> {
    let sql
    if (SDSS_TABLES[table].type == 'table') {
      sql = `SELECT name, description, unit 
      FROM DBColumns 
      WHERE tablename='${table}'`
    } else {
      sql = `
      SELECT tc.name name, tc.description description, tc.unit unit
      FROM DBColumns tc
      INNER JOIN DBViewCols vc ON vc.parent = tc.tablename AND vc.name = tc.name
      WHERE vc.viewname='${table}' 
      `.trim()
    }
    console.log(sql)
    const url = `${SQL_URL}?cmd=${encodeURIComponent(sql)}&format=json`
    const resp = await queryClient.fetchQuery({
      queryKey: ['sdss-service-columns', table],
      queryFn: () => axios.get(url)
    })
    return resp.data?.[0]?.Rows
  }

  async query(
    ra: number,
    dec: number,
    id: string,
    table: string,
    columns: string[],
    sourceTableName?: string,
    sourceTableLastModified?: number
  ) {
    // return semaphore.enqueue('sdss_query', async () => {
      const strategy = SDSS_TABLES[table].searchStrategy
      const query = strategy.getCrossIdQuery(table, columns)
      const r = await queryClient.fetchQuery({
        queryKey: ['sdss-service-batchQuery', table, ...columns,
          id, sourceTableName, sourceTableLastModified],
        queryFn: () => axios.get(CROSSID_SEARCH, {
          params: {
            searchtool: 'CrossID',
            searchType: strategy.objType,
            photoScope: 'nearPrim',
            spectroScope: 'nearPrim',
            photoUpType: 'ra-dec',
            spectroUpType: 'ra-dec',
            radius: 0.016667,
            firstcol: 1,
            paste: this.getCsv([{index: 0, ra, dec}]),
            uquery: query,
            format: 'JSON',
          },
          transformResponse: [data => data]
        })
      })
      const parsed = JSONBigInt({ storeAsString: true }).parse(r.data)
      let data = parsed.find((e: any) => e.TableName == 'Table1').Rows
      data = data.map((e: any) => ({ ...e, index: parseInt(e.index) }))
      if (data.length > 0) {
        return Object.keys(data[0])
          .filter(key => columns.includes(key))
          .reduce((obj: any, key: any) => {
            obj[key] = data[0][key]
            return obj
          }, {})
      } else {
        return undefined
      }
    // })
  }

  async batchQuery(
    positions: { index: number, ra: number, dec: number }[],
    table: string,
    columns: string[],
    batchId: any[],
    sourceTableName?: string,
    sourceTableLastModified?: number
  ) {
    return semaphore.enqueue('sdss_batch_query', async () => {
      console.log(this.getCsv(positions))
      const strategy = SDSS_TABLES[table].searchStrategy
      const query = strategy.getCrossIdQuery(table, columns)
      const r = await queryClient.fetchQuery({
        queryKey: ['sdss-service-batchQuery', table, ...columns,
          ...batchId, sourceTableName, sourceTableLastModified],
        queryFn: () => axios.get(CROSSID_SEARCH, {
          params: {
            searchtool: 'CrossID',
            searchType: strategy.objType,
            photoScope: 'nearPrim',
            spectroScope: 'nearPrim',
            photoUpType: 'ra-dec',
            spectroUpType: 'ra-dec',
            radius: 0.016667,
            firstcol: 1,
            paste: this.getCsv(positions),
            uquery: query,
            format: 'JSON',
          },
          transformResponse: [data => data]
        })
      })
      const parsed = JSONBigInt({ storeAsString: true }).parse(r.data)
      const data = parsed.find((e: any) => e.TableName == 'Table1').Rows
      return data.map((e: any) => ({ ...e, index: parseInt(e.index) }))
    })
  }

  async chunckedQuery(
    positions: { index: number, ra: number, dec: number }[],
    table: string,
    columns: string[],
    srcTabIdentity: {
      name?: string,
      lastModified?: number
    },
    page: number,
    pageSize: number,
    handler: (r: any) => void,
    elementWise: boolean = false,
  ) {
    const chunkSize = 25
    const chunkedPositions = chunk(positions, chunkSize)

    chunkedPositions.map((batch, batchId) => (
      this.batchQuery(batch, table, columns, [page, pageSize, batchId],
        srcTabIdentity.name, srcTabIdentity.lastModified)
    )).forEach((promise, i) => {
      promise.then(queryResult => {
        if (elementWise) {
          for (const r of queryResult) {
            handler(r)
          }
        } else {
          handler(queryResult)
        }
      })
    })
  }

  private getCsv(positions: { index: number, ra: number, dec: number }[]) {
    const posCsv = positions.map(p => `${p.index},${p.ra},${p.dec}`).join('\r\n')
    return 'index,ra,dec\r\n' + (posCsv || '')
  }
}