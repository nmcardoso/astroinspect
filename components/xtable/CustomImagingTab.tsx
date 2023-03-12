import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { useContext } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'

export default function CustomImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.customImaging

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="customImagingCheck">
        <Form.Label column sm="1">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show Custom Images Column"
            checked={custom.enabled}
            onChange={e => tcDispatch({
              type: 'setCustomImaging',
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      <Row>
        <Col sm={6}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="customImagingUrl">
              URL
            </InputGroup.Text>
            <Form.Control
              aria-label="URL"
              aria-describedby="customImagingUrl"
              value={custom.pixelScale}
              onChange={e => tcDispatch({
                type: 'setCustomImaging',
                payload: { url: e.target.value }
              })}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Column</InputGroup.Text>
            <Form.Select
              defaultValue={-1}
              onChange={e => tcDispatch({
                type: 'setCustomImaging',
                payload: { columnIndex: (parseInt(e.target.value)) }
              })}>
              <option value={-1}>Select a column</option>
              {tcState.table.columns.map((colName, index) => (
                <option
                  value={index}
                  key={index}>
                  {colName}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <InputGroup>
            <InputGroup.Text>File Extension</InputGroup.Text>
            <Form.Select
              value={custom.fileExtension}
              onChange={e => tcDispatch({
                type: 'setCustomImaging',
                payload: { fileExtension: e.target.value }
              })}>
              <option value="">None</option>
              <option value=".jpg">.jpg</option>
              <option value=".jpeg">.jpeg</option>
              <option value=".png">.png</option>
              <option value=".apng">.apng</option>
              <option value=".avif">.avif</option>
              <option value=".gif">.gif</option>
              <option value=".jfif">.jfif</option>
              <option value=".pjpeg">.pjpeg</option>
              <option value=".pjp">.pjp</option>
              <option value=".svg">.svg</option>
              <option value=".webp">.webp</option>
              <option value=".bmp">.bmp</option>
              <option value=".tif">.tif</option>
              <option value=".tiff">.tiff</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

    </>
  )
}