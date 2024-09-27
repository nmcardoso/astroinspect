import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { useContext } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'

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
            label="Show Legacy Survey RGB images column"
            checked={legacy.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.LEGACY_IMAGING,
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      <Row>
        <Col sm={5}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="legacyImagingPixScale">
              Pixel Scale
            </InputGroup.Text>
            <Form.Control
              aria-label="Pixel Scale"
              aria-describedby="legacyImagingPixScale"
              value={legacy.pixelScale}
              onChange={e => tcDispatch({
                type: ContextActions.LEGACY_IMAGING,
                payload: { pixelScale: e.target.value }
              })}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={5}>
          <InputGroup>
            <InputGroup.Text>DR</InputGroup.Text>
            <Form.Select
              value={legacy.dataRelease}
              onChange={e => tcDispatch({
                type: ContextActions.LEGACY_IMAGING,
                payload: { dataRelease: e.target.value }
              })}>
              <option value="10">10</option>
              <option value="9">9</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

    </>
  )
}