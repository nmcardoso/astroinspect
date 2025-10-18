const BASE_URL = `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?`


export class HipsStamp implements IResourceFetch {
  private hips
  private ra
  private dec
  private size
  private fov
  private minCut
  private maxCut
  private colormap
  private stretch

  constructor(
    hips: string,
    ra: number,
    dec: number,
    size: number,
    fov: number,
    minCut: string,
    maxCut: string,
    stretch: string,
    colormap: string,
    inverse: boolean,
  ) {
    this.hips = hips
    this.ra = ra
    this.dec = dec
    this.fov = fov
    this.size = size
    this.minCut = minCut
    this.maxCut = maxCut
    this.stretch = stretch
    this.colormap = inverse ? colormap : `${colormap}_r`
  }

  fetch(config: IResourceFetchConfig) {
    return new Promise((resolve, reject) => {
      const params = {
        hips: this.hips,
        projection: 'TAN',
        coordsys: 'icrs',
        rotation_angle: '0',
        format: 'jpg',
        width: String(this.size),
        height: String(this.size),
        fov: String(parseFloat(this.fov as unknown as string) / 60), // fov is stored in arcmin, H2F requires deg
        ra: String(this.ra),
        dec: String(this.dec),
        min_cut: this.minCut,
        max_cut: this.maxCut,
        stretch: this.stretch,
        cmap: this.colormap,
      }

      const url = new URL(BASE_URL)
      const s = new URLSearchParams(params)
      url.search = s.toString()
      const urlStr = url.toString()

      const i = new Image()
      i.onload = () => resolve({data: urlStr})
      i.onerror = (e) => reject(e)
      i.src = urlStr
    })
  }
}



export const HIPS_REGISTRY = [
  // 2 MASS
  {
    desc: '2MASS (color)',
    short: '2MASS',
    id: 'CDS/P/2MASS/color',
    wl: 'IR',
  },
  {
    desc: '2MASS (J band)',
    short: '2MASS (J)',
    id: 'CDS/P/2MASS/J',
    wl: 'IR',
  },
  {
    desc: '2MASS (H band)',
    short: '2MASS (H)',
    id: 'CDS/P/2MASS/H',
    wl: 'IR',
  },
  {
    desc: '2MASS (K band)',
    short: '2MASS (K)',
    id: 'CDS/P/2MASS/K',
    wl: 'IR',
  },


  // DENIS
  {
    desc: 'DENIS (I band)',
    short: 'DENIS (I)',
    id: 'CDS/P/DENIS/I',
    wl: 'IR',
  },


  // DES
  {
    desc: 'DES DR2 (color)',
    short: 'DES',
    id: 'CDS/P/DES-DR2/ColorIRG',
    wl: 'OPT',
  },
  {
    desc: 'DES DR2 (Y band)',
    short: 'DES (Y)',
    id: 'CDS/P/DES-DR2/Y',
    wl: 'OPT',
  },
  {
    desc: 'DES DR2 (g band)',
    short: 'DES (g)',
    id: 'CDS/P/DES-DR2/g',
    wl: 'OPT',
  },
  {
    desc: 'DES DR2 (i band)',
    short: 'DES (i)',
    id: 'CDS/P/DES-DR2/i',
    wl: 'OPT',
  },
  {
    desc: 'DES DR2 (r band)',
    short: 'DES (r)',
    id: 'CDS/P/DES-DR2/r',
    wl: 'OPT',
  },
  {
    desc: 'DES DR2 (z band)',
    short: 'DES (z)',
    id: 'CDS/P/DES-DR2/z',
    wl: 'OPT',
  },


  // Legacy Surveys
  {
    desc: 'Legacy Surveys DR10 (color)',
    short: 'LS',
    id: 'CDS/P/DESI-Legacy-Surveys/DR10/color',
    wl: 'OPT',
  },
  {
    desc: 'Legacy Surveys DR10 (g band)',
    short: 'LS (g)',
    id: 'CDS/P/DESI-Legacy-Surveys/DR10/g',
    wl: 'OPT',
  },
  {
    desc: 'Legacy Surveys DR10 (r band)',
    short: 'LS (r)',
    id: 'CDS/P/DESI-Legacy-Surveys/DR10/r',
    wl: 'OPT',
  },
  {
    desc: 'Legacy Surveys DR10 (i band)',
    short: 'LS (i)',
    id: 'CDS/P/DESI-Legacy-Surveys/DR10/i',
    wl: 'OPT',
  },
  {
    desc: 'Legacy Surveys DR10 (z band)',
    short: 'LS (z)',
    id: 'CDS/P/DESI-Legacy-Surveys/DR10/z',
    wl: 'OPT',
  },


  // Galex
  {
    desc: 'Galex DR6+7 (color)',
    short: 'Galex',
    id: 'CDS/P/GALEXGR6_7/color',
    wl: 'OPT',
  },
  {
    desc: 'Galex DR6+7 (FUV)',
    short: 'Galex (FUV)',
    id: 'CDS/P/GALEXGR6_7/FUV',
    wl: 'OPT',
  },
  {
    desc: 'Galex DR6+7 (NUV)',
    short: 'Galex (NUV)',
    id: 'CDS/P/GALEXGR6_7/NUV',
    wl: 'OPT',
  },


  // PanSTARRS
  {
    desc: 'PanSTARRS DR1 (color)',
    short: 'PanSTARRS',
    id: 'CDS/P/PanSTARRS/DR1/color-i-r-g',
    wl: 'OPT',
  },
  {
    desc: 'PanSTARRS DR1 (g band)',
    short: 'PanSTARRS (g)',
    id: 'CDS/P/PanSTARRS/DR1/g',
    wl: 'OPT',
  },
  {
    desc: 'PanSTARRS DR1 (r band)',
    short: 'PanSTARRS (r)',
    id: 'CDS/P/PanSTARRS/DR1/r',
    wl: 'OPT',
  },
  {
    desc: 'PanSTARRS DR1 (i band)',
    short: 'PanSTARRS (i)',
    id: 'CDS/P/PanSTARRS/DR1/i',
    wl: 'OPT',
  },
  {
    desc: 'PanSTARRS DR1 (z band)',
    short: 'PanSTARRS (z)',
    id: 'CDS/P/PanSTARRS/DR1/z',
    wl: 'OPT',
  },
  {
    desc: 'PanSTARRS DR1 (y band)',
    short: 'PanSTARRS (y)',
    id: 'CDS/P/PanSTARRS/DR1/y',
    wl: 'OPT',
  },


  // Skymapper
  {
    desc: 'Skymapper DR4 (color)',
    short: 'Skymapper',
    id: 'CDS/P/Skymapper/DR4/color',
    wl: 'OPT',
  },
  {
    desc: 'Skymapper DR4 (g band)',
    short: 'Skymapper (g)',
    id: 'CDS/P/Skymapper/DR4/g',
    wl: 'OPT',
  },
  {
    desc: 'Skymapper DR4 (i band)',
    short: 'Skymapper (i)',
    id: 'CDS/P/Skymapper/DR4/i',
    wl: 'OPT',
  },
  {
    desc: 'Skymapper DR4 (r band)',
    short: 'Skymapper (r)',
    id: 'CDS/P/Skymapper/DR4/r',
    wl: 'OPT',
  },


  // unWISE
  {
    desc: 'unWISE (color)',
    short: 'unWISE',
    id: 'CDS/P/unWISE/color-W2-W1W2-W1',
    wl: 'OPT',
  },
  {
    desc: 'unWISE (W1 band)',
    short: 'unWISE (W1)',
    id: 'CDS/P/unWISE/color-W1',
    wl: 'OPT',
  },
  {
    desc: 'unWISE (W2 band)',
    short: 'unWISE (W2)',
    id: 'CDS/P/unWISE/color-W2',
    wl: 'OPT',
  },
]



export const hips = {
  '2MASS': {
    wavelength: 'IR',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/2MASS/color',
      },
      {
        band: 'J',
        id: 'CDS/P/2MASS/J',
      },
      {
        band: 'H',
        id: 'CDS/P/2MASS/H',
      },
      {
        band: 'K',
        id: 'CDS/P/2MASS/K',
      },
    ],
  },
  'DENIS': {
    wavelenght: 'IR',
    sources: [
      {
        band: 'I',
        id: 'CDS/P/DENIS/I',
      },
    ],
  },
  'DES DR2': {
    wavelenght: 'OPT',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/DES-DR2/ColorIRG',
      },
      {
        band: 'Y',
        id: 'CDS/P/DES-DR2/Y',
      },
      {
        band: 'g',
        id: 'CDS/P/DES-DR2/g',
      },
      {
        band: 'i',
        id: 'CDS/P/DES-DR2/i',
      },
      {
        band: 'r',
        id: 'CDS/P/DES-DR2/r',
      },
      {
        band: 'z',
        id: 'CDS/P/DES-DR2/z',
      },
    ],
  },
  'DESI Legacy Surveys': {
    wavelenght: 'OPT',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/DESI-Legacy-Surveys/DR10/color',
      },
      {
        band: 'g',
        id: 'CDS/P/DESI-Legacy-Surveys/DR10/g',
      },
      {
        band: 'r',
        id: 'CDS/P/DESI-Legacy-Surveys/DR10/r',
      },
      {
        band: 'i',
        id: 'CDS/P/DESI-Legacy-Surveys/DR10/i',
      },
      {
        band: 'z',
        id: 'CDS/P/DESI-Legacy-Surveys/DR10/z',
      },
    ]
  },
  'Galex': {
    wavelength: 'UV',
    sources: [
      {
        band: 'FUV',
        id: 'CDS/P/GALEXGR6_7/FUV',
      },
      {
        band: 'NUV',
        id: 'CDS/P/GALEXGR6_7/NUV',
      },
      {
        band: 'color',
        id: 'CDS/P/GALEXGR6_7/color',
      },
    ],
  },
  'PanSTARRS': {
    wavelength: 'OPT',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/PanSTARRS/DR1/color-i-r-g',
      },
      {
        band: 'g',
        id: 'CDS/P/PanSTARRS/DR1/g',
      },
      {
        band: 'i',
        id: 'CDS/P/PanSTARRS/DR1/i',
      },
      {
        band: 'r',
        id: 'CDS/P/PanSTARRS/DR1/r',
      },
      {
        band: 'y',
        id: 'CDS/P/PanSTARRS/DR1/y',
      },
      {
        band: 'z',
        id: 'CDS/P/PanSTARRS/DR1/z',
      },
    ],
  },
  'Skymapper': {
    wavelength: 'OPT',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/Skymapper/DR4/color',
      },
      {
        band: 'g',
        id: 'CDS/P/Skymapper/DR4/g',
      },
      {
        band: 'i',
        id: 'CDS/P/Skymapper/DR4/i',
      },
      {
        band: 'r',
        id: 'CDS/P/Skymapper/DR4/r',
      },
    ],
  },
  'unWISE': {
    wavelength: 'IR',
    sources: [
      {
        band: 'color',
        id: 'CDS/P/unWISE/color-W2-W1W2-W1',
      },
      {
        band: 'W1',
        id: 'CDS/P/unWISE/W1',
      },
      {
        band: 'W2',
        id: 'CDS/P/unWISE/W2',
      },
    ],
  },
}
