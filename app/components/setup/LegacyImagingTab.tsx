import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { useContext } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Help from '@/components/common/Help'

export default function LegacyImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const legacy = tcState.cols.legacyImaging

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

      <Row className="mb-3">
        <Col sm={5}>
          <InputGroup>
            <InputGroup.Text id="legacyImagingPixScale">
              Pixel scale
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
            <InputGroup.Text id="legacyImagingPixScale2">
              arcsec/pixel
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col sm={4} className="align-content-center">
          <div className="d-flex">
            <Form.Check
              type="switch"
              id="auto-pix-scale"
              label="Auto pixscale"
              className="me-2"
              checked={legacy.autoPixelScale}
              onChange={e => tcDispatch({
                type: ContextActions.LEGACY_IMAGING,
                payload: { autoPixelScale: e.target.checked }
              })}
            />
            <Help title="Add Columns">
              <ul>
                <li>
                  When <i>auto pixscale</i> is <b>enabled</b>, AstroInspect will 
                  compute the pixscale for each object based on the 
                  <code>mag_r</code> and <code>shape_r</code> values from the 
                  Legacy Survey catalogue. The specified value of pixscale will 
                  be used in cases where catalog values are not available.
                </li>
                <li>
                  When <i>auto pixscale</i> is <b>disbled</b>, AstroInspect will
                  only use the specified value of the pixscale.
                </li>
              </ul>
            </Help>
          </div>
        </Col>
      </Row>

      <Row>
        <Col sm={5}>
          <InputGroup>
            <InputGroup.Text>Data Release</InputGroup.Text>
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