import Papa, { ParseResult } from 'papaparse'
import { useXTableConfig, IState } from '@/contexts/XTableConfigContext'
import ClassCell from '@/components/table/ClassCell'
import { ColDef } from '@ag-grid-community/core'
import imageCellFactory from '@/components/table/ImageCell'
import { findIndex } from './utils'
import { queuedState } from './states'
import AsyncTextCell from '@/components/table/AsyncTextCell'


interface ITableSummary {
  raIndex: number,
  decIndex: number,
  columns: string[],
  positionFound: boolean
}


const idColDef: ColDef = {
  field: 'ai:id',
  maxWidth: 65,
  headerName: '#'
}

const classificationColDef: ColDef = {
  field: 'ai:class',
  flex: 1,
  headerName: 'class',
  cellRenderer: ClassCell
}

const splusImagingColDef: ColDef = {
  field: 'img:splus',
  flex: 1,
  headerName: 'splus',
  cellRenderer: imageCellFactory({zoomHeight: 650, zoomWidth: 650, modalSize: 'lg'}),
}

const legacyImagingColDef: ColDef = {
  field: 'img:legacy',
  flex: 1,
  headerName: 'legacy',
  cellRenderer: imageCellFactory({zoomHeight: 650, zoomWidth: 650, modalSize: 'lg'}),
}

const sdssSpectraColDef: ColDef = {
  field: 'img:sdss_spec',
  flex: 1,
  headerName: 'spec',
  cellRenderer: imageCellFactory({zoomHeight: 650, zoomWidth: 650, modalSize: 'lg'}),
}

const splusPhotoSpectraColDef: ColDef = {
  field: 'img:splus_photospec',
  flex: 1,
  headerName: 'photo spec',
  cellRenderer: imageCellFactory({zoomHeight: 625, modalSize: 'lg'}),
}

const nearbyRedshiftsColDef: ColDef = {
  field: 'ai:nearby_redshifts',
  flex: 1,
  headerName: 'nearby z'
}

const customImagingColDefFactory = (id: number): ColDef => {
  return {
    field: `img:custom_${id}`,
    flex: 1,
    headerName: `custom ${id}`,
    cellRenderer: imageCellFactory({zoomHeight: 650, zoomWidth: 650, modalSize: 'lg'}),
  }
}

const sdssCatalogColDefFactory = (table: string, col: string): ColDef => {
  return {
    field: `sdss:${table}.${col}`,
    flex: 1,
    headerName: col.toLowerCase(),
    cellRenderer: AsyncTextCell,
  }
}

const userTableColDefFactory = (colName: string): ColDef => {
  return {
    field: `tab:${colName}`,
    // field: colName,
    flex: 1,
    headerName: colName.toLowerCase(),
  }
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

  getColDefs(tcState: IState): {colDef: ColDef[], initVal: any} {
    const defs: ColDef[] = [idColDef]
    const initVal: any = {}
    
    // Classification
    if (tcState.classification.enabled) {
      defs.push(classificationColDef)
      initVal['ai:class'] = undefined
    }

    // User Table
    if (!!tcState.table.selectedColumnsId) {
      for (const colId of tcState.table.selectedColumnsId) {
        const colName = tcState.table.columns[colId]
        defs.push(userTableColDefFactory(colName))
      }
    }

    // SDSS Catalog
    if (!!tcState.sdssCatalog.selectedColumns) {
      for (const col of tcState.sdssCatalog.selectedColumns) {
        defs.push(sdssCatalogColDefFactory(col.table, col.column))
        initVal[`sdss:${col.table}.${col.column}`] = queuedState
      }
    }

    // SDSS Spectra
    if (tcState.sdssSpectra.enabled) {
      defs.push(sdssSpectraColDef)
      initVal['img:sdss_spec'] = queuedState
    }

    // S-PLUS Photo Spectra
    if (tcState.splusPhotoSpectra.enabled) {
      defs.push(splusPhotoSpectraColDef)
      initVal['img:splus_photospec'] = queuedState
    }

    // Legacy Stamp
    if (tcState.legacyImaging.enabled) {
      defs.push(legacyImagingColDef)
      initVal['img:legacy'] = queuedState
    }

    // S-PLUS Stamp
    if (tcState.splusImaging.enabled) {
      defs.push(splusImagingColDef)
      initVal['img:splus'] = queuedState
    }

    // Custom Imaging
    if (tcState.customImaging.enabled) {
      for (const col of tcState.customImaging.columns) {
        defs.push(customImagingColDefFactory(col.columnIndex))
        initVal[`img:custom_${col.columnIndex}`] = queuedState
      }
    }

    return {colDef: defs, initVal: initVal}
  }
}

export default new TableHelper()