import { semaphore } from '@/lib/Semaphore'
import axios from 'axios'
import { obj2formData, timeConvert } from '@/lib/utils'
import JSONBigInt from 'json-bigint'
import chunk from 'lodash/chunk'
import { QueryClient, QueryOptions } from '@tanstack/react-query'

semaphore.create('sdss_cone_spec', 4)
semaphore.create('sdss_sql', 2)
semaphore.create('sdss_batch_query', 2)
semaphore.create('sdss_query', 2)


const CONE_SPEC_URL = 'https://skyserver.sdss.org/dr18/SkyServerWS/SpectroQuery/ConeSpectro'
const SQL_URL = 'https://skyserver.sdss.org/dr18/SkyServerWS/SearchTools/SqlSearch'
const CROSSID_SEARCH = 'https://skyserver.sdss.org/dr18/SkyServerWS/SearchTools/CrossIdSearch'
// const SPEC_PLOT_URL = 'https://skyserver.sdss.org/dr18/en/get/SpecById.ashx?id='
const SPEC_PLOT_URL = 'https://astrotools.vercel.app/spec'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: timeConvert(1, 'day', 'ms'),
    },
  },
})


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
  async getObjSpecId(ra: number | string | null, dec: number | string | null) {
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
          signal: semaphore.getSignal(),
          transformResponse: (data) => {
            const parser = new DOMParser()
            const xml = parser.parseFromString(data, 'application/xml')
            const id = xml.querySelector('Table[name="Table1"] > Row > Item[name="specObjID"]')
            return id?.textContent
          }
        })
      })
      return resp.data
    } catch (e) {
      console.log(e)
    }
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
    const url = `${SQL_URL}?cmd=${encodeURIComponent(sql)}&format=json`
    const resp = await queryClient.fetchQuery({
      queryKey: ['sdss-service-columns', table],
      queryFn: () => axios.get(url)
    })
    return resp.data?.[0]?.Rows
  }

  protected getCsv(positions: { index: number, ra: number, dec: number }[]) {
    const posCsv = positions.map(p => `${p.index},${p.ra},${p.dec}`).join('\r\n')
    return 'index,ra,dec\r\n' + (posCsv || '')
  }
}



export class SdssSpectra extends SdssService implements IResourceFetch {
  private ra
  private dec

  constructor(
    ra: number,
    dec: number,
  ) {
    super()
    this.ra = ra
    this.dec = dec
  }

  async fetch() {
    const specObjId = await this.getObjSpecId(this.ra, this.dec)
    if (!specObjId) return undefined

    return await queryClient.fetchQuery({
      queryKey: [specObjId],
      queryFn: () => axios.get(SPEC_PLOT_URL, {
        responseType: 'blob',
        signal: semaphore.getSignal(),
        params: {
          id: specObjId
        }
      })
    })
  }
}


export class SdssCatalog extends SdssService implements IResourceFetch {
  private ra
  private dec
  private table
  private column

  constructor(ra: number, dec: number, table: string, column: string) {
    super()
    this.ra = ra
    this.dec = dec
    this.table = table
    this.column = column
  }

  async fetch() {
    const strategy = SDSS_TABLES[this.table].searchStrategy
    const query = strategy.getCrossIdQuery(this.table, [this.column])
    const resp = await queryClient.fetchQuery({
      queryKey: ['sdss-query', this.ra, this.dec, this.table, this.column],
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
          paste: this.getCsv([{ index: 0, ra: this.ra, dec: this.dec }]),
          uquery: query,
          format: 'JSON',
        },
        transformResponse: (data) => {
          const parsed = JSONBigInt({ storeAsString: true }).parse(data)
          let _data = parsed.find((e: any) => e.TableName == 'Table1').Rows
          if (_data.length > 0) {
            return _data[0]?.[this.column]
          } else {
            return undefined
          }
        }
      })
    })
    return resp
  }
}