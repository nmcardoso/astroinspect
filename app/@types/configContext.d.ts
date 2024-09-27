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

interface IGrid extends IterableInterface {
  data?: any,
  colDef?: any,
  api?: any,
  isLoaded: boolean,
  shouldLoad: boolean,
}

interface ITrilogyConfig extends IterableInterface {
  R?: string[],
  G?: string[],
  B?: string[],
  noise?: number,
  Q?: number
}

interface ILuptonConfig extends IterableInterface {
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

interface ICustomImagingColumn extends IterableInterface {
  url: string,
  fileExtension: string,
  columnIndex: number,
}

interface ICustomImaging extends IterableInterface {
  enabled: boolean,
  columns: ICustomImagingColumn[],
}

type CurrentViewType = 'settings' | 'grid'

interface IState {
  schemaVersion: number,
  table: ITableConfig,
  grid: IGrid,
  currentView: CurrentViewType,
  cols: {
    classification: IClassification,
    sdssCatalog: ISdssCatalog,
    splusImaging: ISplusImaging,
    legacyImaging: ILegacyImaging,
    sdssSpectra: ISdssSpectra,
    splusPhotoSpectra: ISplusPhotoSpectra,
    customImaging: ICustomImaging,
  }
}


interface IAction<P> {
  type: number,
  payload: P
}

type PayloadType = IState | ITrilogyConfig | ISplusImaging | ILuptonConfig
  | ITableConfig | IClassification | ILegacyImaging | ISdssSpectra
  | ISdssCatalog | ISplusPhotoSpectra | IGrid


interface IContext {
  tcState: IState,
  tcDispatch: Dispatch<IAction<PayloadType>>
}