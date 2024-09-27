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

interface IState {
  schemaVersion: number,
  table: ITableConfig,
  classification: IClassification,
  splusCatalog: {},
  sdssCatalog: ISdssCatalog,
  splusImaging: ISplusImaging,
  legacyImaging: ILegacyImaging,
  sdssSpectra: ISdssSpectra,
  splusPhotoSpectra: ISplusPhotoSpectra,
  stampModal: IStampModal,
  customImaging: ICustomImaging,
}


interface IAction<P> {
  type: ContextActions,
  payload: P
}

type PayloadType = IState | ITrilogyConfig | ISplusImaging | ILuptonConfig
  | ITableConfig | IClassification | ILegacyImaging | ISdssSpectra
  | ISdssCatalog | ISplusPhotoSpectra;


interface IContext {
  tcState: IState,
  tcDispatch: Dispatch<IAction<PayloadType>>
}