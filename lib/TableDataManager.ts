import { IState } from '../contexts/XTableConfigContext'
import SplusService from '../services/SplusService'
import Papa, { ParseResult } from 'papaparse'
import LegacyService from '../services/LegacyService'
import { semaphore } from './Semaphore'
import SdssService from '../services/SdssService'
import chunk from 'lodash/chunk'
import uniq from 'lodash/uniq'

enum ColumnCategory {
  src = 'src',
  splus_image = 'splus_image',
  legacy_image = 'legacy_image',
  sdss_spec = 'sdss_spec'
}

interface IColumn {
  type: ColumnCategory,
  name: string
}

interface ITableSummary {
  raIndex: number,
  decIndex: number,
  columns: string[],
  positionFound: boolean
}

const splusService = new SplusService()
const legacyService = new LegacyService()
const sdssService = new SdssService()

const findIndex = (query: string, items: string[]) => {
  const pattern = `^${query}[_\d]*?$`
  const regex = RegExp(pattern, 'gi')
  return items.findIndex((item, i) => {
    return regex.exec(item) !== null
  })
}


class TableData {
  data: any[]
  sourceData: any[]
  columns: IColumn[] | null
  config: IState | null
  schema: {
    sourceTable: { colId: number, colName: string }[],
    sdssCatalog: { tableName: string, colName: string }[],
    classification: boolean,
    legacyImaging: boolean,
    splusImaging: boolean,
    sdssSpectra: boolean,
  }
  raIndex: number
  decIndex: number

  constructor() {
    this.data = []
    this.sourceData = []
    this.columns = null
    this.config = null
    this.schema = {
      sourceTable: [],
      sdssCatalog: [],
      classification: false,
      legacyImaging: false,
      splusImaging: false,
      sdssSpectra: false,
    }
    this.raIndex = -1
    this.decIndex = -1
  }

  clean() {

  }

  getHeaderSummary(header: string[]) {
    const raIndex = findIndex('ra', header)
    const decIndex = findIndex('dec', header)
    const summary: ITableSummary = {
      raIndex,
      decIndex,
      columns: header,
      positionFound: (raIndex > -1) && (decIndex > -1)
    }
    return summary
  }

  getTableSummary(file: File): Promise<ITableSummary | null> {
    const executor = (resolve: any, reject: any) => {
      const handleParseComplete = (result: ParseResult<any>) => {
        if (result.errors.length > 0) {
          return reject(result.errors)
        }

        const data = result.data
        console.log(data)
        const header = data[0]
        const summary = this.getHeaderSummary(header)
        resolve(summary)
      }

      Papa.parse(file, {
        complete: handleParseComplete,
        preview: 1
      })
    }

    return new Promise<ITableSummary | null>(executor)
  }

  load(config: IState) {
    console.log('load')
    semaphore.clear()
    return new Promise<void>((resolve, reject) => {
      this.config = config
      const file = config.table.file

      const handleParseComplete = (result: ParseResult<any>) => {
        const sourceData = result.data
        this.sourceData = sourceData
        const header = sourceData[0]
        const summary = this.getHeaderSummary(header)
        this.raIndex = summary.raIndex
        this.decIndex = summary.decIndex
        this.schema = {
          sourceTable: config.table.selectedColumnsId.map(e => ({
            colId: e,
            colName: config.table.columns[e]
          })),
          sdssCatalog: config.sdssCatalog.selectedColumns.map(e => ({
            tableName: e.table,
            colName: e.column
          })),
          legacyImaging: config.legacyImaging.enabled,
          splusImaging: !!config.splusImaging.enabled,
          classification: config.classification.enabled,
          sdssSpectra: config.sdssSpectra.enabled,
        }
        console.log(this.schema)
        this.data = new Array(sourceData.length - 1)
        for (let i = 0; i < sourceData.length - 1; i++) {
          const row: any = {}
          // row.ra = data[i + 1][raIdx]
          // row.dec = data[i + 1][decIdx]
          const ra = sourceData[i + 1][this.raIndex]
          const dec = sourceData[i + 1][this.decIndex]
          this.schema.sourceTable.forEach(c => {
            row[`sourceTable:${c.colName}`] = sourceData[i + 1][c.colId]
          })
          this.schema.sdssCatalog.forEach(c => {
            row[`sdss:${c.tableName}.${c.colName}`] = undefined
          })
          if (this.schema.legacyImaging) {
            row.legacyImaging = legacyService.getRGBUrl(ra, dec)
          }
          if (this.schema.splusImaging) {
            const imgType = config.splusImaging.type
            row.splusImaging = imgType == 'trilogy' ? splusService.getTrilogyUrl(
              ra, dec, config.splusImaging.trilogyConfig
            ) : splusService.getLuptonUrl(
              ra, dec, config.splusImaging.luptonConfig
            )
          }
          if (this.schema.classification) {
            row.classification = undefined
          }
          if (this.schema.sdssSpectra) {
            row.sdssSpectra = undefined
          }
          this.data[i] = row
        }

        const positions = this.sourceData.slice(1).map((row, i) => ({
          index: i,
          ra: row[this.raIndex],
          dec: row[this.decIndex]
        }))

        for (const c of config.sdssCatalog.selectedColumns) {
          const promises = chunk(positions, 50).map(batch => (
            sdssService.batchQuery(batch, c.table, [c.column])
          ))
          for (const p of promises) {
            p.then(queryResult => {
              for (const r of queryResult) {
                this.data[r.index][`sdss:${c.table}.${c.column}`] = r[c.column] || null
              }
            })
          }
        }

        if (this.schema.sdssSpectra) {
          const promises = chunk(positions, 50).map(batch => (
            sdssService.batchQuery(batch, 'SpecObj', ['specObjId'])
          ))
          for (const p of promises) {
            p.then(queryResult => {
              for (const r of queryResult) {
                this.data[r.index]['sdssSpectra'] = r['specObjId'] || null
              }
              console.log(this.data)
            })
          }
        }

        resolve()
      }

      if (file) {
        Papa.parse(file, {
          complete: handleParseComplete,
          skipEmptyLines: true
        })
      }
    })
  }

  getRa(rowIndex: number): number | string | null {
    if (this.raIndex != null && rowIndex < this.data.length) {
      return this.sourceData[rowIndex + 1][this.raIndex]
    }
    return null
  }

  getDec(rowIndex: number): number | string | null {
    if (this.decIndex != null && rowIndex < this.data.length) {
      return this.sourceData[rowIndex + 1][this.decIndex]
    }
    return null
  }

  getData() {
    return this.data
  }

  getColumns() {
    return this.columns
  }

  getSchema() {
    return this.schema
  }

  setCellValue(rowId: number, colId: string, value: any) {
    this.data[rowId][colId] = value
  }

  getCellValue(rowId: number, colId: string) {
    return this.data[rowId][colId]
  }
}

export default new TableData() // singleton