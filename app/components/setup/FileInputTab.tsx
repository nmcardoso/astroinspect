import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { HiCheck, HiX } from 'react-icons/hi'
import Chip from '@/components/common/Chip'
import TableHelper from '@/lib/TableHelper'
import { ContextActions } from '@/interfaces/contextActions'
import Emitter from '@/lib/Emitter'
import { event } from 'nextjs-google-analytics'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'


function LocalStorageControl({ onChange }: { onChange: (e: any) => void }) {
  const { tcState } = useXTableConfig()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!!tcState.table.file && !!inputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(tcState.table.file)
      const fileList = dataTransfer.files
      inputRef.current.files = fileList
    }
  }, [tcState.table.file])

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="tableFile">
        <Form.Label column sm="1" className="text-end">
          Table
        </Form.Label>
        <Col sm={8}>
          <div className="d-flex align-items-center">
            <Form.Control
              type="file"
              onChange={onChange}
              ref={inputRef} />
            <Help title="Local Upload" className="ms-1">
              Load a table available in local computer. The only required
              columns are <code>RA</code> and <code>DEC</code> in degrees.<br />
              <u>Available formars</u>: <code>CSV</code>, <code>TSV</code>,
              &nbsp;<code>DAT</code>, <code>PARQUET</code>.
            </Help>
          </div>
        </Col>
      </Form.Group>
    </>
  )
}


function RemoteStorageControl({ onChange }: { onChange: (e: any) => void }) {
  const { tcState } = useXTableConfig()

  return (
    <Form.Group as={Row} className="mb-2" controlId="tableFile">
      <Form.Label column sm="1" className="text-end">
        URL
      </Form.Label>
      <Col sm={10}>
        <div className="d-flex align-items-center">
          <Form.Control
            placeholder="File URL"
            onChange={onChange}
            value={tcState.table.url || ''} />
          <Help title="Remote Upload" className="ms-1">
            Loads a table available remotely in the internet.<br />
            <u>Available formars</u>: <code>CSV</code>, <code>TSV</code>,
            &nbsp;<code>DAT</code>, <code>PARQUET</code>.
          </Help>
        </div>
      </Col>
    </Form.Group>
  )
}


const StateMessage = ({ state }: { state: any }) => {
  if (state == 'loading') {
    return <p className="text-secondary">
      Loading table...
    </p>
  }

  if (state == 'success') {
    return <p className="text-success">
      <HiCheck /> RA and DEC columns successfully detected
    </p>
  }

  if (state == 'positionNotFound') {
    return <p className="text-danger">
      <HiX /> RA or DEC columns not detected
    </p>
  }

  if (state == 'error') {
    return <p className="text-danger">
      <HiX /> Failed to load this table, check if it&apos;s a valid csv file
    </p>
  }

  return null
}


const SelectColumnModal = ({
  show,
  onHide
}: { show: boolean, onHide: () => void }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const [selectedId, setSelectedId] = useState(-1)

  const filterColumns = () => {
    return tcState.table.columns.map((col, i) => {
      return { colName: col, originalIndex: i }
    }).filter((e) => {
      return !tcState.table.selectedColumnsId.includes(e.originalIndex)
    })
  }

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedId >= 0 && !tcState.table.selectedColumnsId.includes(selectedId)) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          selectedColumnsId: [...tcState.table.selectedColumnsId, selectedId]
        }
      })
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select a column
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={10}>
              <Form.Select
                defaultValue={-1}
                onChange={e => setSelectedId(parseInt(e.target.value))}>
                <option value={-1}>Select a column to add</option>
                {filterColumns().map((col) => (
                  <option
                    value={col.originalIndex}
                    key={col.originalIndex}>
                    {col.colName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Button variant="success" onClick={handleSubmit}>Add</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
}



const SourceSelector = () => {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleTypeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: { type: e.target.value }
    })
  }

  return (
    <Form.Group as={Row} className="mb-2" controlId="tableSourceSelector">
      <Form.Label column sm="1" className="text-end">
        Source
      </Form.Label>
      <Col sm="5">
        <div className="d-flex align-items-center mt-2">
          <Form.Check
            inline
            checked={tcState.table.type === 'local'}
            label="local"
            name="tableType"
            type="radio"
            value="local"
            id="tableType-1"
            onChange={handleTypeChange}
          />
          <Form.Check
            inline
            checked={tcState.table.type === 'remote'}
            className="ms-2"
            label="remote"
            name="tableType"
            type="radio"
            value="remote"
            id="tableType-2"
            onChange={handleTypeChange}
          />
          <Help title="Upload Type">
            Select upload type based on where the source table is stored.<br />
            <ul>
              <li>
                <b>Local: </b> Table stored in local computer<br />
              </li>
              <li>
                <b>Remote: </b> Table available in internet
              </li>
            </ul>
          </Help>
        </div>
      </Col>
    </Form.Group>
  )
}



export default function FileInputTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const [showModal, setShowModal] = useState(false)

  const handleLocalFile = useCallback((e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          status: 'loading'
        }
      })

      TableHelper.getTableSummary(file).then(summary => {
        if (summary?.positionFound) {
          const isSameFile = (
            tcState.table.type === 'local' && (
              file.name === tcState.table.file?.name ||
              file.size === tcState.table.file?.size ||
              file.lastModified === tcState.table.file?.lastModified
            )
          )
          if (!isSameFile) {
            tcDispatch({
              type: ContextActions.GRID_UPDATE,
              payload: {
                data: [],
                colDefs: [],
              }
            })
          }
          tcDispatch({
            type: ContextActions.USER_FILE_INPUT,
            payload: {
              type: 'local',
              columns: summary.columns,
              selectedColumnsId: [summary.raIndex, summary.decIndex],
              raIndex: summary.raIndex,
              decIndex: summary.decIndex,
              dataTypes: summary.dataTypes,
              status: 'success',
              file,
              isSameFile,
            }
          })
          event(
            'load_file_local', {
            category: 'load',
            label: 'local',
            userId: GA_MEASUREMENT_ID
          })
        } else {
          tcDispatch({
            type: ContextActions.USER_FILE_INPUT,
            payload: {
              status: 'positionNotFound'
            }
          })
        }
      }).catch(err => {
        console.log(err)
        tcDispatch({
          type: ContextActions.USER_FILE_INPUT,
          payload: {
            status: 'error'
          }
        })
      })
    }
  }, [tcState, tcDispatch])


  const handleRemoteFile = useCallback((url: string, autoLoad: boolean = false) => {
    if (url.length > 0) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          status: 'loading'
        }
      })

      TableHelper.getTableSummary(url).then(summary => {
        if (summary?.positionFound) {
          const isSameFile = (
            tcState.table.type === 'remote' &&
            url == tcState.table.url
          )
          if (!isSameFile) {
            tcDispatch({
              type: ContextActions.GRID_UPDATE,
              payload: {
                data: [],
                colDefs: [],
              }
            })
          }
          tcDispatch({
            type: ContextActions.USER_FILE_INPUT,
            payload: {
              type: 'remote',
              columns: summary.columns,
              selectedColumnsId: [summary.raIndex, summary.decIndex],
              raIndex: summary.raIndex,
              decIndex: summary.decIndex,
              dataTypes: summary.dataTypes,
              status: 'success',
              url,
              isSameFile,
            }
          })
          if (autoLoad) {
            tcDispatch({
              type: ContextActions.CURRENT_VIEW_CHANGE,
              payload: 'grid'
            })
          }
          event(
            'load_file_remote', {
            category: 'load',
            label: 'remote',
            userId: GA_MEASUREMENT_ID
          })
        } else {
          tcDispatch({
            type: ContextActions.USER_FILE_INPUT,
            payload: {
              status: 'positionNotFound'
            }
          })
        }
      }).catch(err => {
        tcDispatch({
          type: ContextActions.USER_FILE_INPUT,
          payload: {
            status: 'error'
          }
        })
      })
    }
  }, [tcDispatch, tcState])

  const handleDelColumn = (_: any, value: number) => {
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: { selectedColumnsId: tcState.table.selectedColumnsId.filter(v => v != value) }
    })
  }

  useEffect(() => {
    Emitter.on('INSERT_URL', (e: any) => handleRemoteFile(e.url, true))
    event(
      'load_file_example', {
      category: 'load',
      label: 'example',
      userId: GA_MEASUREMENT_ID
    })
  }, [handleRemoteFile])

  return (
    <>
      <SourceSelector />

      {
        tcState.table.type == 'local' ?
        <LocalStorageControl onChange={handleLocalFile} /> :
        <RemoteStorageControl onChange={(e) => handleRemoteFile(e.target.value)} />
      }

      <StateMessage state={tcState.table.state} />

      {tcState.table.selectedColumnsId.length > 0 && (
        <div>
          <span className="fw-bold">Selected columns:</span> {tcState.table.selectedColumnsId.map(columnId => (
            <Chip
              value={columnId}
              key={`sourceColIdx_${columnId}`}
              className="mb-1 me-1"
              onClose={handleDelColumn}
              closeable={columnId != tcState.table.raIndex && columnId != tcState.table.decIndex}>
              {tcState.table.columns[columnId]}
            </Chip>
          ))}

          <Button
            variant="link"
            className="py-0"
            onClick={() => setShowModal(true)}>
            Add more
          </Button>
        </div>
      )}

      <SelectColumnModal
        show={showModal}
        onHide={() => setShowModal(false)} />
    </>
  )
}