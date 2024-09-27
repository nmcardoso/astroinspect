/* eslint-disable @next/next/no-img-element */
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { semaphore } from '@/lib/Semaphore'
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import TableHelper from '@/lib/TableHelper'
import { timeConvert } from '@/lib/utils'
import LegacyService from '@/services/LegacyService'
import SdssService from '@/services/SdssService'
import SplusService from '@/services/SplusService'
import {
  ColDef, GetRowIdParams, GridReadyEvent,
  IRowNode
} from "@ag-grid-community/core"
import { QueryClient } from '@tanstack/react-query'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridReact } from 'ag-grid-react'
import axios from 'axios'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'


semaphore.create('legacyImaging', 4)
semaphore.create('splusImaging', 4)
semaphore.create('photospectra', 4)
semaphore.create('spectra', 4)
semaphore.create('sdss_cat', 4)


const splusService = new SplusService()
const legacyService = new LegacyService()
const sdssService = new SdssService()


const CLIENT_STALE_TIME = timeConvert(1, 'day', 'ms')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CLIENT_STALE_TIME,
    },
  },
})




const downloadSplusImage = async ({ ra, dec, id, grid, splusConfig }: { ra: string | number, dec: string | number, id: string, grid: AgGridReact, splusConfig: ISplusImaging }) => {
  const size = Math.min(Math.round((splusConfig.pixelScale * 300) / 0.55), 1000)
  const url = splusService.getTrilogyUrl(ra, dec, size, splusConfig.trilogyConfig)
  const rowNode = grid!.api.getRowNode(id)
  if (rowNode?.data['img:splus'] === queuedState || rowNode?.data['img:splus'] === undefined) {
    try {
      rowNode?.setDataValue('img:splus', loadingState)
      const resp = await queryClient.fetchQuery({
        queryKey: ['splus-image', id],
        queryFn: () => axios.get(url, { responseType: 'blob', signal: semaphore.getSignal() })
      })
      const blob = URL.createObjectURL(resp.data)
      rowNode?.setDataValue('img:splus', blob)
    } catch {
      rowNode?.setDataValue('img:splus', loadErrorState)
    }
  }
}


const downloadImage = async ({ ra, dec, id, grid }: { ra: string | number, dec: string | number, id: string, grid: AgGridReact }) => {
  const url = `https://www.legacysurvey.org/viewer/cutout.jpg?ra=${ra}&dec=${dec}&size=300&pixscale=0.4&layer=ls-dr10`
  const rowNode = grid!.api.getRowNode(id)
  // console.log(`${rowNode?.data['tab:ra']}|${rowNode?.data['tab:dec']} : ${rowNode?.data['img:legacy'].toString()}`)
  if (rowNode?.data['img:legacy'] === queuedState || rowNode?.data['img:legacy'] == undefined) {
    try {
      rowNode?.setDataValue('img:legacy', loadingState)
      const resp = await queryClient.fetchQuery({
        queryKey: ['legacy-image', id],
        queryFn: () => axios.get(url, { responseType: 'blob', signal: semaphore.getSignal() })
      })
      const blob = URL.createObjectURL(resp.data)
      rowNode?.setDataValue('img:legacy', blob)
    } catch {
      rowNode?.setDataValue('img:legacy', loadErrorState)
    }
  }
}


const downloadPhotoSpec = async ({ ra, dec, appertures, id, grid }: { ra: string | number, dec: string | number, appertures: string[], id: string, grid: AgGridReact }) => {
  const url = splusService.getPhotoSpecUrl(ra, dec, appertures)
  const rowNode = grid!.api.getRowNode(id)
  if (rowNode?.data['img:splus_photospec'] === queuedState || rowNode?.data['img:splus_photospec'] == undefined) {
    try {
      rowNode?.setDataValue('img:splus_photospec', loadingState)
      const resp = await queryClient.fetchQuery({
        queryKey: ['photospec-image', id],
        queryFn: () => axios.get(url, { responseType: 'blob', signal: semaphore.getSignal() })
      })
      const blob = URL.createObjectURL(resp.data)
      rowNode?.setDataValue('img:splus_photospec', blob)
    } catch {
      rowNode?.setDataValue('img:splus_photospec', loadErrorState)
    }
  }
}

const downloadSpec = async ({ ra, dec, id, grid }: { ra: string | number, dec: string | number, id: string, grid: AgGridReact }) => {
  const specObjId = await sdssService.getObjSpecId(ra, dec)
  if (!specObjId) return
  const url = sdssService.getSpecPlotUrlById(specObjId)

  const rowNode = grid!.api.getRowNode(id)
  if (rowNode?.data['img:sdss_spec'] === queuedState || rowNode?.data['img:sdss_spec'] == undefined) {
    try {
      rowNode?.setDataValue('img:sdss_spec', loadingState)
      const resp = await queryClient.fetchQuery({
        queryKey: ['spectra', id],
        queryFn: () => axios.get(url, { responseType: 'blob', signal: semaphore.getSignal() })
      })
      const blob = URL.createObjectURL(resp.data)
      rowNode?.setDataValue('img:sdss_spec', blob)
    } catch {
      rowNode?.setDataValue('img:sdss_spec', loadErrorState)
    }
  }
}

const downloadResource = async ({ url, colId, rowId, grid }: { url: string, colId: string, rowId: string, grid: AgGridReact }) => {
  const rowNode = grid!.api.getRowNode(rowId)
  if (rowNode?.data[colId] === queuedState || rowNode?.data[colId] == undefined) {
    try {
      rowNode?.setDataValue(colId, loadingState)
      const resp = await queryClient.fetchQuery({
        queryKey: [colId, rowId],
        queryFn: () => axios.get(url, { responseType: 'blob', signal: semaphore.getSignal() })
      })
      const blob = URL.createObjectURL(resp.data)
      rowNode?.setDataValue(colId, blob)
    } catch {
      rowNode?.setDataValue(colId, loadErrorState)
    }
  }
}

const downloadSdssCat = async ({
  ra,
  dec,
  id,
  grid,
  table,
  column,
  fname,
  lastModified
}: {
  ra: string | number,
  dec: string | number,
  id: string,
  grid: AgGridReact,
  table: string,
  column: string,
  fname: string,
  lastModified: number,
}) => {
  const rowNode = grid!.api.getRowNode(id)
  if (rowNode?.data[`sdss:${table}_${column}`] === queuedState || rowNode?.data[`sdss:${table}_${column}`] === undefined) {
    try {
      rowNode?.setDataValue(`sdss:${table}_${column}`, loadingState)
      const resp = await sdssService.query(ra, dec, id, table, [column], fname, lastModified)
      if (resp !== undefined) {
        console.log(resp[column])
        rowNode?.setDataValue(`sdss:${table}_${column}`, resp[column])
      } else {
        rowNode?.setDataValue(`sdss:${table}_${column}`, loadErrorState)
      }
    } catch {
      rowNode?.setDataValue(`sdss:${table}_${column}`, loadErrorState)
    }
  }
}


export default function AIGrid() {
  const { tcState } = useXTableConfig()
  const [rowData, setRowData] = useState<any>([])
  const [colDefs, setColDefs] = useState<ColDef[]>([])

  const onGridReady = useCallback((event: GridReadyEvent) => {
    if (tcState.table.file) {
      TableHelper.load(tcState.table.file).then((result) => {
        console.log(result)
        const { colDef, initVal } = TableHelper.getColDefs(tcState)
        const data = result?.map((e, i, _) => ({ ...e, ...initVal, 'ai:id': String(i + 1) }))
        setRowData(data)
        setColDefs(colDef)
      })
    }
  }, [tcState])



  const onChange = useCallback((event: any) => {
    const pageSize = event.api.paginationGetPageSize()
    const currentPage = event.api.paginationGetCurrentPage()
    const filteredData: any[] = []
    event.api.forEachNodeAfterFilterAndSort((row: IRowNode<any>) => {
      filteredData.push(row.data)
    })
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize

    const pageData = filteredData.slice(startIndex, endIndex)

    const raCol = tcState.table.columns[tcState.table.raIndex]
    const decCol = tcState.table.columns[tcState.table.decIndex]

    semaphore.clear()

    // row-wise map
    pageData.forEach(e => {
      // Legacy stamps
      if (tcState.legacyImaging.enabled) {
        semaphore.enqueue(
          'legacyImaging',
          downloadImage,
          {
            ra: e[`tab:${raCol}`],
            dec: e[`tab:${decCol}`],
            id: e['ai:id'],
            grid: gridRef.current
          }
        )
      }

      // S-PLUS stamps
      if (tcState.splusImaging.enabled) {
        semaphore.enqueue(
          'splusImaging',
          downloadSplusImage,
          {
            ra: e[`tab:${raCol}`],
            dec: e[`tab:${decCol}`],
            id: e['ai:id'],
            grid: gridRef.current,
            splusConfig: tcState.splusImaging
          }
        )
      }

      // S-PLUS photo spectra
      if (tcState.splusPhotoSpectra.enabled) {
        semaphore.enqueue(
          'photospectra',
          downloadPhotoSpec,
          {
            ra: e[`tab:${raCol}`],
            dec: e[`tab:${decCol}`],
            id: e['ai:id'],
            grid: gridRef.current,
            appertures: tcState.splusPhotoSpectra.selectedLines
          }
        )
      }

      // SDSS spectra
      if (tcState.sdssSpectra.enabled) {
        semaphore.enqueue(
          'spectra',
          downloadSpec,
          {
            ra: e[`tab:${raCol}`],
            dec: e[`tab:${decCol}`],
            id: e['ai:id'],
            grid: gridRef.current,
          }
        )
      }

      // Custom Imaging
      if (tcState.customImaging.enabled) {
        tcState.customImaging.columns.forEach((col, idx, _) => {
          const riCol = `tab:${tcState.table.columns[col.columnIndex]}`
          const url = `${col.url}${String(e[riCol])}${col.fileExtension}`
          const colId = `img:custom_${idx}`
          semaphore.create(colId, 4)
          semaphore.enqueue(
            colId,
            downloadResource,
            {
              url: url,
              colId: colId,
              rowId: e['ai:id'],
              grid: gridRef.current,
            }
          )
        })
      }

      // SDSS Catalog
      tcState.sdssCatalog.selectedColumns.forEach((c) => {
        semaphore.enqueue(
          'sdss_cat',
          downloadSdssCat,
          {
            ra: e[`tab:${raCol}`],
            dec: e[`tab:${decCol}`],
            id: e['ai:id'],
            grid: gridRef.current,
            table: c.table,
            column: c.column,
            fname: tcState.table.file?.name,
            lastModified: tcState.table.file?.lastModified,
          }
        )
      })

    })
  }, [tcState])




  const getRowId = useCallback((params: GetRowIdParams): string => {
    return params.data['ai:id']
  }, [])



  const gridRef = useRef<AgGridReact>(null)
  // useEffect(() => {
  //   if (!!gridRef.current) {
  //     tcDispatch({
  //       type: 'gridRef',
  //       payload: {
  //         gridRef: gridRef.current
  //       }
  //     })
  //   }
  // }, [tcDispatch, gridRef])


  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [25, 50, 75, 100, 150, 200]
  }, [])


  const style = { '--ag-cell-horizontal-padding': '8px' } as React.CSSProperties

  return (
    <Container fluid className="px-0" style={{ height: '100%' }}>
      <div
        className="ag-theme-quartz"
        style={{ width: '100%', height: '100%', ...style }}>
        {colDefs && (
          <AgGridReact
            gridOptions={{ rowHeight: 120 }}
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            getRowId={getRowId}
            style={{ height: '100%' }}
            pagination={true}
            paginationPageSize={50}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onGridReady={onGridReady}
            onPaginationChanged={onChange}
            onSortChanged={onChange}
            onFilterChanged={onChange}
          />
        )}
      </div>
    </Container>
  )
}