import { createContext, useContext, useReducer } from 'react'
import localforage from 'localforage'


export const SCHEMA_VERSION: number = 11

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
    pixelScale: 0.4,
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
    pixelScale: 0.4,
    dataRelease: '10'
  },
  sdssSpectra: {
    enabled: true
  },
  splusPhotoSpectra: {
    enabled: true,
    selectedLines: ['iso', 'aper6']
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



const persistStateAsync = (state: IState) => {
  const s = { ...state, table: getInitialState().table }
  localforage.setItem('tableConfigState', s, (err, value) => {
    if (err) console.error(err)
  })
}

const loadSavedState = (state: IState, action: IAction<IState>) => {
  return action.payload
}

function setAttributes<T>(state: IState, action: IAction<T>, accessor: (s: IState) => any) {
  const s = { ...state }
  for (const k in action.payload) {
    accessor(s)[k] = action.payload[k]
  }
  persistStateAsync(s)
  return s
}

const setSplusTrilogyConfig = (state: IState, action: IAction<ITrilogyConfig>) => {
  return setAttributes(state, action, (s) => s.splusImaging.trilogyConfig)
}

const setSplusImaging = (state: IState, action: IAction<ISplusImaging>) => {
  return setAttributes(state, action, (s) => s.splusImaging)
}

const setSplusLuptonConfig = (state: IState, action: IAction<ILuptonConfig>) => {
  return setAttributes(state, action, (s) => s.splusImaging.luptonConfig)
}

const setFileInput = (state: IState, action: IAction<ITableConfig>) => {
  return setAttributes(state, action, (s) => s.table)
}

const setClassification = (state: IState, action: IAction<IClassification>) => {
  return setAttributes(state, action, (s) => s.classification)
}

const setLegacyImaging = (state: IState, action: IAction<ILegacyImaging>) => {
  return setAttributes(state, action, (s) => s.legacyImaging)
}

const setSdssSpectra = (state: IState, action: IAction<ISdssSpectra>) => {
  return setAttributes(state, action, (s) => s.sdssSpectra)
}

const setSdssCatalog = (state: IState, action: IAction<ISdssCatalog>) => {
  return setAttributes(state, action, (s) => s.sdssCatalog)
}

const setSplusPhotoSpectra = (state: IState, action: IAction<ISplusPhotoSpectra>) => {
  return setAttributes(state, action, (s) => s.splusPhotoSpectra)
}

const setStampModal = (state: IState, action: IAction<IStampModal>) => {
  return setAttributes(state, action, (s) => s.stampModal)
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
  return setAttributes(state, action, (s) => s.customImaging.columns[action.payload.index])
}

const removeCustomImaging = (state: IState, action: IAction<{ index: number, prevColumns: ICustomImagingColumn[] }>) => {
  const s = { ...state }
  s.customImaging.columns = action.payload.prevColumns.filter((_, i) => i != action.payload.index)
  persistStateAsync(s)
  return s
}

const enableCustomImaging = (state: IState, action: IAction<{ enabled: boolean }>) => {
  return setAttributes(state, action, (s) => s.customImaging)
}



const reducerMap = {
  [ContextActions.LOAD_SAVED_STATE]: loadSavedState,
  [ContextActions.USER_FILE_INPUT]: setFileInput,
  [ContextActions.CLASSIFICATION_CONFIG]: setClassification,
  [ContextActions.SPLUS_TRILOGY_CONFIG]: setSplusTrilogyConfig,
  [ContextActions.SPLUS_IMAGING]: setSplusImaging,
  [ContextActions.SPLUS_LUPTON_CONFIG]: setSplusLuptonConfig,
  [ContextActions.SPLUS_PHOTO_SPECTRA]: setSplusPhotoSpectra,
  [ContextActions.LEGACY_IMAGING]: setLegacyImaging,
  [ContextActions.SDSS_IMAGING]: setSdssSpectra,
  [ContextActions.SDSS_CATALOG]: setSdssCatalog,
  [ContextActions.STAMP_MODAL]: setStampModal,
  [ContextActions.CUSTOM_IMAGE_NEW]: addCustomImaging,
  [ContextActions.CUSTOM_IMAGE_UPDATE]: updateCustomImaging,
  [ContextActions.CUSTOM_IMAGE_REMOVE]: removeCustomImaging,
  [ContextActions.CUSTOM_IMAGE_ENABLE]: enableCustomImaging,
}


const reducer = (state: IState, action: IAction<any>) => {
  return reducerMap[action.type](state, action)
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