import { useXTableData } from '../../contexts/XTableDataContext'
import TableHelper from '../../lib/TableHelper'

export default function AsyncTextCell({ rowId, colId }:
  { rowId: number, colId: string }) {
  const { tdState } = useXTableData()
  const content = TableHelper.getCellValue(rowId, colId, tdState)
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