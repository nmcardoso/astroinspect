import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup'
import ClassTab from './ClassTab'
import SdssSpectraTab from './SdssSpectraTab'
import LegacyImagingTab from './LegacyImagingTab'
import SplusImagingTab from './SplusImagingTab'
import FileInputTab from './FileInputTab'
import { Alert, Button, Container } from 'react-bootstrap'
import { MouseEventHandler } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import Spinner from 'react-bootstrap/Spinner'
import SdssCatalogTab from './SdssCatalogTab'
import CustomImagingTab from './CustomImagingTab'
import { VscServerProcess } from "react-icons/vsc"
import { TbTableOptions } from "react-icons/tb"
import { ContextActions } from '@/interfaces/contextActions'
import Emitter from '@/lib/Emitter'


const LoadExemple = ({ name, url }: { name: string, url: string }) => {
  const { tcDispatch } = useXTableConfig()

  const handleSubmit = () => {
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: { type: 'remote', url }
    })

    Emitter.emit('INSERT_URL', { url })
  }

  return (
    <Button variant="link" onClick={handleSubmit}>
      {name}
    </Button>
  )
}


export default function ConfigForm() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleLoadClick: MouseEventHandler<HTMLElement> = (e) => {
    tcDispatch({
      type: ContextActions.CURRENT_VIEW_CHANGE,
      payload: 'grid',
    })
  }

  return (
    <Container className="mt-5">
      <div className="border rounded rounded-3 p-4" style={{ backgroundColor: '#fafafa' }}>
        <h6 className="text-center mb-4 d-flex align-items-center justify-content-center">
          <TbTableOptions className="me-2" size={20} />
          <span>Table Settings</span>
        </h6>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#select-table">
          <Row>
            <Col sm={3}>
              <ListGroup>
                <ListGroup.Item action href="#select-table">
                  Select a table
                </ListGroup.Item>
                <ListGroup.Item action href="#classification">
                  Classification
                </ListGroup.Item>
                {/* <ListGroup.Item action href="#link2">
                  S-PLUS Catalog
                </ListGroup.Item> */}
                <ListGroup.Item action href="#sdss">
                  SDSS catalog
                </ListGroup.Item>
                <ListGroup.Item action href="#splus">
                  S-PLUS images
                </ListGroup.Item>
                <ListGroup.Item action href="#legacy">
                  Legacy images
                </ListGroup.Item>
                <ListGroup.Item action href="#custom-images">
                  Custom images
                </ListGroup.Item>
                <ListGroup.Item action href="#spectra">
                  Spectra & photo-spectra
                </ListGroup.Item>
              </ListGroup>
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
                <Tab.Pane eventKey="#custom-images">
                  <CustomImagingTab />
                </Tab.Pane>
                <Tab.Pane eventKey="#spectra">
                  <SdssSpectraTab />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
          <Row>
            <Col sm={3} className="mx-auto">
              <Button
                className="mt-3 w-100 fw-bold"
                variant="success"
                size="lg"
                onClick={handleLoadClick}
                disabled={tcState.table.status !== 'success'}>
                {tcState.table.status === 'loading' ?
                  <>
                    <Spinner
                      as="span"
                      size="sm"
                      role="status"
                      animation="border"
                      variant="light" /> Loading
                  </> :
                  <>
                    <VscServerProcess className="me-2" size={30} /> Load Table
                  </>
                }
              </Button>
            </Col>
          </Row>
        </Tab.Container>
      </div>
      <Row className="mt-5">
        <Col sm={7}>
          <Alert variant="info">
            <Alert.Heading>🎉 New Version!</Alert.Heading>
            <h6>Features of the software release v1.0:</h6>
            <ul>
              <li>
                Add support to <b>PARQUET</b> files
              </li>
              <li>
                Handle <b>big tables</b> (hundreds of thousands of lines)
              </li>
              <li>
                Column relocation and row <b>sorting and filtering</b>
              </li>
              <li>
                <b>Faster loading</b> of resources with multiple parallel connections
              </li>
              <li>
                Display of the <b>loading status</b> of each external resource
              </li>
              <li>
                Support for remote files
              </li>
            </ul>
          </Alert>
        </Col>

        <Col sm={5}>
          <Alert variant="success">
            <Alert.Heading>💡 Examples</Alert.Heading>
            <ul>
              <li>
                <LoadExemple
                  name="example-1.csv"
                  url="https://raw.githubusercontent.com/nmcardoso/clusters/refs/heads/main/tables/catalog_v6_hydra.csv" />
              </li>
            </ul>
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}