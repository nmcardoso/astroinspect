/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import Table from 'react-bootstrap/Table'
import tableManager from '../../lib/TableDataManager'
import Emitter from '../../lib/Emitter'
import { semaphore } from '../../lib/Semaphore'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import ImageCell from './ImageCell'
import ClassCell from './ClassCell'
import SdssSpectraCell from './SdssSpectraCell'
import AsyncTextCell from './AsyncTextCell'


const columnHelper = createColumnHelper<any>()

const columnsAccessors = {
  ra: () => columnHelper.accessor('ra', {
    cell: info => info.getValue()
  }),
  dec: () => columnHelper.accessor('dec', {
    cell: info => info.getValue()
  }),
  sourceTable: (column: string) => columnHelper.accessor(`sourceTable:${column}`, {
    cell: info => info.getValue(),
    header: column
  }),
  legacyImaging: () => columnHelper.accessor('legacyImaging', {
    cell: info => <ImageCell src={info.getValue()} rowId={info.row.index} />,
    header: 'Legacy'
  }),
  splusImaging: () => columnHelper.accessor('splusImaging', {
    cell: info => <ImageCell src={info.getValue()} rowId={info.row.index} />,
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
  )
}


export default function XTableBody() {
  const { tcState, tcDispatch } = useXTableConfig()
  const intervalIdRef = useRef<any>(null)
  const [clock, setClock] = useState(false)

  // const [data, setData] = useState(() => [...tableManager.getData()])
  const schema = tableManager.getSchema()
  const data = tableManager.getData()

  const columns = useMemo(() => {
    console.log('useMemo')
    // const raAccessor = columnsAccessors.ra()
    // const decAccessor = columnsAccessors.dec()
    const sourceTableCol = schema.sourceTable.map(col => {
      return columnsAccessors.sourceTable(col.colName)
    })
    const legacyImagingCol = schema.legacyImaging ?
      [columnsAccessors.legacyImaging()] : []
    const splusImagingCol = schema.splusImaging ?
      [columnsAccessors.splusImaging()] : []
    const classificationCol = schema.classification ?
      [columnsAccessors.classification()] : []
    const sdssSpectraCol = schema.sdssSpectra ?
      [columnsAccessors.sdssSpectra()] : []
    const sdssCatalog = schema.sdssCatalog.map(col => {
      return columnsAccessors.sdssCatalog(col.tableName, col.colName)
    })
    return [
      ...classificationCol, ...sourceTableCol, ...sdssCatalog,
      ...sdssSpectraCol, ...legacyImagingCol, ...splusImagingCol
    ]
  }, [schema])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    Emitter.on('load_table', () => {
      semaphore.create(1, 5)
      tcDispatch({
        type: 'setFileInput',
        payload: {
          processing: true
        }
      })

      tableManager.load(tcState).then(() => tcDispatch({
        type: 'setFileInput',
        payload: {
          processing: false
        }
      }))

      clearInterval(intervalIdRef.current)
      intervalIdRef.current = setInterval(() => {
        setClock(c => !c)
      }, 2000)
    })
    // return () => clearInterval(intervalIdRef.current)
  }, [tcState, tcDispatch])


  return (
    <>
      {/* {String(clock)} {String(intervalIdRef.current)}
      {tableManager.data?.ra} */}
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
                  {/* <div style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}> */}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  {/* </div> */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}