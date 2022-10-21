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
              <ListGroup.Item action href="#link0">
                Select Table
              </ListGroup.Item>
              <ListGroup.Item action href="#link1">
                Classification
              </ListGroup.Item>
              {/* <ListGroup.Item action href="#link2">
                S-PLUS Catalog
              </ListGroup.Item> */}
              <ListGroup.Item action href="#link3">
                SDSS Catalog
              </ListGroup.Item>
              <ListGroup.Item action href="#link4">
                S-PLUS Imaging
              </ListGroup.Item>
              <ListGroup.Item action href="#link5">
                Legacy Imaging
              </ListGroup.Item>
              <ListGroup.Item action href="#link6">
                Spectra & PhotoSpectra
              </ListGroup.Item>
            </ListGroup>
            <Button
              className="mt-2 w-100 fw-bold"
              variant="success"
              onClick={handleLoadClick}
              disabled={!tcState.table.file}>
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
              <Tab.Pane eventKey="#link0">
                <FileInputTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#link1">
                <ClassTab />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="#link2">
                Nada
              </Tab.Pane> */}
              <Tab.Pane eventKey="#link3">
                <SdssCatalogTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#link4">
                <SplusImagingTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#link5">
                <LegacyImagingTab />
              </Tab.Pane>
              <Tab.Pane eventKey="#link6">
                <SdssSpectraTab />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  )
}