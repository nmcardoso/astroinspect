import AsyncTextCell from '@/components/table/AsyncTextCell'
import ClassCell from '@/components/table/ClassCell'
import imageCellFactory from '@/components/table/ImageCell'
import { ColDef } from '@ag-grid-community/core'
import { queuedState } from './states'



const idColDef: ColDef = {
  field: 'ai:id',
  maxWidth: 80,
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
    cellRenderer: imageCellFactory({ zoomHeight: 650, modalSize: 'lg', lazy: true }),
  }
}

const sdssCatalogColDefFactory = (table: string, col: string): ColDef => {
  return {
    field: `sdss:${table}_${col}`,
    flex: 1,
    headerName: col.toLowerCase(),
    filter: true,
    cellRenderer: AsyncTextCell,
  }
}

const userTableColDefFactory = (
  colName: string, 
  editable: boolean = false, 
  dtype?: string
): ColDef => {
  const cellDtype = dtype ? {cellDataType: dtype} : {}
  return {
    field: `tab:${colName}`,
    flex: 1,
    headerName: colName.toLowerCase(),
    filter: true,
    editable,
    ...cellDtype,
  }
}




class TableHelper {
  getColDefs(tcState: IState): { colDef: ColDef[], initVal: any } {
    const defs: ColDef[] = [idColDef]
    const initVal: any = {}

    // Classification
    if (tcState.cols.classification.enabled) {
      defs.push(classificationColDef)
      initVal['ai:class'] = undefined
    }

    // User Table
    if (!!tcState.table.selectedColumnsId) {
      for (const colId of tcState.table.selectedColumnsId) {
        const colName = tcState.table.columns[colId]
        const dtype = tcState.table.dataTypes?.[colId]
        const editable = tcState.grid.editable
        defs.push(userTableColDefFactory(colName, editable, dtype))
      }
    }

    // SDSS Catalog
    if (!!tcState.cols.sdssCatalog.selectedColumns) {
      for (const col of tcState.cols.sdssCatalog.selectedColumns) {
        defs.push(sdssCatalogColDefFactory(col.table, col.column))
        initVal[`sdss:${col.table}_${col.column}`] = queuedState
      }
    }

    // SDSS Spectra
    if (tcState.cols.sdssSpectra.enabled) {
      defs.push(sdssSpectraColDef)
      initVal['img:sdss_spec'] = queuedState
    }

    // S-PLUS Photo Spectra
    if (tcState.cols.splusPhotoSpectra.enabled) {
      defs.push(splusPhotoSpectraColDef)
      initVal['img:splus_photospec'] = queuedState
    }

    // Legacy Stamp
    if (tcState.cols.legacyImaging.enabled) {
      defs.push(legacyImagingColDef)
      initVal['img:legacy'] = queuedState
    }

    // S-PLUS Stamp
    if (tcState.cols.splusImaging.enabled) {
      defs.push(splusImagingColDef)
      initVal['img:splus'] = queuedState
    }

    // Custom Imaging
    if (tcState.cols.customImaging.enabled) {
      tcState.cols.customImaging.columns.forEach((col, idx, _) => {
        defs.push(customImagingColDefFactory(idx))
        initVal[`img:custom_${idx}`] = queuedState
      })
    }

    return { colDef: defs, initVal: initVal }
  }
}

export default new TableHelper()