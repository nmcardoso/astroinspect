export function setUrlParams(url: string, params: { [key: string]: string }) {
  const u = new URL(url)
  for (const k in params) {
    u.searchParams.set(k, params[k])
  }
  return u.toString()
}

export function obj2formData(obj: { [key: string]: any }) {
  const fd = new FormData()
  for (const key in obj) {
    fd.append(key, obj[key])
  }
  return fd
}

export function obj2qs(obj: { [key: string]: any }) {
  return Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')
}

export function objPosId(ra: number, dec: number) {
  return [Math.round(ra * 1e10), Math.round(dec * 1e10)]
}

export function timeConvert(
  value: number,
  fromUnit: 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month',
  toUnit: 'ms'
) {
  switch (toUnit) {
    case 'ms':
      switch (fromUnit) {
        case 'sec':
          return 1000 * value
        case 'min':
          return 60 * 1000 * value
        case 'hour':
          return 60 * 60 * 1000 * value
        case 'day':
          return 24 * 60 * 60 * 1000 * value
        case 'week':
          return 7 * 60 * 60 * 1000 * value
        case 'month':
          return 30 * 24 * 60 * 60 * 1000 * value
      }
  }
}

export function getBaseURL() {
  return process.env.NODE_ENV === 'development' ? '/' : '/'
}


export function findIndex(query: string, items: string[]) {
  const pattern = `^${query}_?J?\d*`
  const regex = RegExp(pattern, 'gi')
  return items.findIndex((item, i) => {
    return regex.exec(item) !== null
  })
}


export function isUrlValid(url: string) {
  const urlRE = new RegExp(
    "^" +
    // protocol identifier (optional)
    // short syntax // still required
    "(?:(?:(?:https?|ftp):)?\\/\\/)" +
    // user:pass BasicAuth (optional)
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    "(?:" +
    "(?:" +
    "[a-z0-9\\u00a1-\\uffff]" +
    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
    ")?" +
    "[a-z0-9\\u00a1-\\uffff]\\." +
    ")+" +
    // TLD identifier name, may end with dot
    "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
    ")" +
    // port number (optional)
    "(?::\\d{2,5})?" +
    // resource path (optional)
    "(?:[/?#]\\S*)?" +
    "$", "i"
  )
  return urlRE.test(url)
}