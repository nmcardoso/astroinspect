import { createContext, Dispatch, ReactElement, useContext, useReducer } from 'react'
import localforage from 'localforage'

interface IterableInterface {
  [key: string]: any | undefined
}

interface ITableConfig extends IterableInterface {
  type: string,
  file: File | null,
  url: string | null,
  selectedColumnsId: number[]
  columns: string[],
  raIndex: number | null,
  decIndex: number | null,
  processing: boolean,
}

export interface ITrilogyConfig extends IterableInterface {
  R?: string[],
  G?: string[],
  B?: string[],
  noise?: number,
  Q?: number
}

export interface ILuptonConfig extends IterableInterface {
  R?: string,
  G?: string,
  B?: string,
  stretch?: number,
  Q?: number
}

interface ISplusImaging extends IterableInterface {
  enabled?: boolean,
  type?: string,
  trilogyConfig: ITrilogyConfig,
  luptonConfig: ILuptonConfig
}

interface IClassification extends IterableInterface {
  enabled: boolean,
  type: string,
  classNames: string[],
  positiveClass: string | null,
  negativeClass: string | null
}

interface ILegacyImaging extends IterableInterface {
  enabled: boolean
}

interface ISdssSpectra extends IterableInterface {
  enabled: boolean
}

interface ISdssCatalog extends IterableInterface {
  selectedColumns: {
    table: string,
    column: string
  }[]
}

export interface IState {
  schemaVersion: number,
  table: ITableConfig,
  classification: IClassification,
  splusCatalog: {},
  sdssCatalog: ISdssCatalog,
  splusImaging: ISplusImaging,
  legacyImaging: ILegacyImaging,
  sdssSpectra: ISdssSpectra,
  loadId: number
}

export const SCHEMA_VERSION: number = 7

const initialState: IState = {
  schemaVersion: SCHEMA_VERSION,
  table: {
    type: 'local',
    file: null,
    url: null,
    selectedColumnsId: [],
    columns: [],
    raIndex: null,
    decIndex: null,
    processing: false,
  },
  classification: {
    enabled: true,
    type: 'categorical',
    classNames: [],
    positiveClass: '',
    negativeClass: ''
  },
  splusCatalog: {

  },
  sdssCatalog: {
    selectedColumns: []
  },
  splusImaging: {
    enabled: true,
    type: 'trilogy',
    trilogyConfig: {
      R: ['R', 'I', 'F861', 'Z'],
      G: ['G', 'F515', 'F660'],
      B: ['U', 'F378', 'F395', 'F410', 'F430'],
      noise: 0.15,
      Q: 0.15
    },
    luptonConfig: {
      R: 'I',
      G: 'R',
      B: 'G',
      stretch: 3,
      Q: 8
    }
  },
  legacyImaging: {
    enabled: true
  },
  sdssSpectra: {
    enabled: true
  },
  loadId: 0
}

interface IAction<P> {
  type: string,
  payload: P
}

const persistStateAsync = (state: IState) => {
  const s = { ...state, table: initialState.table, loadId: initialState.loadId }
  localforage.setItem('tableConfigState', s, (err, value) => {
    if (err) console.error(err)
  })
}

const loadSavedStateAction = (state: IState, action: IAction<IState>) => {
  return action.payload
}

const setSplusTrilogyConfigAction = (state: IState, action: IAction<ITrilogyConfig>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.splusImaging.trilogyConfig[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setSplusImagingAction = (state: IState, action: IAction<ISplusImaging>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.splusImaging[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setSplusLuptonConfigAction = (state: IState, action: IAction<ILuptonConfig>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.splusImaging.luptonConfig[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setFileInputAction = (state: IState, action: IAction<ITableConfig>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.table[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setClassificationAction = (state: IState, action: IAction<IClassification>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.classification[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setLegacyImagingAction = (state: IState, action: IAction<ILegacyImaging>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.legacyImaging[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setSdssSpectraAction = (state: IState, action: IAction<ISdssSpectra>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.sdssSpectra[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setSdssCatalogAction = (state: IState, action: IAction<ISdssCatalog>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.sdssCatalog[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setLoadId = (state: IState, action: IAction<{ id: number }>) => {
  const s = { ...state }
  s.loadId = action.payload.id
  return s
}

type PayloadType = IState | ITrilogyConfig | ISplusImaging | ILuptonConfig
  | ITableConfig | IClassification | ILegacyImaging | ISdssSpectra
  | ISdssCatalog

const reducer = (state: IState, action: IAction<any>) => {
  switch (action.type) {
    case 'loadSavedState':
      return loadSavedStateAction(state, action)
    case 'setSplusTrilogyConfig':
      return setSplusTrilogyConfigAction(state, action)
    case 'setSplusImaging':
      return setSplusImagingAction(state, action)
    case 'setSplusLuptonConfig':
      return setSplusLuptonConfigAction(state, action)
    case 'setFileInput':
      return setFileInputAction(state, action)
    case 'setClassification':
      return setClassificationAction(state, action)
    case 'setLegacyImaging':
      return setLegacyImagingAction(state, action)
    case 'setSdssImaging':
      return setSdssSpectraAction(state, action)
    case 'setSdssCatalog':
      return setSdssCatalogAction(state, action)
    case 'setLoadId':
      return setLoadId(state, action)
    default:
      return state
  }
}

export interface IContext {
  tcState: IState,
  tcDispatch: Dispatch<IAction<PayloadType>>
}
export const TableConfigContext = createContext<IContext>({
  tcState: initialState,
  tcDispatch: () => { }
})
export const XTableConfigProvider = ({ children }: { children?: any }) => {
  const [tcState, tcDispatch] = useReducer(reducer, initialState)
  return (
    <TableConfigContext.Provider value={{ tcState, tcDispatch }}>
      {children}
    </TableConfigContext.Provider>
  )
}


export const useXTableConfig = () => useContext(TableConfigContext)