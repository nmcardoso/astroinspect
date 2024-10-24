/* eslint-disable @next/next/no-img-element */
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { semaphore } from '@/lib/Semaphore'
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import TableHelper from '@/lib/TableHelper'
import { CustomImage } from '@/services/custom'
import { LegacyStamp } from '@/services/legacy'
import { SdssCatalog, SdssSpectra } from '@/services/sdss'
import { SplusPhotoSpectra, SplusStamp } from '@/services/splus'
import {
  CellKeyDownEvent, GetRowIdParams, GridOptions, GridReadyEvent,
  IRowNode
} from "@ag-grid-community/core"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridReact } from 'ag-grid-react'
import { cloneDeep } from 'lodash'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


semaphore.create('img:legacy', 6)
semaphore.create('img:splus', 5)
semaphore.create('img:splus_photospec', 5)
semaphore.create('img:sdss_spec', 4)
semaphore.create('sdss_cat', 4)

const FETCH_BUFFER = process.env.NODE_ENV === 'development' ? 0 : 100


const downloadResource = async ({
  resourceFetch,
  colId,
  rowId,
  grid,
  isImage = true,
}: {
  resourceFetch: IResourceFetch,
  colId: string,
  rowId: string,
  grid: AgGridReact,
  isImage: boolean,
}) => {
  const rowNode = grid!.api.getRowNode(rowId)
  if (
    (rowNode?.data[colId] === queuedState || rowNode?.data[colId] === undefined)
    && rowNode?.data.hasOwnProperty(colId)
  ) {
    try {
      rowNode?.setDataValue(colId, loadingState)
      const resp = await resourceFetch.fetch()

      if (isImage) {
        rowNode?.setDataValue(colId, URL.createObjectURL(resp.data))
      } else {
        rowNode?.setDataValue(colId, resp.data)
      }
    } catch {
      rowNode?.setDataValue(colId, loadErrorState)
    }
  }
}


const customImageResource = ({
  url,
  colId,
  rowId,
  grid,
}: {
  url: string,
  colId: string,
  rowId: string,
  grid: AgGridReact,
}) => {
  const rowNode = grid!.api.getRowNode(rowId)
  if (
    (rowNode?.data[colId] === queuedState || rowNode?.data[colId] === undefined)
    && rowNode?.data.hasOwnProperty(colId)
  ) {
    try {
      // const riCol = `tab:${tcState.table.columns[col.columnIndex]}`
      // const url = `${col.url}${String(e[riCol])}${col.fileExtension}`
      rowNode?.setDataValue(colId, url)
    } catch {
      rowNode?.setDataValue(colId, loadErrorState)
    }
  }
}


export default function AIGrid() {
  const { tcState, tcDispatch } = useXTableConfig()
  const [isLoading, setLoading] = useState(true)

  const gridRef = useRef<AgGridReact>(null)

  const onGridReady = useCallback(async (event: GridReadyEvent) => {
    let prevClass = undefined
    if (
      tcState.table.isSameFile &&
      tcState.grid.currColConfigs?.classification.enabled &&
      tcState.cols.classification.enabled
    ) {
      prevClass = tcState.grid.data.map((e) => ({ 'ai:class': e['ai:class'] }))
    }

    let data
    if (tcState.table.type === 'local') {
      data = await TableHelper.load(tcState.table.file as File)
    } else {
      data = await TableHelper.load(tcState.table.url as string)
    }

    const { colDef, initVal } = TableHelper.getColDefs(tcState)

    data = data?.map((e, i, _) => ({ ...e, ...initVal, 'ai:id': String(i + 1) }))

    if (prevClass) {
      data = data?.map((e, i, _) => ({ ...e, ...prevClass[i] }))
    }

    setLoading(false)

    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: {
        data: data,
        colDef: colDef,
        isLoaded: true,
        currColConfigs: cloneDeep(tcState.cols),
        currTable: { ...tcState.table },
        api: event.api,
      }
    })

    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        isSameFile: true,
      }
    })
  }, [tcState, tcDispatch])



  const onChange = useCallback((event: any) => {
    const pageSize = event.api.paginationGetPageSize()
    const currentPage = event.api.paginationGetCurrentPage()
    const filteredData: any[] = []
    event.api.forEachNodeAfterFilterAndSort((row: IRowNode<any>) => {
      filteredData.push(row.data)
    })
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize + FETCH_BUFFER

    const pageData = filteredData.slice(startIndex, endIndex)

    const raCol = tcState.table.columns[tcState.table.raIndex as number]
    const decCol = tcState.table.columns[tcState.table.decIndex as number]

    semaphore.clear()

    // row-wise map
    pageData.forEach(e => {
      const ra = e[`tab:${raCol}`]
      const dec = e[`tab:${decCol}`]
      const rowId = e['ai:id']

      // Legacy stamps
      if (tcState.cols.legacyImaging.enabled) {
        semaphore.enqueue(
          'img:legacy',
          downloadResource,
          {
            resourceFetch: new LegacyStamp(ra, dec, 300, tcState.cols.legacyImaging.pixelScale, tcState.cols.legacyImaging.autoPixelScale),
            colId: 'img:legacy',
            rowId: rowId,
            grid: gridRef.current
          }
        )
      }

      // S-PLUS stamps
      if (tcState.cols.splusImaging.enabled) {
        const config = tcState.cols.splusImaging.type === 'trilogy' ?
          tcState.cols.splusImaging.trilogyConfig :
          tcState.cols.splusImaging.luptonConfig
        semaphore.enqueue(
          'img:splus',
          downloadResource,
          {
            resourceFetch: new SplusStamp(ra, dec, tcState.cols.splusImaging.pixelScale, tcState.cols.splusImaging.type, config),
            colId: 'img:splus',
            rowId: rowId,
            grid: gridRef.current,
          }
        )
      }

      // S-PLUS photo spectra
      if (tcState.cols.splusPhotoSpectra.enabled) {
        semaphore.enqueue(
          'img:splus_photospec',
          downloadResource,
          {
            resourceFetch: new SplusPhotoSpectra(ra, dec, tcState.cols.splusPhotoSpectra.selectedLines),
            colId: 'img:splus_photospec',
            rowId: rowId,
            grid: gridRef.current,
          }
        )
      }

      // SDSS spectra
      if (tcState.cols.sdssSpectra.enabled) {
        semaphore.enqueue(
          'img:sdss_spec',
          downloadResource,
          {
            resourceFetch: new SdssSpectra(ra, dec),
            colId: 'img:sdss_spec',
            rowId: rowId,
            grid: gridRef.current,
            isImage: false,
          }
        )
      }

      // Custom Imaging
      if (tcState.cols.customImaging.enabled) {
        tcState.cols.customImaging.columns.forEach((col, idx, _) => {
          const riCol = `tab:${tcState.table.columns[col.columnIndex]}`
          const url = `${col.url}${e[riCol] || ''}${col.fileExtension || ''}`
          const colId = `img:custom_${idx}`
          customImageResource({url, colId, rowId, grid: gridRef.current})
        })
      }

      // SDSS Catalog
      tcState.cols.sdssCatalog.selectedColumns.forEach((c) => {
        semaphore.enqueue(
          'sdss_cat',
          downloadResource,
          {
            resourceFetch: new SdssCatalog(ra, dec, c.table, c.column),
            colId: `sdss:${c.table}_${c.column}`,
            rowId: rowId,
            grid: gridRef.current,
            isImage: false,
          }
        )
      })

    })
  }, [tcState])



  const onCellKeyDown = useCallback((event: CellKeyDownEvent) => {
    const keyEvent = event.event as KeyboardEvent
    if (!keyEvent) return

    if (keyEvent.key.toLowerCase() === 'c' && keyEvent.ctrlKey) {
      navigator.clipboard.writeText(event.value)
      toast.success(`Copied: ${event.value}`, {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
        delay: 100,
      })
    } else if (tcState.cols.classification.enabled && !keyEvent.altKey && !keyEvent.ctrlKey && !keyEvent.shiftKey) {
      for (const [cls, hotkey] of Object.entries(tcState.cols.classification.keyMap)) {
        if (hotkey.toLowerCase() == keyEvent.key.toLowerCase()) {
          event.node.setDataValue('ai:class', cls)
        }
      }
    }
  }, [tcState.cols.classification.enabled, tcState.cols.classification.keyMap])



  const getRowId = useCallback((params: GetRowIdParams): string => {
    return params.data['ai:id']
  }, [])


  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [50, 100, 200, 400, 600, 800, 1000]
  }, [])


  const style = {
    '--ag-cell-horizontal-padding': '8px',
    '--ag-borders': 'solid 1px',
    '--ag-wrapper-border-radius': '0px',
    '--ag-header-height': '38px',
  } as React.CSSProperties

  let gridOptions: GridOptions = {
    suppressHorizontalScroll: false,
    multiSortKey: 'ctrl',
  }
  if (
    tcState.cols.splusImaging.enabled ||
    tcState.cols.legacyImaging.enabled ||
    tcState.cols.sdssSpectra.enabled ||
    tcState.cols.splusPhotoSpectra.enabled ||
    (tcState.cols.customImaging.enabled && tcState.cols.customImaging.columns.length > 0)
  ) {
    gridOptions.rowHeight = 120
  }


  const plotFilter = useCallback((node: IRowNode<any>): boolean => {
    if (node.data) {
      console.log(tcState.plots.filterIndex?.includes(node.sourceRowIndex), node.sourceRowIndex, tcState.plots.filterIndex)
      return tcState.plots.filterIndex?.includes(node.sourceRowIndex)
    }
    return true
  }, [tcState.plots.filterIndex])


  return (
    <Container fluid className="px-0" style={{ height: '100%' }}>
      <div
        className="ag-theme-quartz"
        style={{ width: '100%', height: '100%', ...style }}>
        <AgGridReact
          gridOptions={gridOptions}
          ref={gridRef}
          rowData={tcState.grid.data || []}
          columnDefs={tcState.grid.colDef || []}
          getRowId={getRowId}
          loading={isLoading}
          style={{ height: '100%' }}
          pagination={true}
          paginationPageSize={50}
          paginationPageSizeSelector={paginationPageSizeSelector}
          onGridReady={onGridReady}
          onPaginationChanged={onChange}
          onSortChanged={onChange}
          onFilterChanged={onChange}
          onCellKeyDown={onCellKeyDown}
          singleClickEdit={true}
          isExternalFilterPresent={() => tcState.plots.inspectSelected}
          doesExternalFilterPass={plotFilter}
        />
      </div>
      <ToastContainer />
    </Container>
  )
}