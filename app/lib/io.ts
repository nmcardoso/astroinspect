import Papa, { ParseResult } from 'papaparse'
import { parquetRead, parquetMetadata, asyncBufferFromUrl, parquetMetadataAsync } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'


const readCsvFromFile = (file: File) => {
  if (file) {
    return new Promise((resolve: any, reject: any) => {
      Papa.parse(file, {
        complete: ({ data }) => resolve(data),
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

const readCsvFromUrl = (file: string) => {
  if (file) {
    return new Promise((resolve: any, reject: any) => {
      Papa.parse(file, {
        complete: ({ data }) => resolve(data),
        error: (e: any) => reject(e),
        skipEmptyLines: true,
        header: true,
        dynamicTyping: true,
        download: true,
        transformHeader(header, index) {
          return `tab:${header}`
        },
      })
    })
  }
}

const readCsv = (file: string | File) => {
  if (typeof file === 'string' || file instanceof String) {
    return readCsvFromUrl(file as string)
  } else {
    return readCsvFromFile(file as File)
  }
}



const getCsvColumnsFromFile = (file: File) => {
  return new Promise<string[] | undefined>((resolve: any, reject: any) => {
    const handleParseComplete = (result: ParseResult<any>) => {
      if (result.errors.length > 0) {
        return reject(result.errors)
      }
      resolve(result.data?.[0])
    }

    Papa.parse(file, {
      complete: handleParseComplete,
      preview: 1,
    })
  })
}

const getCsvColumnsFromUrl = (file: string) => {
  return new Promise<string[] | undefined>((resolve: any, reject: any) => {
    const handleParseComplete = (result: ParseResult<any>) => {
      if (result.errors.length > 0) {
        return reject(result.errors)
      }
      resolve(result.data?.[0])
    }

    Papa.parse(file, {
      complete: handleParseComplete,
      preview: 1,
      download: true,
    })
  })
}

const getCsvColumns = (file: File | string) => {
  if (typeof file === 'string' || file instanceof String) {
    return getCsvColumnsFromUrl(file as string)
  } else {
    return getCsvColumnsFromFile(file as File)
  }
}



const readParquetFromFile = (file: File) => {
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

const readParquetFromUrl = (file: string) => {
  return new Promise<{}[]>((resolve: any, reject: any) => {
    const wrapper = async () => {
      await parquetRead({
        file: await asyncBufferFromUrl(file),
        onComplete: (data: any) => resolve(data),
        compressors: compressors,
      })
    }
    wrapper().catch((error) => reject(error))
  })
}

const readParquet = (file: string | File) => {
  if (typeof file === 'string' || file instanceof String) {
    return readParquetFromUrl(file as string)
  } else {
    return readParquetFromFile(file as File)
  }
}



const getParquetColumnsFromFile = async (file: File) => {
  const meta = parquetMetadata(await file.arrayBuffer())
  return meta.schema.filter((e) => e.name !== 'schema').map((e) => e.name)
}

const getParquetColumnsFromUrl = async (url: string) => {
  const meta = await parquetMetadataAsync(await asyncBufferFromUrl(url))
  return meta.schema.filter((e) => e.name !== 'schema').map((e) => e.name)
}

const getParquetColumns = (file: string | File) => {
  if (typeof file === 'string' || file instanceof String) {
    return getParquetColumnsFromUrl(file as string)
  } else {
    return getParquetColumnsFromFile(file as File)
  }
}



export default class TableReader {
  file: File | string
  ext?: string
  columns?: string[]
  isUrl: boolean

  constructor(file: File | string) {
    this.ext = undefined
    this.columns = undefined
    this.isUrl = typeof file === 'string' || file instanceof String
    this.file = file
  }

  getFileExt() {
    if (!this.ext) {
      if (!this.isUrl) {
        this.ext = (this.file as File).name.split('.').pop()?.toLowerCase()
      } else {
        this.ext = (this.file as string).split('.').pop()?.toLowerCase()
      }
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
    if (['csv', 'tsv', 'dat', 'txt'].includes(this.getFileExt() || '')) {
      this.columns = await getCsvColumns(this.file)
    } else if (['parquet', 'parq', 'par', 'pq'].includes(this.getFileExt() || '')) {
      this.columns = await getParquetColumns(this.file)
    }
    return this.columns
  }
}