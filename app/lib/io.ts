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

const getCsvColumns = (file: File) => {
  return new Promise<string[] | undefined>((resolve: any, reject: any) => {
    const handleParseComplete = (result: ParseResult<any>) => {
      if (result.errors.length > 0) {
        return reject(result.errors)
      }
      resolve(result.data?.[0])
    }

    Papa.parse(file, {
      complete: handleParseComplete,
      preview: 1
    })
  })
}

