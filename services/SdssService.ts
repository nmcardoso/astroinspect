import { semaphore } from '../lib/Semaphore'
import TableDataManager from '../lib/TableDataManager'
import axios from 'axios'

semaphore.create('sdss_cone_spec', 1)
semaphore.create('sdss_sql', 2)

const CONE_SPEC_URL = 'https://skyserver.sdss.org/dr17/SkyServerWS/SpectroQuery/ConeSpectro'
const SQL_URL = 'http://skyserver.sdss.org/dr16/SkyServerWS/SearchTools/SqlSearch'
const CROSSID_SEARCH = 'http://skyserver.sdss.org/dr16/SkyServerWS/SearchTools/CrossIdSearch'

export type SdssColumnDesc = {
  name: string,
  description: string,
  unit: string
}

interface SearchStrategy {
  getQuery: (ra: number, dec: number) => string
}

class PositionStrategy implements SearchStrategy {
  raColumn: string
  decColumn: string
  kindId: string

  constructor(
    raColumn: string = 'ra',
    decColumn: string = 'dec',
    kindId: string = 'objID'
  ) {
    this.raColumn = raColumn
    this.decColumn = decColumn
    this.kindId = kindId
  }

  getQuery(table: string, columns: string[], ra: number[], dec: number[]): string {
    return `SELECT p.fiber2Mag_z ${columns.map(e => `t.${e}`).join(',')}
    FROM PhotoObj p, dbo.fGetNearbyObjEq(326.8952189, 0.7732093, 0.02) n
    WHERE p.objID = n.objID`
  }
}

class JoinStrategy implements SearchStrategy {
  table: string

  constructor(table: string) {
    this.table = table
  }

  getQuery(ra: number, dec: number): string {
    return 'a'
  }
}

class PhotoJoinStrategy extends JoinStrategy {
  constructor() {
    super('PhotoObjAll')
  }
}

class SpecJoinStrategy extends JoinStrategy {
  constructor() {
    super('SpecObjAll')
  }
}


const SDSS_TABLES: { [key: string]: { searchStrategy: SearchStrategy, } } = {
  'PhotoObjAll': {
    searchStrategy: new PositionStrategy()
  },
  'SpecObjAll': {
    searchStrategy: new PositionStrategy()
  },
  'emissionLinesPort': {
    searchStrategy: new PhotoJoinStrategy()
  }
}


export default class SdssService {
  getObjSpecId(ra: number | string | null, dec: number | string | null):
    Promise<string | null | undefined> {
    return semaphore.enqueue('sdss_cone_spec', async () => {
      try {
        const resp = await axios.get(CONE_SPEC_URL, {
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
    return `https://skyserver.sdss.org/dr17/en/get/SpecById.ashx?id=${specObjId}`
  }

  getTables() {
    return Object.keys(SDSS_TABLES)
  }

  async getColumns(table: string): Promise<SdssColumnDesc[] | undefined> {
    const sql = `SELECT name, description, unit FROM DBColumns WHERE tablename='${table}'`
    const url = `${SQL_URL}?cmd=${encodeURIComponent(sql)}&format=json`
    const resp = await fetch(url)
    const data = await resp.json()
    return data?.[0]?.Rows
  }
}