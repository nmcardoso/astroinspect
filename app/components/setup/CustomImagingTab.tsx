import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { Fragment, useContext } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { Button } from 'react-bootstrap'
import { BiPlus } from 'react-icons/bi'
import { HiMinusSm } from 'react-icons/hi'
import Help from '@/components/common/Help'
import { ContextActions } from '@/interfaces/contextActions'

const CustomImagingColumnGroup = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging.columns[index]

  return (
    <>
      <Row>
        <Col sm={8}>
          <div className="d-flex align-items-center">
            <InputGroup className="mb-2" size="sm">
              <InputGroup.Text>
                Base URL
              </InputGroup.Text>
              <Form.Control
                value={custom.url}
                onChange={e => tcDispatch({
                  type: ContextActions.CUSTOM_IMAGE_UPDATE,
                  payload: { index, url: e.target.value }
                })}
              />
            </InputGroup>
            <Help title="Base Resource URL" className="mb-2 ms-1">
              The <b>base resource url</b> is the first (static) part of the URL.
              This value must starts with <code>http://</code>{" "}
              or <code>https://</code><br />
              The final url for each row is:<br />
              <kbd>Base URL</kbd> + <kbd>RI column</kbd> + <kbd>suffix</kbd>
            </Help>
          </div>
        </Col>

        <Col sm={4}>
          <div className="d-flex align-items-center">
            <InputGroup size="sm">
              <InputGroup.Text>Suffix</InputGroup.Text>
              <Form.Control
                value={custom.fileExtension}
                onChange={e => tcDispatch({
                  type: ContextActions.CUSTOM_IMAGE_UPDATE,
                  payload: { index, fileExtension: e.target.value }
                })}
              />
            </InputGroup>
            <Help title="URL Suffix" className="ms-1">
              The <b>url suffix</b> is the last (static) part of the URL and {" "}
              is used to specify the file extension, for example.<br />
              The final url for each row is:<br />
              <kbd>Base URL</kbd> + <kbd>RI column</kbd> + <kbd>suffix</kbd>
            </Help>
          </div>
        </Col>
      </Row>

      <Row>
        <Col sm={8}>
          <div className="d-flex align-items-center">
            <InputGroup className="" size="sm">
              <InputGroup.Text>RI column</InputGroup.Text>
              <Form.Select
                defaultValue={tcState.cols.customImaging.columns?.[index]?.columnIndex || -1}
                onChange={e => tcDispatch({
                  type: ContextActions.CUSTOM_IMAGE_UPDATE,
                  payload: { index, columnIndex: (parseInt(e.target.value)) }
                })}>
                <option value={-1}>Select a column</option>
                {tcState.table.columns.map((colName, idx) => (
                  <option
                    value={idx}
                    key={idx}>
                    {colName}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
            <Help title="Resource Identification Column" className=" ms-1">
              The <b>resource identification column</b> (RI column) is the {" "}
              only variable part of the url. This field must specify the {" "}
              column to use to make a specific url for each row.<br />
              The final url for each row is:<br />
              <kbd>Base URL</kbd> + <kbd>RI Column</kbd> + <kbd>suffix</kbd>
            </Help>
          </div>
        </Col>

        <Col sm={4}>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_REMOVE,
              payload: { index, prevColumns: tcState.cols.customImaging.columns }
            })}
          >
            <HiMinusSm /> Remove column
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default function CustomImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="customImagingCheck">
        <Form.Label column sm="1">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Show custom images columns"
            checked={custom.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_ENABLE,
              payload: { enabled: e.target.checked }
            })}
          />
        </Col>
      </Form.Group>

      {custom.columns.map((_, i) => (
        <Fragment key={i}>
          <CustomImagingColumnGroup index={i} />
          <hr className="my-4" />
        </Fragment>
      ))}

      <Row>
        <Col>
          <Button
            size="sm"
            onClick={() => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_NEW,
              payload: { prevColumns: tcState.cols.customImaging.columns }
            })}
          >
            <BiPlus size={16} /> Add custom image column
          </Button>
        </Col>
      </Row>
    </>
  )
}