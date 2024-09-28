type SdssColumnDesc = {
  name: string,
  description: string,
  unit: string
}

interface SearchStrategy {
  objType: 'photo' | 'spectro'
  getQuery?: (ra: number, dec: number, table: string, columns: string[]) => string
  getCrossIdQuery: (
    table: string,
    columns: string[]
  ) => string
}