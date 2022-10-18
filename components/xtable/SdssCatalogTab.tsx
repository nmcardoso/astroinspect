import { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import SdssService, { SdssColumnDesc } from '../../services/SdssService'
import DatabaseTreeView from '../common/DatabaseTreeView'
import ListView from '../common/ListView'
import Modal from 'react-bootstrap/Modal'
import { Button, Table } from 'react-bootstrap'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import { BiPlus } from 'react-icons/bi'
import { HiMinusSm } from 'react-icons/hi'
import Chip from '../common/Chip'

const service = new SdssService()
const tables = service.getTables()


const SdssModal = ({ show, onHide }: { show: boolean, onHide: any }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const [activeTable, setActiveTable] = useState('')
  const [activeColumn, setActiveColumn] = useState('')
  const [columns, setColumns] = useState<SdssColumnDesc[] | undefined>([])
  const [loading, setLoading] = useState(false)
  const selectedColumns = tcState.sdssCatalog.selectedColumns

  useEffect(() => {
    service.getColumns(activeTable).then(r => {
      setLoading(false)
      setColumns(r)
    }).catch(() => { })
  }, [activeTable])

  const colNames = useMemo(() => columns?.map(col => col.name), [columns]) || []

  const activeColumnObj = useMemo(() => (
    columns?.find(col => col.name == activeColumn)
  ), [columns, activeColumn])

  const isActiveColumnSelected = useMemo(() => (
    selectedColumns.findIndex(s => (
      s.column == activeColumn && s.table == activeTable
    )) > -1
  ), [selectedColumns, activeColumn, activeTable])

  const handleRemoveColumn = (table: string, column: string) => {
    const idx = selectedColumns.findIndex(e => (
      e.column == column && e.table == table
    ))
    tcDispatch({
      type: 'setSdssCatalog',
      payload: {
        selectedColumns: selectedColumns.filter((_, i) => i != idx)
      }
    })
  }

  const handleAddColumn = (table: string, column: string) => {
    const newEntry = {
      table: table,
      column: column
    }
    tcDispatch({
      type: 'setSdssCatalog',
      payload: {
        selectedColumns: [...selectedColumns, newEntry]
      }
    })
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      size="lg"
      centered
    >
      <Modal.Body>
        <Row>
          <Col sm={5}>
            <Row className="align-items-center">
              <Col lg={2}>
                Table:
              </Col>
              <Col>
                <Form.Select
                  onChange={(e) => {
                    setLoading(true)
                    setActiveColumn('')
                    setActiveTable(e.target.value)
                  }}>
                  {tables.map(table => (
                    <option value={table} key={table}>{table}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <ListView
              placeholder={loading}
              items={colNames}
              active={activeColumn}
              className="mt-2"
              height={340}
              onClick={({ title }) => setActiveColumn(title)} />
          </Col>
          <Col>
            <div className="mb-2">
              <span className="text-muted fw-bold">Selected columns: </span>
              {selectedColumns.filter(e => e.table == activeTable).map(e => (
                <Chip
                  closeable
                  className="mb-1 me-1"
                  key={e.column}
                  onClose={() => handleRemoveColumn(activeTable, e.column)}>
                  {e.column}
                </Chip>
              ))}
            </div>
            {loading && <div>
              <Spinner
                animation="border"
                variant="secondary"
                as="span"
                size="sm"
                className="me-2" />
              <span className="text-muted">
                Loading columns of table <u>{activeTable}</u>
              </span>
            </div>}
            {activeColumnObj && <div>
              <div className="mb-2">
                <b>{activeColumnObj.name}:</b>&nbsp;
                {activeColumnObj.description}.&nbsp;
                {activeColumnObj.unit && <>
                  Unit: <i dangerouslySetInnerHTML={{ __html: activeColumnObj.unit }} />
                </>}
              </div>
              <div>
                {isActiveColumnSelected ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveColumn(activeTable, activeColumn)}>
                    <HiMinusSm /> Remove Selected Column
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleAddColumn(activeTable, activeColumn)}>
                    <BiPlus size={16} /> Add Selected Column
                  </Button>
                )}
              </div>
            </div>}
          </Col>
        </Row>
      </Modal.Body>
    </Modal >
  )
}

export default function SdssCatalogTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const [showModal, setShowModal] = useState(false)
  const selectedColumns = tcState.sdssCatalog.selectedColumns

  const selectedTables = useMemo(() => {
    return [...new Set(selectedColumns.map(col => col.table))]
  }, [selectedColumns])

  return (
    <>
      {tcState.sdssCatalog.selectedColumns && <>
        <Table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </Table>
      </>}

      <Button
        onClick={() => setShowModal(true)}>
        Add SDSS Columns
      </Button>

      <SdssModal
        show={showModal}
        onHide={() => setShowModal(false)} />
    </>
  )
}