import Form from 'react-bootstrap/Form'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import TableDataManager from '../../lib/TableDataManager'

export default function ClassCell({ rowId }: { rowId: number }) {
  const { tcState } = useXTableConfig()

  return (
    <Form.Select
      defaultValue=""
      onChange={e => { TableDataManager.setCellValue(rowId, 'classification', e.target.value); console.log(TableDataManager.data) }}>
      <option value="">-</option>
      {tcState.classification.classNames.map(cls => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </Form.Select>
  )
}