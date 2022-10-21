import zip from 'lodash/zip'
import { createContext, Dispatch, ReactElement, useContext, useReducer } from 'react'

interface IAction<T> {
  type: string,
  payload: T
}

interface IInitTable {
  data?: any[],
  sourceData: any[],
  sourceColumns?: string[],
  raIndex?: number,
  decIndex?: number,
  initialData?: any[],
  schema: ISchema
}

export interface ISchema {
  sourceTable: { colId: number, colName: string }[],
  sdssCatalog: { tableName: string, colName: string }[],
  classification: boolean,
  legacyImaging: boolean,
  splusImaging: boolean,
  sdssSpectra: boolean,
  splusPhotoSpectra: boolean,
  nearbyRedshifts: boolean,
}

export interface IState {
  data: any[],
  sourceData: any[],
  sourceColumns: string[],
  raIndex: number,
  decIndex: number,
  schema: ISchema
}

type PayloadType = any

const initialState: IState = {
  data: [],
  sourceData: [],
  sourceColumns: [],
  raIndex: -1,
  decIndex: -1,
  schema: {
    sourceTable: [],
    sdssCatalog: [],
    classification: false,
    legacyImaging: false,
    splusImaging: false,
    sdssSpectra: false,
    splusPhotoSpectra: false,
    nearbyRedshifts: false,
  }
}

const initTableAction = (state: IState, action: IAction<IInitTable>) => {
  const s = { ...state }
  s.sourceData = action.payload.sourceData ?? s.sourceData
  s.sourceColumns = action.payload.sourceColumns ?? s.sourceColumns
  s.raIndex = action.payload.raIndex ?? s.raIndex
  s.decIndex = action.payload.decIndex ?? s.decIndex
  s.data = action.payload.initialData ?? new Array(action.payload.sourceData.length - 1)
  s.schema = action.payload.schema ?? s.schema
  return s
}

const setBatchDataAction = (state: IState, action: IAction<any>) => {
  const s = { ...state }
  const colKey = zip<any, any>(action.payload.columns, action.payload.keys)
  for (const row of action.payload.data) {
    for (const [col, key] of colKey) {
      s.data[row.index][key] = row[col]
    }
  }
  return s
}

const setClassAction = (state: IState, action: IAction<any>) => {
  const s = { ...state }
  state.data[action.payload.rowId].classification = action.payload.class
  return s
}


const reducer = (state: IState, action: IAction<any>) => {
  switch (action.type) {
    case 'setBatchData':
      return setBatchDataAction(state, action)
    case 'initTable':
      return initTableAction(state, action)
    case 'setClass':
      return setClassAction(state, action)
    default:
      return state
  }
}

export interface IContext {
  tdState: IState,
  tdDispatch: Dispatch<IAction<PayloadType>>
}
export const TableDataContext = createContext<IContext>({
  tdState: initialState,
  tdDispatch: () => { }
})
export const XTableDataProvider = ({ children }: { children?: any }) => {
  const [tdState, tdDispatch] = useReducer(reducer, initialState)
  return (
    <TableDataContext.Provider value={{ tdState, tdDispatch }}>
      {children}
    </TableDataContext.Provider>
  )
}


export const useXTableData = () => useContext(TableDataContext)