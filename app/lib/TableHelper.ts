import { IState } from '../contexts/XTableDataContext'
import Papa, { ParseResult } from 'papaparse'


interface ITableSummary {
  raIndex: number,
  decIndex: number,
  columns: string[],
  positionFound: boolean
}


const findIndex = (query: string, items: string[]) => {
  const pattern = `^${query}[_\d]*?$`
  const regex = RegExp(pattern, 'gi')
  return items.findIndex((item, i) => {
    return regex.exec(item) !== null
  })
}

class TableHelper {
  constructor() { }

  load(file: any, handle: (results: ParseResult<any>) => void) {
    if (file) {
      Papa.parse(file, {
        complete: handle,
        skipEmptyLines: true,
        header: true,
        dynamicTyping: true,
        transformHeader(header, index) {
          return `tab:${header}`
        },
      })
    }
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
    return new Promise<ITableSummary | null>((resolve: any, reject: any) => {
      const handleParseComplete = (result: ParseResult<any>) => {
        if (result.errors.length > 0) {
          return reject(result.errors)
        }

        const data = result.data
        const header = data[0]
        const summary = this.getHeaderSummary(header)
        resolve(summary)
      }

      Papa.parse(file, {
        complete: handleParseComplete,
        preview: 1
      })
    })
  }

  getRa(rowIndex: number, tableData: IState): number | string | null {
    if (tableData.raIndex != null && rowIndex < tableData.data.length) {
      return tableData.sourceData[rowIndex + 1][tableData.raIndex]
    }
    return null
  }

  getDec(rowIndex: number, tableData: IState): number | string | null {
    if (tableData.decIndex != null && rowIndex < tableData.data.length) {
      return tableData.sourceData[rowIndex + 1][tableData.decIndex]
    }
    return null
  }

  getCellValue(rowId: number, colId: string, tableData: IState) {
    return tableData.data?.[rowId]?.[colId]
  }
}


export default new TableHelper()