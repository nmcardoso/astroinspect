import axios from "axios"
import { BaseReader } from "./basereader"


function parseRow(row: Element, fields: NodeListOf<Element>) {
  const rowData = row?.querySelectorAll('TD')
  const result: any = {}
    
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i]?.getAttribute('name')
    const dataType = fields[i]?.getAttribute('datatype')
    let value: any = rowData?.[i]?.textContent
    
    if (dataType === 'float' || dataType === 'double') {
      value = parseFloat(value as string)
    } else if (dataType === 'int' || dataType === 'short' || dataType === 'long' || dataType === 'bit') {
      value = parseInt(value as string)
    } else if (dataType === 'boolean') {
      value = new Boolean(value)
    }
    
    if (!!key) result[`tab:${key}`] = value
  }

  return result
}


export function parseVotable(data: string, maxRows?: number): object[] {
  let xml
  if (typeof data === 'string') {
    const parser = new DOMParser()
    xml = parser.parseFromString(data, 'application/xml')
  } else {
    xml = data
  }
  
  let nRows 
  nRows = xml.querySelector('VOTABLE > RESOURCE > INFO[name="TableRows"]')?.getAttribute('value')
  if (nRows === undefined) {
    nRows = xml.querySelector('VOTABLE > RESOURCE > TABLE')?.getAttribute('nrows')
  }
  
  const table = []
  if (!!nRows && parseInt(nRows) > 0) {
    maxRows = maxRows || parseInt(nRows)
    const fields = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > FIELD')
    const rows = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > DATA > TABLEDATA > TR')
    
    for (let i = 0; i < Math.min(rows.length, maxRows); i++) {
      table.push(parseRow(rows[i], fields))
    }
  }

  return table
}



export function parseVotableMetadata(data: string): {name: string | null, dataType: string | null}[] {
  let xml
  if (typeof data === 'string') {
    const parser = new DOMParser()
    xml = parser.parseFromString(data, 'application/xml')
  } else {
    xml = data
  }

  const fields = xml.querySelectorAll('VOTABLE > RESOURCE > TABLE > FIELD')
  const meta = []
  for (let i = 0; i < fields.length; i++) {
    meta.push({
      name: fields[i].getAttribute('name'), 
      dataType: fields[i].getAttribute('datatype')
    })
  }
  return meta
}



const dataTypeMap: any = {
  BOOLEAN: 'boolean',
  BIT: 'number',
  UNSIGNEDBYTE: 'number',
  SHORT: 'number',
  INT: 'number',
  LONG: 'number',
  CHAR: 'text',
  UNICODECHAR: 'text',
  FLOAT: 'number',
  DOUBLE: 'number',
  FLOATCOMPLEX: 'number',
  DOUBLECOMPLES: 'number',
  DEFAULT: undefined,
}



export class VotableReader extends BaseReader {
  private file: string | File
  private columns?: string[]
  private meta?: any

  constructor(file: string | File) {
    super()
    this.file = file
    this.columns = undefined
    this.meta = undefined
  }

  private readFromFile() {
    return new Promise<{}[]>((resolve: any, reject: any) => {
      const wrapper = async () => {
        const xml = await (this.file as File).text()
        const data = parseVotable(xml)
        resolve(data)
      }
      wrapper().catch((error) => reject(error))
    })
  }

  private readFromUrl() {
    return new Promise<{}[]>((resolve: any, reject: any) => {
      const wrapper = async () => {
        const resp = await axios.get(<string>this.file)
        const xml = resp.data
        const data = parseVotable(xml)
        console.log(data)
        resolve(data)
      }
      wrapper().catch((error) => reject(error))
    })
  }

  public async read() {
    let data
    if (typeof this.file === 'string' || this.file instanceof String) {
      data = await this.readFromUrl()
    } else {
      data = await this.readFromFile()
    }

    return data
  }

  private async getMetaFromFile() {
    if (this.meta === undefined) {
      const xml = await (this.file as File).text()
      return parseVotableMetadata(xml)
    }
    return this.meta
  }

  private async getMetaFromUrl() {
    if (this.meta === undefined) {
      const resp = await axios.get(<string>this.file)
      const xml = resp.data
      return parseVotableMetadata(xml)
    }
    return this.meta
  }

  private async getColumnsFromFile(): Promise<string[]> {
    const meta = await this.getMetaFromFile()
    return meta.map((e) => e.name)
  }

  private async getColumnsFromUrl(): Promise<string[]> {
    const meta = await this.getMetaFromUrl()
    return meta.map((e) => e.name)
  }

  public async getColumns(): Promise<string[]> {
    if (this.columns === undefined) {
      if (typeof this.file === 'string' || this.file instanceof String) {
        this.columns = await this.getColumnsFromUrl()
      } else {
        this.columns = await this.getColumnsFromFile()
      }
    }
    return this.columns
  }

  private async getDataTypesFromFile() {
    const meta = await this.getMetaFromFile()
    return meta
      .map((e) => dataTypeMap[(e.dataType.toUpperCase() || 'DEFAULT')])
  }

  private async getDataTypesFromUrl() {
    const meta = await this.getMetaFromUrl()
    return meta
      .map((e) => dataTypeMap[(e.dataType.toUpperCase() || 'DEFAULT')])
  }

  public getDataTypes() {
    if (typeof this.file === 'string' || this.file instanceof String) {
      return this.getDataTypesFromUrl()
    } else {
      return this.getDataTypesFromFile()
    }
  }
}