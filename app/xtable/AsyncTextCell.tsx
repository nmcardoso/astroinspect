import { Placeholder, Spinner } from 'react-bootstrap'
import { useXTableData } from '../contexts/XTableDataContext'
import TableHelper from '../lib/TableHelper'

export default function AsyncTextCell({ rowId, colId }:
  { rowId: number, colId: string }) {
  const { tdState } = useXTableData()
  const content = TableHelper.getCellValue(rowId, colId, tdState)
  return (
    <>
      {content === undefined ? (
        <Spinner
          as="span"
          size="sm"
          role="status"
          animation="border"
          variant="secondary" />
      ) : (content === null ? (
        <>-</>
      ) : (
        <>{content}</>
      ))}
    </>
  )
}