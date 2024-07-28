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
  pixelScale: number,
  trilogyConfig: ITrilogyConfig,
  luptonConfig: ILuptonConfig
}

interface IClassification extends IterableInterface {
  enabled: boolean,
  type: string,
  classNames: string[],
  positiveClass: string | null,
  negativeClass: string | null,
  filterUnclassified: boolean,
  keyMap: { [key: string]: any }
}

interface ILegacyImaging extends IterableInterface {
  enabled: boolean,
  pixelScale: number,
  dataRelease: string,
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

interface ISplusPhotoSpectra extends IterableInterface {
  enabled: boolean,
  selectedLines: string[]
}

interface INearbyRedshifts extends IterableInterface {
  enabled: boolean,
}

interface IStampModal extends IterableInterface {
  showRedshift: boolean,
  showAutoFluxRadius: boolean,
  showPetroFluxRadius: boolean,
}

interface ICustomImagingColumn extends IterableInterface {
  url: string,
  fileExtension: string,
  columnIndex: number,
}

interface ICustomImaging extends IterableInterface {
  enabled: boolean,
  columns: ICustomImagingColumn[],
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
  splusPhotoSpectra: ISplusPhotoSpectra,
  nearbyRedshifts: INearbyRedshifts,
  stampModal: IStampModal,
  customImaging: ICustomImaging,
}

export const SCHEMA_VERSION: number = 9

const getInitialState = (): IState => ({
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
    enabled: false,
    type: 'categorical',
    classNames: [],
    positiveClass: '',
    negativeClass: '',
    filterUnclassified: true,
    keyMap: {}
  },
  splusCatalog: {

  },
  sdssCatalog: {
    selectedColumns: []
  },
  splusImaging: {
    enabled: true,
    type: 'trilogy',
    pixelScale: 0.25,
    trilogyConfig: {
      R: ['R', 'I', 'F861', 'Z'],
      G: ['G', 'F515', 'F660'],
      B: ['U', 'F378', 'F395', 'F410', 'F430'],
      noise: 0.15,
      Q: 0.2
    },
    luptonConfig: {
      R: 'I',
      G: 'R',
      B: 'G',
      stretch: 1.4,
      Q: 6.2
    }
  },
  legacyImaging: {
    enabled: true,
    pixelScale: 0.25,
    dataRelease: '10'
  },
  sdssSpectra: {
    enabled: true
  },
  splusPhotoSpectra: {
    enabled: true,
    selectedLines: ['iso', 'aper6']
  },
  nearbyRedshifts: {
    enabled: false
  },
  stampModal: {
    showAutoFluxRadius: false,
    showPetroFluxRadius: false,
    showRedshift: false
  },
  customImaging: {
    enabled: false,
    columns: [
      {
        url: '',
        fileExtension: '',
        columnIndex: -1,
      }
    ]
  }
})
const initialState = getInitialState()

interface IAction<P> {
  type: string,
  payload: P
}

const persistStateAsync = (state: IState) => {
  const s = { ...state, table: getInitialState().table }
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

const setSplusPhotoSpectra = (state: IState, action: IAction<ISplusPhotoSpectra>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.splusPhotoSpectra[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setNearbyRedshifts = (state: IState, action: IAction<ISplusPhotoSpectra>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.nearbyRedshifts[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setStampModal = (state: IState, action: IAction<IStampModal>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.stampModal[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const addCustomImaging = (state: IState, action: IAction<{ prevColumns: ICustomImagingColumn[] }>) => {
  const s = { ...state }
  s.customImaging.columns = [
    ...action.payload.prevColumns,
    {
      url: '',
      fileExtension: '',
      columnIndex: -1
    }
  ]
  persistStateAsync(s)
  return s
}

const updateCustomImaging = (state: IState, action: IAction<ICustomImagingColumn & { index: number }>) => {
  const s = { ...state }
  for (const k in action.payload) {
    s.customImaging.columns[action.payload.index][k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const removeCustomImaging = (state: IState, action: IAction<{ index: number, prevColumns: ICustomImagingColumn[] }>) => {
  const s = { ...state }
  s.customImaging.columns = action.payload.prevColumns.filter((_, i) => i != action.payload.index)
  persistStateAsync(s)
  return s
}

const enableCustomImaging = (state: IState, action: IAction<{ enabled: boolean }>) => {
  const s = { ...state }
  s.customImaging.enabled = action.payload.enabled
  persistStateAsync(s)
  return s
}

type PayloadType = IState | ITrilogyConfig | ISplusImaging | ILuptonConfig
  | ITableConfig | IClassification | ILegacyImaging | ISdssSpectra
  | ISdssCatalog | ISplusPhotoSpectra

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
    case 'setSplusPhotoSpectra':
      return setSplusPhotoSpectra(state, action)
    case 'setNearbyRedshifts':
      return setNearbyRedshifts(state, action)
    case 'setStampModal':
      return setStampModal(state, action)
    case 'addCustomImaging':
      return addCustomImaging(state, action)
    case 'updateCustomImaging':
      return updateCustomImaging(state, action)
    case 'removeCustomImaging':
      return removeCustomImaging(state, action)
    case 'enableCustomImaging':
      return enableCustomImaging(state, action)
    default:
      console.log(`Action ${action.type} not found`)
      return { ...state }
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