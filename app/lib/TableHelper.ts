import AsyncTextCell from '@/components/table/AsyncTextCell'
import ClassCell from '@/components/table/ClassCell'
import imageCellFactory from '@/components/table/ImageCell'
import { IState } from '@/contexts/XTableConfigContext'
import { ColDef } from '@ag-grid-community/core'
import Papa, { ParseResult } from 'papaparse'
import { queuedState } from './states'
import { findIndex } from './utils'
import TableReader from './io'


interface ITableSummary {
  raIndex: number,
  decIndex: number,
  columns: string[],
  positionFound: boolean
}


const idColDef: ColDef = {
  field: 'ai:id',
  maxWidth: 50,
  headerName: '#',
}

const classificationColDef: ColDef = {
  field: 'ai:class',
  flex: 1,
  headerName: 'class',
  filter: true,
  cellRenderer: ClassCell
}

const splusImagingColDef: ColDef = {
  field: 'img:splus',
  flex: 1,
  headerName: 'splus',
  cellRenderer: imageCellFactory({ zoomHeight: 650, modalSize: 'lg' }),
}

const legacyImagingColDef: ColDef = {
  field: 'img:legacy',
  flex: 1,
  headerName: 'legacy',
  cellRenderer: imageCellFactory({ zoomHeight: 650, modalSize: 'lg' }),
}

const sdssSpectraColDef: ColDef = {
  field: 'img:sdss_spec',
  flex: 1,
  headerName: 'spec',
  cellRenderer: imageCellFactory({ zoomHeight: 620, modalSize: 'lg' }),
}

const splusPhotoSpectraColDef: ColDef = {
  field: 'img:splus_photospec',
  flex: 1,
  headerName: 'photo spec',
  cellRenderer: imageCellFactory({ zoomHeight: 625, modalSize: 'lg' }),
}

const customImagingColDefFactory = (id: number): ColDef => {
  return {
    field: `img:custom_${id}`,
    flex: 1,
    headerName: `custom ${id + 1}`,
    cellRenderer: imageCellFactory({ zoomHeight: 650, modalSize: 'lg' }),
  }
}

const sdssCatalogColDefFactory = (table: string, col: string): ColDef => {
  return {
    field: `sdss:${table}.${col}`,
    flex: 1,
    headerName: col.toLowerCase(),
    filter: true,
    cellRenderer: AsyncTextCell,
  }
}

const userTableColDefFactory = (colName: string): ColDef => {
  return {
    field: `tab:${colName}`,
    flex: 1,
    headerName: colName.toLowerCase(),
    filter: true,
  }
}




class TableHelper {
  async load(file: any) {
    const reader = new TableReader(file)
    return await reader.read()
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

  async getTableSummary(file: File) {
    const reader = new TableReader(file)
    const cols = await reader.getColumns()
    if (!!cols) {
      return this.getHeaderSummary(cols)
    } else {
      return undefined
    }
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