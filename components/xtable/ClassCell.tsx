import Form from 'react-bootstrap/Form'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import { useXTableData } from '../../contexts/XTableDataContext'
import TableHelper from '../../lib/TableHelper'

export default function ClassCell({ rowId }: { rowId: number }) {
  const { tcState } = useXTableConfig()
  const { tdState, tdDispatch } = useXTableData()

  return (
    <Form.Select
      defaultValue=""
      value={tdState.data[rowId].classification}
      onChange={e => {
        tdDispatch({
          type: 'setClass',
          payload: {
            class: e.target.value,
            rowId
          }
        })
      }}>
      <option value="">-</option>
      {tcState.classification.classNames.map(cls => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </Form.Select>
  )
}