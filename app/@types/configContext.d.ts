interface IterableInterface {
  [key: string]: any | undefined
}

interface ITableConfig extends IterableInterface {
  type: 'local' | 'remote'
  file?: File
  url?: string
  selectedColumnsId: number[]
  columns: string[]
  raIndex?: number
  decIndex?: number
  raCol?: string
  decCol?: string
  state: 'unloaded' | 'loading' | 'success' | 'positionNotFound' | 'error'
  isSameFile: boolean
  dataTypes?: string[]
}

interface IGrid extends IterableInterface {
  data?: any
  colDef?: any
  api?: GridApi
  isLoaded: boolean
  currColConfigs?: ICols
  currTable?: ITableConfig
  editable: boolean
}

interface ITrilogyConfig extends IterableInterface {
  R?: string[]
  G?: string[]
  B?: string[]
  noise?: number
  Q?: number
}

interface ILuptonConfig extends IterableInterface {
  R?: string
  G?: string
  B?: string
  stretch?: number
  Q?: number
}

interface ISplusImaging extends IterableInterface {
  enabled?: boolean
  type: 'trilogy' | 'lupton'
  pixelScale: number
  trilogyConfig: ITrilogyConfig
  luptonConfig: ILuptonConfig
}

interface IClassification extends IterableInterface {
  enabled: boolean
  type: string
  classNames: string[]
  positiveClass: string | null
  negativeClass: string | null
  filterUnclassified: boolean
  keyMap: { [key: string]: any }
}

interface ILegacyImaging extends IterableInterface {
  enabled: boolean
  pixelScale: number
  autoPixelScale: boolean
  dataRelease: string
}

interface IHipsSettings extends IterableInterface {
  minPixelCut: string,
  maxPixelCut: string,
  colormap: string,
  stretch: string,
  invert: boolean,
  fov: number,
  autofov: boolean,
}

interface IHipsImaging extends IterableInterface {
  enabled: boolean
  defaultSettings: IHipsSettings
  surveySettings: {[key: string]: IHipsSettings}
  selectedSurveys: string[]
}

interface ISdssSpectra extends IterableInterface {
  enabled: boolean
}

interface ISdssCatalog extends IterableInterface {
  enabled: boolean
  selectedColumns: {
    table: string,
    column: string
  }[]
}

interface ISplusPhotoSpectra extends IterableInterface {
  enabled: boolean,
  selectedLines: string[]
}

interface ICustomImagingColumn extends IterableInterface {
  type: 'folder' | 'url',
  folder?: FileList | null,
  folderStructure?: string[],
  prepend: string,
  append: string,
  columnIndex: number,
  visible: boolean,
}

interface ICustomImaging extends IterableInterface {
  enabled: boolean,
  columns: ICustomImagingColumn[],
}

interface ICols extends IterableInterface {
  classification: IClassification
  sdssCatalog: ISdssCatalog
  splusImaging: ISplusImaging
  legacyImaging: ILegacyImaging
  hipsImaging: IHipsImaging
  sdssSpectra: ISdssSpectra
  splusPhotoSpectra: ISplusPhotoSpectra
  customImaging: ICustomImaging
}

type CurrentViewType = 'settings' | 'grid' | 'plots'


interface IScatterPlot {
  xColumn: string
  yColumn: string
  colorColumn: string
  sizeColumn: string
  filterOutliers: boolean
}

interface IColorPlot {
  xColumn1: string
  xColumn2: string
  yColumn1: string
  yColumn2: string
  colorColumn: string
  sizeColumn: string
  filterOutliers: boolean
}

interface IHistogramPlot {
  column: string
  bins: number
  filterOutliers: boolean
}

interface IPlots {
  scatter: IScatterPlot
  color: IColorPlot
  histogram: IHistogramPlot
  currentView: PlotsCurrentViewType
  filterIndex: numebr[]
  filterView?: PlotsCurrentViewType
  inspectSelected: boolean
}

interface IUserInterface {
  figureSize: number
  invertColorDarkMode: boolean
  showReticle: boolean
}

interface IState {
  schemaVersion: number
  table: ITableConfig
  grid: IGrid
  currentView: CurrentViewType
  cols: ICols
  plots: IPlots
  ui: IUserInterface
}

type PlotsCurrentViewType = 'scatter' | 'color' | 'histogram' | 'aladin'

interface IAction<P> {
  type: number,
  payload: P
}

type PayloadType = IState | ITrilogyConfig | ISplusImaging | ILuptonConfig
  | ITableConfig | IClassification | ILegacyImaging | ISdssSpectra
  | ISdssCatalog | ISplusPhotoSpectra | IGrid | IPlots


interface IContext {
  tcState: IState,
  tcDispatch: Dispatch<IAction<PayloadType>>
}