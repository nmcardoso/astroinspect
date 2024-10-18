import { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import ListView from '@/components/common/ListView'
import Modal from 'react-bootstrap/Modal'
import { Button, Table } from 'react-bootstrap'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { BiPlus } from 'react-icons/bi'
import { HiMinusSm } from 'react-icons/hi'
import { ContextActions } from '@/interfaces/contextActions'
import Chip from '@/components/common/Chip'
import uniq from 'lodash/uniq'

type CatalogDisplayProps = {
  initialSelectedTable?: string,
  service: any,
  selectedColumns: { table: string, column: string }[],
  onAddColumn: (table?: string, column?: string) => any,
  onRemoveColumn: (table?: string, column?: string) => any,
}

export default function CatalogDisplay({
  initialSelectedTable = '',
  service,
  selectedColumns = [],
  onAddColumn,
  onRemoveColumn,
}: CatalogDisplayProps) {
  const [activeTable, setActiveTable] = useState(initialSelectedTable) //tables[0]
  const [activeColumn, setActiveColumn] = useState('')
  const [columns, setColumns] = useState<SdssColumnDesc[] | undefined>([])
  const [tables, setTables] = useState<string[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const selectedTables = useMemo(() => {
    return uniq(selectedColumns.map(col => col.table))
  }, [selectedColumns])

  useEffect(() => {
    if (!!activeTable) {
      setLoading(true)
      service.getColumns(activeTable).then((r: any) => {
        setColumns(r)
        setLoading(false)
      }).catch(console.log)
    }
  }, [activeTable, service])

  useEffect(() => {
    service.getTables().then((tbls: any) => {
      setTables(tbls)
      setLoading(false)
      if (tbls.length > 0) {
        setActiveTable(tbls[0])
      }
    }).catch(console.log)
  }, [service])

  const colNames = useMemo(() => columns?.map(col => col.name), [columns]) || []

  const activeColumnObj = useMemo(() => (
    columns?.find(col => col.name == activeColumn)
  ), [columns, activeColumn])

  const isActiveColumnSelected = useMemo(() => (
    selectedColumns.findIndex(s => (
      s.column == activeColumn && s.table == activeTable
    )) > -1
  ), [selectedColumns, activeColumn, activeTable])

  return (
    <>
      {/* <Row>
        <Col>
          {selectedColumns.length > 0 && <>
            {selectedTables.map(table => (
              <div key={table} className="mb-2">
                <span className="me-2 fw-bold">{table}:</span>
                {selectedColumns.filter(col => col.table == table).map(col => (
                  <Chip
                    key={col.column}
                    className="mb-1 me-1"
                    onClose={() => onRemoveColumn(col.table, col.column)}>
                    {col.column}
                  </Chip>
                ))}
              </div>
            ))}
          </>}
        </Col>
      </Row> */}

      <Row>
        <Col sm={5}>
          <Row className="align-items-center">
            <Col lg={2}>
              <span className="text-muted fw-bold">Table:</span>
            </Col>
            <Col>
              <Form.Select
                defaultValue={activeTable}
                onChange={(e) => {
                  setLoading(true)
                  setActiveColumn('')
                  setActiveTable(e.target.value)
                }}>
                {tables && tables.map(table => (
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
            height={290}
            onClick={({ title }) => setActiveColumn(title)} />
        </Col>
        {loading ? (
          <Col>
            <Spinner
              animation="border"
              variant="secondary"
              as="span"
              size="sm"
              className="me-2" />
            <span className="text-muted">
              Loading columns of the <u>{activeTable}</u> table
            </span>
          </Col>
        ) : (
          <Col>
            {/* {selectedColumns.filter(e => e.table == activeTable).length > 0 && (
              <div className="mb-2">
                <span className="text-muted fw-bold">
                  Selected columns of current table:&nbsp;
                </span>
                {selectedColumns.filter(e => e.table == activeTable).map(e => (
                  <Chip
                    closeable
                    className="mb-1 me-1"
                    key={e.column}
                    onClose={() => onRemoveColumn(activeTable, e.column)}>
                    {e.column}
                  </Chip>
                ))}
              </div>
            )} */}

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
                    onClick={() => onRemoveColumn(activeTable, activeColumn)}>
                    <HiMinusSm /> Remove Selected Column
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onAddColumn(activeTable, activeColumn)}>
                    <BiPlus size={16} /> Add Selected Column
                  </Button>
                )}
              </div>
            </div>}



            {
              selectedColumns.length > 0 && <div className="mt-4">
                {
                  selectedTables.map(table => (
                    <div key={table} className="mb-1">
                      <span className="me-2 fw-bold text-muted">{table}:</span>
                      {
                        selectedColumns.filter(col => col.table == table).map(col => (
                          <Chip
                            key={col.column}
                            className="mb-1 me-1"
                            onClose={() => onRemoveColumn(col.table, col.column)}>
                            {col.column}
                          </Chip>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            }
          </Col>
        )}
      </Row>
    </>
  )
}