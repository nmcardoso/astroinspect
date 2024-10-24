import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

export default function ColumnDropdown({ label = undefined, value = '', dispatchKey, dispatchType }: ColumnDropdownProps) {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    tcDispatch({
      type: dispatchType,
      payload: {
        [dispatchKey]: e.target.value
      }
    })
  }

  return (
    <InputGroup>
      {label && <InputGroup.Text>{label}</InputGroup.Text>}
      <Form.Select
        value={value}
        onChange={handleChange}>
        <option value="">-</option>
        {tcState.table.columns.map(col => (
          <option value={col} key={col}>
            {col}
          </option>
        ))}
      </Form.Select>
    </InputGroup>
  )
}