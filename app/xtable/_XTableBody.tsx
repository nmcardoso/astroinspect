/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useXTableConfig } from '../contexts/XTableConfigContext'
import Table from 'react-bootstrap/Table'
import Emitter from '../lib/Emitter'
import ImageCell from './ImageCell'
import ClassCell from './ClassCell'
import SdssSpectraCell from './SdssSpectraCell'
import AsyncTextCell from './AsyncTextCell'
import TableHelper from '../lib/TableHelper'
import SplusService from '../services/SplusService'
import LegacyService from '../services/LegacyService'
import SdssService from '../services/SdssService'
import { ISchema, useXTableData } from '../contexts/XTableDataContext'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import NearbyRedshiftCell from './NearbyRedshiftCell'
import { AgGridReact } from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import Papa, { ParseResult } from 'papaparse'
import { useSemaphore } from './useSemaphore'
import axios from 'axios'
import {
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  createGrid,
} from "@ag-grid-community/core"

const splusService = new SplusService()
const legacyService = new LegacyService()
const sdssService = new SdssService()




class Semaphore {
  currentRequests: any[]
  runningRequests: number
  maxConcurrentRequests: number

  /**
   * Creates a semaphore that limits the number of concurrent Promises being 
   * handled.
   * @param {number} maxConcurrentRequests max number of concurrent promises being 
   * handled at any time.
   */
  constructor(maxConcurrentRequests = 1) {
      this.currentRequests = [];
      this.runningRequests = 0;
      this.maxConcurrentRequests = maxConcurrentRequests;
  }

  /**
   * Returns a Promise that will eventually return the result of the function 
   * passed in.
   * Use this to limit the number of concurrent function executions.
   * @param {function} fnToCall function that has a cap on the number of concurrent 
   * executions.
   * @param  {...any} args any arguments to be passed to fnToCall.
   * @returns Promise that will resolve with the resolved value as if the 
   * function passed in was directly called.
   */
  callFunction(fnToCall, ...args) {
      return new Promise((resolve, reject) => {
          this.currentRequests.push({
              resolve,
              reject,
              fnToCall,
              args,
          });
          this.tryNext();
      });
  }

  tryNext() {
      if (!this.currentRequests.length) {
          return;
      } else if (this.runningRequests < this.maxConcurrentRequests) {
          let { resolve, reject, fnToCall, args } = this.currentRequests.shift();
          this.runningRequests++;
          let req = fnToCall(...args);
          req.then((res) => resolve(res))
              .catch((err) => reject(err))
              .finally(() => {
                  this.runningRequests--;
                  this.tryNext();
              });
      }
  }
}





function LegacyStamp(params: any) {

  return (
    <span>
      {
        params.value && (
          <img 
            src={params.value}
            alt=""
            height={120}
          />
        )
      }
    </span>
  )
}



export default function XTableBody() {
  const { tcState, tcDispatch } = useXTableConfig()
  const [rowData, setRowData] = useState<any>([])
  const [colDefs, setColDefs] = useState([
    {
      field: '_id',
      maxWidth: 60,
      headerName: '#',
    },
    {field: 'class', flex: 1},
    {field: 'ra', flex: 1},
    {field: 'dec', flex: 1},
    {field: 'cluster', flex: 1},
    {
      field: 'legacy',
      cellRenderer: LegacyStamp,
      flex: 1,
      // minWidth: 120,
      // maxWidth: 130,
    },
    {
      field: 'splus',
      cellRenderer: LegacyStamp,
      flex: 1,
    },
  ])
  Emitter.on('load_table', () => {
    if (tcState.table.file) {
      Papa.parse(tcState.table.file, {
        complete: (result) => {
          let rowData = result.data
          rowData = rowData.map((e, i, _) => ({...e, legacy: undefined, splus: undefined, _id: String(i)}))
          setRowData(rowData)
        },
        skipEmptyLines: true,
        header: true,
      })
    }
  })

  const getRowId = useCallback((params: GetRowIdParams) => {
    return params.data._id;
  }, []);

  const gridRef = useRef<AgGridReact>(null)

  const downloadImage = async ({ra, dec, _id}: {ra: string | number, dec: string | number, _id: string}) => {
    const url = `https://www.legacysurvey.org/viewer/cutout.jpg?ra=${ra}&dec=${dec}&size=300&pixscale=0.4&layer=ls-dr10`
    const resp = await axios.get(url, {responseType: 'blob'})
    const blob = URL.createObjectURL(resp.data)
    gridRef.current!.api.getRowNode(_id)?.setDataValue('legacy', blob)
    return blob
  }

  const s = new Semaphore(2)
  rowData.forEach(e => {
    s.callFunction(downloadImage, {ra: e.ra, dec: e.dec, _id: e._id})
  })

  const downloadSplusImage = async ({ra, dec, _id}: {ra: string | number, dec: string | number, _id: string}) => {
    const size = Math.round((tcState.splusImaging.pixelScale * 300) / 0.55)
    const url = splusService.getTrilogyUrl(ra, dec, size, tcState.splusImaging.trilogyConfig)
    const resp = await axios.get(url, {responseType: 'blob'})
    const blob = URL.createObjectURL(resp.data)
    gridRef.current!.api.getRowNode(_id)?.setDataValue('splus', blob)
    return blob
  }

  const s2 = new Semaphore(2)
  rowData.forEach(e => {
    s.callFunction(downloadSplusImage, {ra: e.ra, dec: e.dec, _id: e._id})
  })



  const style = {'--ag-cell-horizontal-padding': '8px'} as React.CSSProperties

  return (
    <div 
      className="ag-theme-quartz mt-4"
      style={{ width: '100%', ...style }}
    >
      <AgGridReact
        gridOptions={{rowHeight: 120, domLayout: 'autoHeight'}}
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        getRowId={getRowId}
      />
    </div>
  )
}