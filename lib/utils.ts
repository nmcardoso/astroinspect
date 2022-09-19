export function setUrlParams(url: string, params: { [key: string]: string }) {
  const u = new URL(url)
  for (const k in params) {
    u.searchParams.set(k, params[k])
  }
  return u.toString()
}