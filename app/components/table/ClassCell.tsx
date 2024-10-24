import Form from 'react-bootstrap/Form'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { CustomCellRendererProps } from '@ag-grid-community/react'


export default function ClassCell(params: CustomCellRendererProps) {
  const { tcState } = useXTableConfig()

  return (
    <Form.Select
      value={params.value}
      onChange={e => {
        params.api.getRowNode(params.data['ai:id'])?.setDataValue('ai:class', e.target.value)
        // console.log(params.api.getRowNode(params.data._id).data)
      }}>
      <option value="">-</option>
      {tcState.cols.classification.classNames.map(cls => (
        <option key={cls} value={cls}>{cls}</option>
      ))}
    </Form.Select>
  )
}