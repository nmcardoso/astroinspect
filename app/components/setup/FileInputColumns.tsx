import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

function ColumnButton({ colName, colId }: { colName: string, colId: number }) {
  const { tcState, tcDispatch } = useXTableConfig()
  const variant = tcState.table.selectedColumnsId.includes(colId) ? 'filled' : 'outlined'

  const handleToggle: MouseEventHandler<HTMLDivElement> = () => {
    let newColumns = []
    if (tcState.table.selectedColumnsId.includes(colId)) {
      const itemId = tcState.table.selectedColumnsId.indexOf(colId)
      newColumns = [...tcState.table.selectedColumnsId]
      newColumns.splice(itemId, 1)
    } else {
      newColumns = [...tcState.table.selectedColumnsId, colId]
    }
    // newColumns.sort((a, b) => a - b)

    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        selectedColumnsId: newColumns
      }
    })
  }
  return (
    <Chip
      variant={variant}
      color="primary"
      sx={{ mr: 1, mt: 1 }}
      onClick={handleToggle}
      label={colName} />
  )
}


export default function FileInputColumns() {
  const { tcState } = useXTableConfig()

  return (
    <Box sx={{ maxWidth: '100%', maxHeight: 250, overflow: 'auto' }}>
      {
        tcState.table.columns.map(((col, i) => (
          <ColumnButton key={i} colId={i} colName={col} />
        )))
      }
      {/* <Help title="Add Columns">
            Select columns from input table to include.
          </Help> */}
    </Box>
  )
}