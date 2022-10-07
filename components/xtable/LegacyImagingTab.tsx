import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useContext } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'

export default function LegacyImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const legacy = tcState.legacyImaging

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="legacyImagingCheck">
        <Form.Label column sm="1">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show Legacy RGB Images Column"
            checked={legacy.enabled}
            onChange={e => tcDispatch({
              type: 'setLegacyImaging',
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>
    </>
  )
}