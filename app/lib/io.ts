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

const getParquetColumns = async (file: File) => {
  const meta = parquetMetadata(await file.arrayBuffer())
  return meta.schema.filter((e) => e.name !== 'schema').map((e) => e.name)
}



export default class TableReader {
  file: File
  ext?: string
  columns?: string[]

  constructor(file: File) {
    this.file = file
    this.ext = undefined
    this.columns = undefined
  }

  getFileExt() {
    if (!this.ext) {
      this.ext = this.file.name.split('.').pop()?.toLowerCase()
    }
    return this.ext
  }

  async read() {
    if (this.getFileExt() === 'csv') {
      return await readCsv(this.file)
    } else if (this.getFileExt() === 'parquet') {
      const data = await readParquet(this.file)
      const cols = await this.getColumns()
      if (!!cols) {
        return data.map(e => Object.fromEntries(
          Object.entries(e).map(([key, value]) => [`tab:${cols[key]}`, value])
        ))
      } else {
        return data
      }
    }
  }

  async getColumns() {
    if (['csv', 'tsv', 'dat', 'txt'].includes(this.getFileExt())) {
      this.columns = await getCsvColumns(this.file)
    } else if (['parquet', 'parq', 'par', 'pq'].includes(this.getFileExt())) {
      this.columns = await getParquetColumns(this.file)
    }
    return this.columns
  }
}