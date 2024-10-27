import Papa, { ParseResult } from 'papaparse'
import { BaseReader } from './basereader'



export class CSVReader extends BaseReader {
  file: string | File

  constructor(file: string | File) {
    super()
    this.file = file
  }

  private readFromFile(): Promise<{}[]> {
    return new Promise((resolve: any, reject: any) => {
      Papa.parse(this.file, {
        complete: ({ data }) => resolve(data),
        error: (e) => reject(e),
        delimitersToGuess: [',', '\t', ' ', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
        skipEmptyLines: true,
        header: true,
        dynamicTyping: true,
        transformHeader(header, index) {
          return `tab:${header}`
        },
      })
    })
  }

  private readFromUrl(): Promise<{}[]> {
    return new Promise((resolve: any, reject: any) => {
      Papa.parse(this.file, {
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

  public read() {
    if (typeof this.file === 'string' || this.file instanceof String) {
      return this.readFromUrl()
    } else {
      return this.readFromFile()
    }
  }

  private getColumnsFromFile() {
    return new Promise<string[]>((resolve: any, reject: any) => {
      const handleParseComplete = (result: ParseResult<any>) => {
        if (result.errors.length > 0) {
          return reject(result.errors)
        }
        resolve(result.data?.[0])
      }
  
      Papa.parse(this.file, {
        complete: handleParseComplete,
        preview: 1,
      })
    })
  }

  private getColumnsFromUrl() {
    return new Promise<string[]>((resolve: any, reject: any) => {
      const handleParseComplete = (result: ParseResult<any>) => {
        if (result.errors.length > 0) {
          return reject(result.errors)
        }
        resolve(result.data?.[0])
      }
  
      Papa.parse(this.file, {
        complete: handleParseComplete,
        preview: 1,
        download: true,
      })
    })
  }

  public getColumns() {
    if (typeof this.file === 'string' || this.file instanceof String) {
      return this.getColumnsFromUrl()
    } else {
      return this.getColumnsFromFile()
    }
  }

  getDataTypes() {
    return undefined
  }
}