import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ButtonChip from '@/components/common/ButtonChip'
import InputGroup from 'react-bootstrap/InputGroup'
import { useState, useContext } from 'react'
import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'


const splusBands = [
  'U', 'F378', 'F395', 'F410', 'F430', 'G',
  'F515', 'R', 'F660', 'I', 'F861', 'Z'
]

function toggleUnique(data: { [key: string]: string[] }, key: string, value: string) {
  const d = { ...data }

  for (const k in data) {
    if (k != key) d[k] = data[k].filter(e => e != value)
    // if (d[k].length < 1) return data
  }

  if (d[key].includes(value)) {
    d[key] = d[key].filter(e => e != value)
  } else {
    d[key].push(value)
  }

  return d
}


function SplusFilterChip({ band, channel, variant }:
  { band: string, channel: string, variant: string }) {
  const { tcState, tcDispatch } = useXTableConfig()

  const trilogyConfig = tcState.cols.splusImaging.trilogyConfig
  const { R, G, B } = trilogyConfig
  const colorClass = trilogyConfig[channel].includes(band) ?
    `btn-${variant}` : `btn-outline-${variant}`

  return (
    <ButtonChip
      className={`${colorClass} me-1`}
      onClick={() => tcDispatch({
        type: ContextActions.SPLUS_TRILOGY_CONFIG,
        payload: toggleUnique({ R, G, B }, channel, band)
      })}>
      {band}
    </ButtonChip>
  )
}


function TrilogyParams() {
  const { tcState, tcDispatch } = useXTableConfig()
  const trilogyConfig = tcState.cols.splusImaging.trilogyConfig

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="splusTrilogyR">
        <Form.Label column sm="1" className="text-end">
          R
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            {splusBands.map(band => (
              <SplusFilterChip
                key={`R_${band}`}
                band={band}
                channel="R"
                variant="danger" />
            ))}
            <Help title="Red Composition" className="ms-1">
              Choose the S-PLUS bands that will be mapped to the{' '}
              <span className="text-danger">red</span> channel of the{' '}
              RGB image. Each channel must be mapped by up to 1 S-PLUS filter
            </Help>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="splusTrilogyG">
        <Form.Label column sm="1" className="text-end">
          G
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            {splusBands.map(band => (
              <SplusFilterChip
                key={`G_${band}`}
                band={band}
                channel="G"
                variant="success" />
            ))}
            <Help title="Green Composition" className="ms-1">
              Choose the S-PLUS bands that will be mapped to the{' '}
              <span className="text-success">green</span> channel of the{' '}
              RGB image. Each channel must be mapped by up to 1 S-PLUS filter
            </Help>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="splusTrilogyB">
        <Form.Label column sm="1" className="text-end">
          B
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            {splusBands.map(band => (
              <SplusFilterChip
                key={`B_${band}`}
                band={band}
                channel="B"
                variant="primary" />
            ))}
            <Help title="Blue Composition" className="ms-1">
              Choose the S-PLUS bands that will be mapped to the{' '}
              <span className="text-primary">blue</span> channel of the{' '}
              RGB image. Each channel must be mapped by up to 1 S-PLUS filter
            </Help>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="splusTrilogyParams">
        <Form.Label column sm="1" className="text-end">
          Params
        </Form.Label>
        <Col sm={9}>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="trilogy-param-noise">
                  Noise
                </InputGroup.Text>
                <Form.Control
                  aria-label="Noise"
                  aria-describedby="trilogy-param-noise"
                  value={trilogyConfig.noise}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_TRILOGY_CONFIG,
                    payload: { noise: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="trilogy-param-q">
                  Q
                </InputGroup.Text>
                <Form.Control
                  aria-label="Q"
                  aria-describedby="trilogy-param-q"
                  value={trilogyConfig.Q}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_TRILOGY_CONFIG,
                    payload: { Q: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pixelScale">
                  Pixel scale
                </InputGroup.Text>
                <Form.Control
                  aria-label="Pixel scale"
                  aria-describedby="pixelScale"
                  value={tcState.cols.splusImaging.pixelScale}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_IMAGING,
                    payload: { pixelScale: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Form.Group>
    </>
  )
}


function LuptonParams() {
  const { tcState, tcDispatch } = useXTableConfig()
  const luptonConfig = tcState.cols.splusImaging.luptonConfig

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="splusLuptonColors">
        <Form.Label column sm="1">
          Colors
        </Form.Label>
        <Col sm={8}>
          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Text>R</InputGroup.Text>
                <Form.Select
                  value={luptonConfig.R}
                  onChange={e => tcDispatch({
                    type: ContextActions.SPLUS_LUPTON_CONFIG,
                    payload: { R: e.target.value }
                  })}>
                  {splusBands.map(band => (
                    <option key={band}>
                      {band}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text>G</InputGroup.Text>
                <Form.Select
                  value={luptonConfig.G}
                  onChange={e => tcDispatch({
                    type: ContextActions.SPLUS_LUPTON_CONFIG,
                    payload: { G: e.target.value }
                  })}>
                  {splusBands.map(band => (
                    <option key={band}>
                      {band}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text>B</InputGroup.Text>
                <Form.Select
                  value={luptonConfig.B}
                  onChange={e => tcDispatch({
                    type: ContextActions.SPLUS_LUPTON_CONFIG,
                    payload: { B: e.target.value }
                  })}>
                  {splusBands.map(band => (
                    <option key={band}>
                      {band}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="splusLuptonParams">
        <Form.Label column sm="1">
          Params
        </Form.Label>
        <Col sm={8}>
          <Row>
            <Col>
              <InputGroup>
                <InputGroup.Text id="lupton-param-noise">
                  Stretch
                </InputGroup.Text>
                <Form.Control
                  aria-label="Stretch"
                  aria-describedby="lupton-param-noise"
                  value={luptonConfig.stretch}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_LUPTON_CONFIG,
                    payload: { stretch: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text id="lupton-param-q">
                  Q
                </InputGroup.Text>
                <Form.Control
                  aria-label="Q"
                  aria-describedby="lupton-param-q"
                  value={luptonConfig.Q}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_LUPTON_CONFIG,
                    payload: { Q: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="pixelScale">
                  Pixel Scale
                </InputGroup.Text>
                <Form.Control
                  aria-label="Pixel Scale"
                  aria-describedby="pixelScale"
                  value={tcState.cols.splusImaging.pixelScale}
                  onChange={(e) => tcDispatch({
                    type: ContextActions.SPLUS_IMAGING,
                    payload: { pixelScale: e.target.value }
                  })}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Form.Group>
    </>
  )
}


export default function SplusImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const splusImaging = tcState.cols.splusImaging

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="splusImagingCheck">
        <Form.Label column sm="1" className="text-end">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show S-PLUS RGB images column"
            checked={splusImaging.enabled}
            onChange={(e) => tcDispatch({
              type: ContextActions.SPLUS_IMAGING,
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="classCheck">
        <Form.Label column sm="1" className="text-end">
          Type
        </Form.Label>
        <Col sm={5}>
          <div className="d-flex align-items-center">
            <Form.Select
              defaultValue={splusImaging.type}
              onChange={(e) => tcDispatch({
                type: ContextActions.SPLUS_IMAGING,
                payload: { type: e.target.value }
              })}>
              <option value="trilogy">Trilogy</option>
              <option value="lupton">Lupton</option>
            </Form.Select>
            <Help title="Image Type" className="ms-1">
              The algorithm used to make RGB stamps from the FITS file<br />
              <b>Trilogy: </b> The Trilogy algorithm<br />
              <b>Lupton: </b> The Lupton method
            </Help>
          </div>
        </Col>
      </Form.Group>

      {splusImaging.type == 'trilogy' ? <TrilogyParams /> : <LuptonParams />}
    </>
  )
}