const LEGACY_RGB = 'https://www.legacysurvey.org/viewer-dev/cutout.jpg'


export default class LegacyService {
  getRGBUrl(ra: number | string, dec: number | string) {
    return `${LEGACY_RGB}?ra=${ra}&dec=${dec}&layer=ls-dr10-early-grz&pixscale=0.30`
  }
}