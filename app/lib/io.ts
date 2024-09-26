import Papa, { ParseResult } from 'papaparse'
const readCsv = (file: File) => {
  if (file) {
    return new Promise((resolve: any, reject: any) => {
      Papa.parse(file, {
        complete: ({data}) => resolve(data),
        error: (e) => reject(e),
        skipEmptyLines: true,
        header: true,
        dynamicTyping: true,
        transformHeader(header, index) {
          return `tab:${header}`
        },
      })
    })
  }
}
