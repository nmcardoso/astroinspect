import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup'
import ClassTab from './ClassTab'
import SdssSpectraTab from './SdssSpectraTab'
import LegacyImagingTab from './LegacyImagingTab'
import SplusImagingTab from './SplusImagingTab'
import FileInputTab from './FileInputTab'
import { Button } from 'react-bootstrap'
import { MouseEventHandler } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import Emitter from '../../lib/Emitter'
import Spinner from 'react-bootstrap/Spinner'
import SdssCatalogTab from './SdssCatalogTab'
import CustomImagingTab from './CustomImagingTab'


export default function ConfigForm() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleLoadClick: MouseEventHandler<HTMLElement> = (e) => {
    Emitter.emit('load_table', true)
  }

  return (
    <>
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link0">
        <Row>
          <Col sm={3}>
            <ListGroup>
              <ListGroup.Item action href="#select-table">
                Select Table
              </ListGroup.Item>
              <ListGroup.Item action href="#classification">
                Classification
              </ListGroup.Item>
              {/* <ListGroup.Item action href="#link2">
                S-PLUS Catalog
              </ListGroup.Item> */}
              <ListGroup.Item action href="#sdss">
                SDSS Catalog
              </ListGroup.Item>
              <ListGroup.Item action href="#splus">
                S-PLUS Imaging
              </ListGroup.Item>
              <ListGroup.Item action href="#legacy">
                Legacy Imaging
              </ListGroup.Item>
              <ListGroup.Item action href="#custom-imaging">
                Custom Imaging
              </ListGroup.Item>
              <ListGroup.Item action href="#spectra">
                Spectra & PhotoSpectra
              </ListGroup.Item>
            </ListGroup>
            <Button
              className="mt-2 w-100 fw-bold"
              variant="success"
              onClick={handleLoadClick}
              disabled={!tcState.table.file || tcState.table.processing}>
              {tcState.table.processing ?
                <>
                  <Spinner
                    as="span"
                    size="sm"
                    role="status"
                    animation="border"
                    variant="light" /> Loading
                </> :
                <>Load Table</>}
            </Button>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="#select-table">
                <FileInputTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#classification">
                <ClassTab />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="#link2">
                Nada
              </Tab.Pane> */}
              <Tab.Pane eventKey="#sdss">
                <SdssCatalogTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#splus">
                <SplusImagingTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#legacy">
                <LegacyImagingTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#custom-imaging">
                <CustomImagingTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#spectra">
                <SdssSpectraTab />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  )
}