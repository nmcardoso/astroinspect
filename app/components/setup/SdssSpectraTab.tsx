import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useXTableConfig } from '@/contexts/XTableConfigContext'


const splusLines = ['iso', 'aper3', 'aper6', 'auto', 'petro', 'pstotal']

export default function SdssSpectraTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const sdss = tcState.sdssSpectra
  const selectedLines = tcState.splusPhotoSpectra.selectedLines

  const handleLineToggle = (line: string, selectedLines: string[]) => {
    const checked = selectedLines.includes(line)
    if (checked) {
      tcDispatch({
        type: 'setSplusPhotoSpectra',
        payload: {
          selectedLines: selectedLines.filter(e => e != line)
        }
      })
    } else {
      tcDispatch({
        type: 'setSplusPhotoSpectra',
        payload: {
          selectedLines: [...selectedLines, line]
        }
      })
    }
  }

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="sloanSpecCheck">
        <Form.Label column sm={3}>
          SDSS spectra
        </Form.Label>
        <Col sm={9} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show SDSS spectra column"
            checked={sdss.enabled}
            onChange={e => tcDispatch({
              type: 'setSdssImaging',
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      <hr className="my-4" />

      <Form.Group as={Row} className="mb-2" controlId="nearby-redshift-check">
        <Form.Label column sm={3}>
          Nearby Redshift
        </Form.Label>
        <Col sm={9} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show SDSS Redshifts of Nearby Objects"
            checked={tcState.nearbyRedshifts.enabled}
            onChange={e => tcDispatch({
              type: 'setNearbyRedshifts',
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      <hr className="my-4" />

      <Form.Group as={Row} className="mb-2" controlId="splus-photospec-check">
        <Form.Label column sm={3}>
          S-PLUS photo-spectra
        </Form.Label>
        <Col sm={9} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show S-PLUS photo-spectra column"
            checked={tcState.splusPhotoSpectra.enabled}
            onChange={() => tcDispatch({
              type: 'setSplusPhotoSpectra',
              payload: { enabled: !tcState.splusPhotoSpectra.enabled }
            })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-2" controlId="splus-photospec-check">
        <Form.Label column sm={3}>
          Selected lines
        </Form.Label>
        <Col sm={9} className="d-flex align-items-center">
          {splusLines.map(line => (
            <Form.Check
              inline
              key={line}
              type="checkbox"
              id={`splus-photospectra-line-${line}`}
              className="me-3">
              <Form.Check.Input
                type="checkbox"
                checked={selectedLines.includes(line)}
                onChange={() => handleLineToggle(line, selectedLines)} />
              <Form.Check.Label>
                {line}
              </Form.Check.Label>
            </Form.Check>

          ))}
        </Col>
      </Form.Group>
    </>
  )
}