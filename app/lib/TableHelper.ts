import AsyncTextCell from '@/components/table/AsyncTextCell'
import ClassCell from '@/components/table/ClassCell'
import imageCellFactory from '@/components/table/ImageCell'
import { queuedState } from './states'
import { ColDef } from 'ag-grid-community'
import stampCellFactory from '@/components/table/StampCell'


const SDSS_SPEC_RATIO = 1134 / 810
const SPLUS_PHOTOSPEC_RATIO = 840 / 659
const LEGACY_STAMP_RATIO = 1
const SPLUS_STAMP_RATIO = 1
const IMAGE_PADDING = 14


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

const splusImagingColDef = (state: IState): ColDef => ({
  field: 'img:splus',
  // flex: 1,
  width: Math.ceil(state.ui.figureSize * SPLUS_STAMP_RATIO) + IMAGE_PADDING,
  headerName: 'splus',
  cellRenderer: stampCellFactory({ zoomHeight: 650, modalSize: 'lg' }),
  autoHeight: false,
})

const legacyImagingColDef = (state: IState): ColDef => ({
  field: 'img:legacy',
  // flex: 1,
  width: Math.ceil(state.ui.figureSize * LEGACY_STAMP_RATIO) + IMAGE_PADDING,
  headerName: 'legacy',
  cellRenderer: stampCellFactory({ zoomHeight: 650, modalSize: 'lg' }),
  autoHeight: false,
})

const sdssSpectraColDef = (state: IState): ColDef => ({
  field: 'img:sdss_spec',
  // flex: 1,
  width: Math.ceil(state.ui.figureSize * SDSS_SPEC_RATIO) + IMAGE_PADDING,
  headerName: 'spec',
  cellRenderer: imageCellFactory({ zoomHeight: 620, modalSize: 'lg', isPlotImage: true }),
  autoHeight: false,
})

const splusPhotoSpectraColDef = (state: IState): ColDef => ({
  field: 'img:splus_photospec',
  // flex: 1,
  width: Math.ceil(state.ui.figureSize * SPLUS_PHOTOSPEC_RATIO) + IMAGE_PADDING,
  headerName: 'photo spec',
  cellRenderer: imageCellFactory({ zoomHeight: 625, modalSize: 'lg', isPlotImage: true }),
  autoHeight: false,
})

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
  const cellDtype = dtype ? { cellDataType: dtype } : {}
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
    }
    initVal['ai:class'] = undefined

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
    if (tcState.cols.sdssCatalog.enabled) {
      if (!!tcState.cols.sdssCatalog.selectedColumns) {
        for (const col of tcState.cols.sdssCatalog.selectedColumns) {
          defs.push(sdssCatalogColDefFactory(col.table, col.column))
          initVal[`sdss:${col.table}_${col.column}`] = queuedState
        }
      }
    }

    // SDSS Spectra
    if (tcState.cols.sdssSpectra.enabled) {
      defs.push(sdssSpectraColDef(tcState))
    }
    initVal['img:sdss_spec'] = queuedState

    // S-PLUS Photo Spectra
    if (tcState.cols.splusPhotoSpectra.enabled) {
      defs.push(splusPhotoSpectraColDef(tcState))
    }
    initVal['img:splus_photospec'] = queuedState

    // Legacy Stamp
    if (tcState.cols.legacyImaging.enabled) {
      defs.push(legacyImagingColDef(tcState))
    }
    initVal['img:legacy'] = queuedState

    // S-PLUS Stamp
    if (tcState.cols.splusImaging.enabled) {
      defs.push(splusImagingColDef(tcState))
    }
    initVal['img:splus'] = queuedState

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