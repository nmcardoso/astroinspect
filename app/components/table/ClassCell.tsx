import Form from 'react-bootstrap/Form'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { CustomCellRendererProps } from '@ag-grid-community/react'


export default function ClassCell(params: CustomCellRendererProps) {
  const { tcState } = useXTableConfig()

  return (
    <Form.Select
      value={params.value}
      onChange={e => {
        params.api.getRowNode(params.data._id)?.setDataValue('class', e.target.value)
      }}>
      <option value="">-</option>
      {tcState.classification.classNames.map(cls => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </Form.Select>
  )
}