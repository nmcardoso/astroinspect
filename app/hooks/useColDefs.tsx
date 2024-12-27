import { useState, useEffect } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import ClassCell from '@/components/table/ClassCell'
import type { ColDef } from 'ag-grid-community'
import imageCellFactory from '@/components/table/ImageCell'


const idColDef: ColDef = {
  field: 'ai:id',
  maxWidth: 75,
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
  cellRenderer: imageCellFactory({zoomHeight: 650, zoomWidth: 650, modalSize: 'lg'}),
}

const nearbyRedshiftsColDef: ColDef = {
  field: 'ai:nearby_redshifts',
  flex: 1,
  headerName: 'nearby z'
}

const customImagingColDefFactory = (id: number): ColDef => {
  return {
    field: `img:ci_${id}`,
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
  }
}

const userTableColDefFactory = (colName: string): ColDef => {
  return {
    field: `tab:${colName}`,
    flex: 1,
    headerName: colName.toLowerCase(),
  }
}


export function useColDefs() {
  const { tcState } = useXTableConfig()
  const [colDefs, setColDefs] = useState<ColDef[] | null>(null)

  useEffect(() => {
    const defs: ColDef[] = [idColDef]
    
    // Classification
    if (tcState.cols.classification.enabled) {
      defs.push(classificationColDef)
    }

    // User Table
    if (!!tcState.table.selectedColumnsId) {
      for (const colId of tcState.table.selectedColumnsId) {
        const colName = tcState.table.columns[colId]
        defs.push(userTableColDefFactory(colName))
      }
    }

    // SDSS Catalog
    if (!!tcState.cols.sdssCatalog.selectedColumns) {
      for (const col of tcState.cols.sdssCatalog.selectedColumns) {
        defs.push(sdssCatalogColDefFactory(col.table, col.column))
      }
    }

    // SDSS Spectra
    if (tcState.cols.sdssSpectra.enabled) {
      defs.push(sdssSpectraColDef)
    }

    // S-PLUS Photo Spectra
    if (tcState.cols.splusPhotoSpectra.enabled) {
      defs.push(splusPhotoSpectraColDef)
    }

    // Legacy Stamp
    if (tcState.cols.legacyImaging.enabled) {
      defs.push(legacyImagingColDef)
    }

    // S-PLUS Stamp
    if (tcState.cols.splusImaging.enabled) {
      defs.push(splusImagingColDef)
    }

    // Custom Imaging
    if (tcState.cols.customImaging.enabled) {
      for (const col of tcState.cols.customImaging.columns) {
        defs.push(customImagingColDefFactory(col.columnIndex))
      }
    }

    setColDefs(defs)
  }, [tcState])

  return [colDefs, setColDefs]
}