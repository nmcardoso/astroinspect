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