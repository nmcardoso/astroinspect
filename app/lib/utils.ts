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
  const pattern = `^${query}_?J?\d*?$`
  const regex = RegExp(pattern, 'gi')
  return items.findIndex((item, i) => {
    return regex.exec(item) !== null
  })
}