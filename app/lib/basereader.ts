import { findIndex } from './utils'

export abstract class BaseReader {
  public abstract read(): Promise<{}[]>
  
  public abstract getColumns(): Promise<string[]>
  
  public abstract getDataTypes(): any

  private getHeaderSummary(header: string[]) {
    const raIndex = findIndex('ra', header)
    const decIndex = findIndex('dec', header)
    const raCol = header?.[raIndex]
    const decCol = header?.[decIndex]
    const summary: TableSummary = {
      raIndex,
      decIndex,
      raCol,
      decCol,
      columns: header,
      positionFound: (raIndex > -1) && (decIndex > -1)
    }
    return summary
  }

  public async getTableSummary() {
    const cols = await this.getColumns()
    const dataTypes = await this.getDataTypes()
    if (!!cols) {
      return {...this.getHeaderSummary(cols), dataTypes}
    } else {
      return undefined
    }
  }
}