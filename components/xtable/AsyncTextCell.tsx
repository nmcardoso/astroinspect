import TableDataManager from '../../lib/TableDataManager'

export default function AsyncTextCell({ rowId, colId }:
  { rowId: number, colId: string }) {
  const content = TableDataManager.getCellValue(rowId, colId)
  return (
    <>
      {content === undefined ? (
        <>-</>
      ) : (content === null ? (
        <>-</>
      ) : (
        <>{content}</>
      ))}
    </>
  )
}