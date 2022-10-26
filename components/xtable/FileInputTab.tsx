import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Help from '../common/Help'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import { MouseEventHandler, useState } from 'react'
import { HiCheck, HiX } from 'react-icons/hi'
import Chip from '../common/Chip'
import TableHelper from '../../lib/TableHelper'

enum TableState {
  unloaded = 'unloaded',
  loading = 'loading',
  success = 'sucess',
  positionNotFound = 'positionNotFound',
  error = 'error'
}


function LocalStorageControl({ onChange }: { onChange: (e: any) => void }) {
  return (
    <Form.Group as={Row} className="mb-2" controlId="tableFile">
      <Form.Label column sm="1">
        Table
      </Form.Label>
      <Col sm={6}>
        <div className="d-flex align-items-center">
          <Form.Control
            type="file"
            onChange={onChange} />
          <Help title="Local Upload" className="ms-1">
            Loads a table available in local computer
          </Help>
        </div>
      </Col>
    </Form.Group>
  )
}


function RemoteStorageControl() {
  return (
    <Form.Group as={Row} className="mb-2" controlId="tableFile">
      <Form.Label column sm="1">
        URL
      </Form.Label>
      <Col sm="5">
        <div className="d-flex align-items-center">
          <Form.Control placeholder="File URL" />
          <Help title="Remote Upload" className="ms-1">
            Loads a table available remotely over the internet
          </Help>
        </div>
      </Col>
      <Col sm="2" className="d-flex align-items-center">
        <Button variant="link" className="px-1 py-1">
          Load Example
        </Button>
      </Col>
    </Form.Group>
  )
}


const StateMessage = ({ state }: { state: TableState }) => {
  if (state == TableState.loading) {
    return <p className="text-secondary">
      Loading table...
    </p>
  }

  if (state == TableState.success) {
    return <p className="text-success">
      <HiCheck /> RA and DEC columns successfully detected
    </p>
  }

  if (state == TableState.positionNotFound) {
    return <p className="text-danger">
      <HiX /> RA or DEC columns not detected
    </p>
  }

  if (state == TableState.error) {
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
        type: 'setFileInput',
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
                <option value={-1}>Select one column to add</option>
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


export default function FileInputTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const table = tcState.table
  const [tableState, setTableState] = useState(TableState.unloaded)
  const [showModal, setShowModal] = useState(false)

  const handleLocalFile = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      setTableState(TableState.loading)
      TableHelper.getTableSummary(file).then(summary => {
        if (summary?.positionFound) {
          setTableState(TableState.success)

          tcDispatch({
            type: 'setFileInput',
            payload: {
              type: 'local',
              columns: summary.columns,
              selectedColumnsId: [summary.raIndex, summary.decIndex],
              raIndex: summary.raIndex,
              decIndex: summary.decIndex,
              file,
            }
          })
        } else {
          setTableState(TableState.positionNotFound)
        }
      }).catch(err => {
        setTableState(TableState.error)
      })
    }
  }

  const handleDelColumn = (_: any, value: number) => {
    tcDispatch({
      type: 'setFileInput',
      payload: { selectedColumnsId: tcState.table.selectedColumnsId.filter(v => v != value) }
    })
  }

  return (
    <>
      {/* <Form.Group as={Row} className="mb-2" controlId="tableFile">
        <Form.Label column sm="1">
          Type
        </Form.Label>
        <Col sm="5">
          <div className="d-flex align-items-center">
            <Form.Select
              value={table.type}
              onChange={(e) => tcDispatch({
                type: 'setFileInput',
                payload: { type: e.target.value }
              })}>
              <option value="local">Local</option>
              <option value="remote">Remote</option>
            </Form.Select>
            <Help title="Upload Type" className="ms-1">
              Select upload type based on where the source table is stored<br />
              <b>Local: </b> Table stored in local computer<br />
              <b>Remote: </b> Table available in internet
            </Help>
          </div>
        </Col>
      </Form.Group> */}

      {table.type == 'local' ?
        <LocalStorageControl onChange={handleLocalFile} /> :
        <RemoteStorageControl />}

      <StateMessage state={tableState} />

      {table.selectedColumnsId.length > 0 && (
        <div>
          Selected Columns: {table.selectedColumnsId.map(columnId => (
            <Chip
              value={columnId}
              key={`sourceColIdx_${columnId}`}
              className="mb-1 me-1"
              onClose={handleDelColumn}
              closeable={columnId != table.raIndex && columnId != table.decIndex}>
              {table.columns[columnId]}
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