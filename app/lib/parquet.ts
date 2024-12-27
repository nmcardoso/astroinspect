import { parquetRead, parquetMetadata, asyncBufferFromUrl, parquetMetadataAsync, FileMetaData } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'
import { BaseReader } from './basereader'


const dataTypeMap: any = {
  BOOLEAN: 'boolean',
  INT32: 'number',
  INT64: undefined,
  INT96: undefined,
  FLOAT: 'number',
  DOUBLE: 'number',
  STRING: 'text',
  BYTE_ARRAY: 'object',
  FIXED_LEN_BYTE_ARRAY: 'object',
  DEFAULT: undefined,
}


export class ParquetReader extends BaseReader {
  private file: string | File
  private columns?: string[]
  private meta?: FileMetaData

  constructor(file: string | File) {
    super()
    this.file = file
    this.columns = undefined
    this.meta = undefined
  }

  private readFromFile() {
    return new Promise<{}[]>((resolve: any, reject: any) => {
      const wrapper = async () => {
        await parquetRead({
          file: await (this.file as File).arrayBuffer(),
          onComplete: (data: any) => resolve(data),
          compressors: compressors,
        })
      }
      wrapper().catch((error) => reject(error))
    })
  }

  private readFromUrl() {
    return new Promise<{}[]>((resolve: any, reject: any) => {
      const wrapper = async () => {
        await parquetRead({
          file: await asyncBufferFromUrl({ url: <string>this.file }),
          onComplete: (data: any) => resolve(data),
          compressors: compressors,
        })
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

    const cols = await this.getColumns()
    if (!!cols) {
      return data.map(e => Object.fromEntries(
        Object.entries(e).map(([key, value]) => [`tab:${cols[key as unknown as number]}`, value])
      ))
    } else {
      return data
    }
  }

  private async getMetaFromFile() {
    if (this.meta === undefined) {
      this.meta = parquetMetadata(await (<File>this.file).arrayBuffer())
    }
    return this.meta
  }

  private async getMetaFromUrl() {
    if (this.meta === undefined) {
      this.meta = await parquetMetadataAsync(await asyncBufferFromUrl({ url: <string>this.file }))
    }
    return this.meta
  }

  private async getColumnsFromFile(): Promise<string[]> {
    const meta = await this.getMetaFromFile()
    return meta.schema.filter((e) => e.name !== 'schema').map((e) => e.name)
  }

  private async getColumnsFromUrl(): Promise<string[]> {
    const meta = await this.getMetaFromUrl()
    return meta.schema.filter((e) => e.name !== 'schema').map((e) => e.name)
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
    return meta.schema
      .filter((e) => e.name !== 'schema')
      .map((e) => dataTypeMap[(e.logical_type?.type?.toUpperCase() || e.type?.toUpperCase() || 'DEFAULT')])
  }

  private async getDataTypesFromUrl() {
    const meta = await this.getMetaFromUrl()
    return meta.schema
      .filter((e) => e.name !== 'schema')
      .map((e) => dataTypeMap[(e.logical_type?.type?.toUpperCase() || e.type?.toUpperCase() || 'DEFAULT')])
  }

  public getDataTypes() {
    if (typeof this.file === 'string' || this.file instanceof String) {
      return this.getDataTypesFromUrl()
    } else {
      return this.getDataTypesFromFile()
    }
  }
}