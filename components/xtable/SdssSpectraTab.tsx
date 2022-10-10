import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useXTableConfig } from '../../contexts/XTableConfigContext'


export default function SdssSpectraTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const sdss = tcState.sdssSpectra

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="sloanSpecCheck">
        <Form.Label column sm="1">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show SDSS Spectra Column"
            checked={sdss.enabled}
            onChange={e => tcDispatch({
              type: 'setSdssImaging',
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>
    </>
  )
}