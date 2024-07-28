/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import Table from 'react-bootstrap/Table'
import Emitter from '../../lib/Emitter'
import ImageCell from './ImageCell'
import ClassCell from './ClassCell'
import SdssSpectraCell from './SdssSpectraCell'
import AsyncTextCell from './AsyncTextCell'
import TableHelper from '../../lib/TableHelper'
import SplusService from '../../services/SplusService'
import LegacyService from '../../services/LegacyService'
import SdssService from '../../services/SdssService'
import { ISchema, useXTableData } from '../../contexts/XTableDataContext'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import NearbyRedshiftCell from './NearbyRedshiftCell'


const splusService = new SplusService()
const legacyService = new LegacyService()
const sdssService = new SdssService()

const columnHelper = createColumnHelper<any>()

const columnsAccessors = {
  sourceTable: (column: string) => columnHelper.accessor(`sourceTable:${column}`, {
    cell: info => info.getValue(),
    header: column
  }),
  legacyImaging: (pixScale: number) => columnHelper.accessor('legacyImaging', {
    cell: info =>
      <ImageCell
        src={info.getValue()}
        rowId={info.row.index}
        pixScale={pixScale}
        zoomWidth={600}
        zoomHeight={600}
        modalSize="lg" />,
    header: 'Legacy'
  }),
  splusImaging: () => columnHelper.accessor('splusImaging', {
    cell: info =>
      <ImageCell
        pixScale={0.55}
        src={info.getValue()}
        rowId={info.row.index}
        zoomWidth={600}
        zoomHeight={600}
        modalSize="lg" />,
    header: 'S-PLUS'
  }),
  customImaging: (i: number) => columnHelper.accessor(`customImaging:${i}`, {
    cell: info =>
      <ImageCell
        src={info.getValue()}
        rowId={info.row.index}
        showFooter={false}
        zoomWidth={900}
        zoomHeight={900}
        modalSize="xl"
      />,
    header: 'Custom'
  }),
  classification: () => columnHelper.accessor('classification', {
    cell: info => <ClassCell rowId={info.row.index} />,
    header: 'Class'
  }),
  sdssSpectra: () => columnHelper.accessor('sdssSpectra', {
    cell: info => <SdssSpectraCell rowId={info.row.index} />,
    header: 'SDSS Spec'
  }),
  sdssCatalog: (table: string, column: string) => columnHelper.accessor(
    `sdss:${table}.${column}`,
    {
      cell: info => <AsyncTextCell
        rowId={info.row.index}
        colId={`sdss:${table}.${column}`} />,
      header: column
    }
  ),
  splusPhotoSpectra: () => columnHelper.accessor('splusPhotoSpectra', {
    cell: info =>
      <ImageCell
        src={info.getValue()}
        rowId={info.row.index}
        showFooter={false}
        modalSize="lg"
        zoomWidth={720} />,
    header: 'PhotoSpec'
  }),
  nearbyRedshifts: () => columnHelper.accessor('nearbyRedshifts', {
    cell: info => <NearbyRedshiftCell rowId={info.row.index} />,
    header: 'z'
  })
}


export default function XTableBody() {
  const { tcState, tcDispatch } = useXTableConfig()
  const { tdState, tdDispatch } = useXTableData()
  const [selectedRow, setSelectedRow] = useState('-1')

  const data = tdState.data

  const columns = useMemo(() => {
    const sourceTableCol = tdState.schema.sourceTable.map(col => {
      return columnsAccessors.sourceTable(col.colName)
    })
    const legacyImagingCol = tdState.schema.legacyImaging?.enabled ?
      [columnsAccessors.legacyImaging(tdState.schema.legacyImaging.pixelScale)] : []
    const splusImagingCol = tdState.schema.splusImaging ?
      [columnsAccessors.splusImaging()] : []
    // const customImagingCol = tdState.schema.customImaging ?
    //   [columnsAccessors.customImaging()] : []
    const classificationCol = tdState.schema.classification ?
      [columnsAccessors.classification()] : []
    const sdssSpectraCol = tdState.schema.sdssSpectra ?
      [columnsAccessors.sdssSpectra()] : []
    const sdssCatalog = tdState.schema.sdssCatalog.map(col => {
      return columnsAccessors.sdssCatalog(col.tableName, col.colName)
    })
    const splusPhotoSpectraCol = tdState.schema.splusPhotoSpectra ?
      [columnsAccessors.splusPhotoSpectra()] : []
    const nearbyRedshiftsCol = tdState.schema.nearbyRedshifts ?
      [columnsAccessors.nearbyRedshifts()] : []
    const customImagingCol = []
    if (tdState.schema.customImaging.enabled) {
      for (let i = 0; i < tdState.schema.customImaging.nCols; i++) {
        customImagingCol.push(columnsAccessors.customImaging(i))
      }
    }
    return [
      ...classificationCol, ...sourceTableCol, ...sdssCatalog,
      ...nearbyRedshiftsCol, ...splusPhotoSpectraCol, ...sdssSpectraCol,
      ...legacyImagingCol, ...splusImagingCol, ...customImagingCol,
    ]
  }, [tdState.schema])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    Emitter.on('load_table', () => {
      tcDispatch({
        type: 'setFileInput',
        payload: {
          processing: true
        }
      })

      TableHelper.load(tcState.table.file, (result) => {
        const src = result.data
        const header = result.data[0]
        const summary = TableHelper.getHeaderSummary(header)
        const initialData = new Array(src.length - 1)

        // configure XTable schema based on selected columns
        const schema: ISchema = {
          sourceTable: tcState.table.selectedColumnsId.map(e => ({
            colId: e,
            colName: tcState.table.columns[e]
          })),
          sdssCatalog: tcState.sdssCatalog.selectedColumns.map(e => ({
            tableName: e.table,
            colName: e.column
          })),
          legacyImaging: {
            enabled: tcState.legacyImaging.enabled,
            pixelScale: tcState.legacyImaging.pixelScale
          },
          splusImaging: !!tcState.splusImaging.enabled,
          // customImaging: !!tcState.customImaging.enabled,
          customImaging: {
            enabled: !!tcState.customImaging.enabled,
            nCols: tcState.customImaging.columns.length
          },
          classification: tcState.classification.enabled,
          sdssSpectra: tcState.sdssSpectra.enabled,
          splusPhotoSpectra: tcState.splusPhotoSpectra.enabled,
          nearbyRedshifts: tcState.nearbyRedshifts.enabled,
        }

        // set initial table state
        for (let i = 0; i < src.length - 1; i++) {
          const ra = src[i + 1][summary.raIndex]
          const dec = src[i + 1][summary.decIndex]
          const row: any = {}

          // source table columns
          schema.sourceTable.forEach(c => {
            row[`sourceTable:${c.colName}`] = src[i + 1][c.colId]
          })

          // sdss catalog columns
          schema.sdssCatalog.forEach(c => {
            row[`sdss:${c.tableName}.${c.colName}`] = undefined
          })

          // legacy imaging column
          if (schema.legacyImaging) {
            const size = Math.round((tcState.legacyImaging.pixelScale * 600) / 0.4)
            row.legacyImaging = legacyService.getRGBUrl(
              ra,
              dec,
              size,
              tcState.legacyImaging.dataRelease
            )
          }

          // splus imaging column
          if (schema.splusImaging) {
            const imgType = tcState.splusImaging.type
            const size = Math.round((tcState.splusImaging.pixelScale * 600) / 0.55)
            row.splusImaging = imgType == 'trilogy' ? splusService.getTrilogyUrl(
              ra, dec, size, tcState.splusImaging.trilogyConfig
            ) : splusService.getLuptonUrl(
              ra, dec, size, tcState.splusImaging.luptonConfig
            )
          }

          // custom imaging column
          if (schema.customImaging) {
            tcState.customImaging.columns.forEach((col, colId) => {
              const refRow = src[i + 1][col.columnIndex]
              row[`customImaging:${colId}`] = `${col.url}${refRow}${col.fileExtension}`
            })
          }

          // classification column
          if (schema.classification) {
            row.classification = undefined
          }

          // sdss spectra
          if (schema.sdssSpectra) {
            row.sdssSpectra = undefined
          }

          // splus photospectra column
          if (schema.splusPhotoSpectra) {
            row.splusPhotoSpectra = splusService.getPhotoSpecUrl(
              ra, dec, tcState.splusPhotoSpectra.selectedLines
            )
          }

          // nearby redshifts column
          if (schema.nearbyRedshifts) {
            row.nearbyRedshifts = undefined
          }

          initialData[i] = row
        }

        tdDispatch({
          type: 'initTable',
          payload: {
            initialData: initialData,
            sourceData: src,
            sourceColumns: header,
            raIndex: summary.raIndex,
            decIndex: summary.decIndex,
            schema: schema
          }
        })

        // set fetch values of async columns from remote resources
        const positions = src.slice(1).map((row, i) => ({
          index: i,
          ra: row[summary.raIndex],
          dec: row[summary.decIndex]
        }))

        const srcTabIdentity = {
          name: tcState.table.file?.name,
          lastModified: tcState.table.file?.lastModified
        }

        // sddss catalog
        for (const c of schema.sdssCatalog) {
          sdssService.chunckedQuery(
            positions,
            c.tableName,
            [c.colName],
            srcTabIdentity,
            (r) => {
              tdDispatch({
                type: 'setBatchData',
                payload: {
                  data: r,
                  keys: [`sdss:${c.tableName}.${c.colName}`],
                  columns: [c.colName]
                }
              })
            })
        }

        // sdss spectra
        if (schema.sdssSpectra) {
          sdssService.chunckedQuery(
            positions,
            'SpecObjAll',
            ['specObjId'],
            srcTabIdentity,
            (r) => {
              tdDispatch({
                type: 'setBatchData',
                payload: {
                  data: r,
                  keys: ['sdssSpectra'],
                  columns: ['specObjId']
                }
              })
            })
        }

        tcDispatch({
          type: 'setFileInput',
          payload: {
            processing: false
          }
        })
      })
    })
  }, [tcState, tcDispatch, tdState, tdDispatch])

  const handleKeyDown = useCallback((event: any) => {
    event.stopPropagation()
    if (/^[\w\d]$/i.test(event.key) && parseInt(selectedRow) >= 0) {
      const cls = Object.keys(tcState.classification.keyMap)
        .find(e => tcState.classification.keyMap[e] == event.key)
      tdDispatch({
        type: 'setClass',
        payload: {
          class: cls,
          rowId: parseInt(selectedRow)
        }
      })
    } else if (event.key == 'ArrowDown') {
      setSelectedRow(String(parseInt(selectedRow) + 1))
    } else if (event.key == 'ArrowUp') {
      setSelectedRow(String(parseInt(selectedRow) - 1))
    }
  }, [tcState, tdDispatch, selectedRow])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true)

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [handleKeyDown])

  return (
    <>
      <Table
        striped
        bordered
        hover
        className="mt-3"
        style={{ position: 'relative', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} style={{}}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    position: 'sticky',
                    top: 0,
                    backgroundClip: 'padding-box',
                    backgroundColor: 'white',
                    padding: '0px'
                  }}>
                  <div
                    className="border-bottom border-1"
                    style={{ padding: '8px' }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className={row.id == selectedRow ? 'table-primary' : ''}
              onClick={() => {
                if (row.id == selectedRow) {
                  setSelectedRow('-1')
                } else {
                  setSelectedRow(row.id)
                }
              }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}