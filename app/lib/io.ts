import { CSVReader } from './csv'
import { ParquetReader } from './parquet'


export function getFileExt(file: string | File) {
  if (typeof file === 'string' || file instanceof String) {
    return (file as string).split('.').pop()?.toLowerCase()
  } else {
    return (file as File).name.split('.').pop()?.toLowerCase()
  }
}


export function getTableReader(file: string | File) {
  const ext = getFileExt(file)
  if (['csv', 'tsv', 'dat', 'txt'].includes(ext || '')) {
    return new CSVReader(file)
  } else if (['parquet', 'parq', 'par', 'pq'].includes(ext || '')) {
    return new ParquetReader(file)
  }
}