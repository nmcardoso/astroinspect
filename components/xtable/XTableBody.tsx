/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from 'react'
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


const splusService = new SplusService()
const legacyService = new LegacyService()
const sdssService = new SdssService()

const columnHelper = createColumnHelper<any>()

const columnsAccessors = {
  sourceTable: (column: string) => columnHelper.accessor(`sourceTable:${column}`, {
    cell: info => info.getValue(),
    header: column
  }),
  legacyImaging: () => columnHelper.accessor('legacyImaging', {
    cell: info =>
      <ImageCell
        src={info.getValue()}
        rowId={info.row.index}
        zoomWidth={400}
        zoomHeight={400} />,
    header: 'Legacy'
  }),
  splusImaging: () => columnHelper.accessor('splusImaging', {
    cell: info =>
      <ImageCell
        src={info.getValue()}
        rowId={info.row.index}
        zoomWidth={400}
        zoomHeight={400} />,
    header: 'S-PLUS'
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
  })
}


export default function XTableBody() {
  const { tcState, tcDispatch } = useXTableConfig()
  const { tdState, tdDispatch } = useXTableData()

  const data = tdState.data

  const columns = useMemo(() => {
    console.log('useMemo')
    const sourceTableCol = tdState.schema.sourceTable.map(col => {
      return columnsAccessors.sourceTable(col.colName)
    })
    const legacyImagingCol = tdState.schema.legacyImaging ?
      [columnsAccessors.legacyImaging()] : []
    const splusImagingCol = tdState.schema.splusImaging ?
      [columnsAccessors.splusImaging()] : []
    const classificationCol = tdState.schema.classification ?
      [columnsAccessors.classification()] : []
    const sdssSpectraCol = tdState.schema.sdssSpectra ?
      [columnsAccessors.sdssSpectra()] : []
    const sdssCatalog = tdState.schema.sdssCatalog.map(col => {
      return columnsAccessors.sdssCatalog(col.tableName, col.colName)
    })
    const splusPhotoSpectraCol = tdState.schema.splusPhotoSpectra ?
      [columnsAccessors.splusPhotoSpectra()] : []
    return [
      ...classificationCol, ...sourceTableCol, ...sdssCatalog,
      ...splusPhotoSpectraCol, ...sdssSpectraCol, ...legacyImagingCol,
      ...splusImagingCol
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
          legacyImaging: tcState.legacyImaging.enabled,
          splusImaging: !!tcState.splusImaging.enabled,
          classification: tcState.classification.enabled,
          sdssSpectra: tcState.sdssSpectra.enabled,
          splusPhotoSpectra: tcState.splusPhotoSpectra.enabled
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
            row.legacyImaging = legacyService.getRGBUrl(ra, dec)
          }

          // splus imaging column
          if (schema.splusImaging) {
            const imgType = tcState.splusImaging.type
            row.splusImaging = imgType == 'trilogy' ? splusService.getTrilogyUrl(
              ra, dec, tcState.splusImaging.trilogyConfig
            ) : splusService.getLuptonUrl(
              ra, dec, tcState.splusImaging.luptonConfig
            )
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

        // sddss catalog
        for (const c of schema.sdssCatalog) {
          sdssService.chunckedQuery(positions, c.tableName, [c.colName], (r) => {
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
          sdssService.chunckedQuery(positions, 'SpecObj', ['specObjId'], (r) => {
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


  return (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
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