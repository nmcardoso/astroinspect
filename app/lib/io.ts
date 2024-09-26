import Papa, { ParseResult } from 'papaparse'
import { parquetRead, parquetMetadata } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'


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

const readParquet = (file: File) => {
  return new Promise<{}[]>((resolve: any, reject: any) => {
    const wrapper = async () => {
      await parquetRead({
        file: await file.arrayBuffer(),
        onComplete: (data: any) => resolve(data),
        compressors: compressors,
      })
    }
    wrapper().catch((error) => reject(error))
  })
}

