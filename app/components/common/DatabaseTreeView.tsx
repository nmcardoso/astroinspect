import { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListView from './ListView'

type PropsType = {
  service: any,
  schema: string,
  onAddColumn: any,
  onRemoveColumn: any
}

export default function DatabaseTreeView({
  service,
  schema,
  onAddColumn = () => { },
  onRemoveColumn = () => { }
}: PropsType) {
  const [tables, setTables] = useState([] as string[])
  const [selectedTable, setSelectedTable] = useState(null as string | null)
  const [columns, setColumns] = useState([] as string[])
  const [selectedColumns, setSelectedColumns] = useState(
    [] as { table: string | null, column: string }[]
  )

  useEffect(() => {
    const wrapper = async () => {
      const columns = await service.getColumns(schema, selectedTable)
      setColumns(columns)
    }
    wrapper()
  }, [selectedTable, service, schema])

  useEffect(() => {
    const wrapper = async () => {
      const tables = await service.getTables(schema)
      setTables(tables)
    }
    wrapper()
  }, [schema, service])

  const handleColumnClick = ({ title }: { title: string }) => {
    const i = selectedColumns.findIndex(e => (
      (e.table == selectedTable) && (e.column == title)
    ))

    if (i > -1) {
      selectedColumns.splice(i, 1)
      setSelectedColumns([...selectedColumns])
      onAddColumn({ table: selectedTable, column: title, selectedColumns })
    } else {
      selectedColumns.push({ table: selectedTable, column: title })
      setSelectedColumns([...selectedColumns])
      onRemoveColumn({ table: selectedTable, column: title, selectedColumns })
    }
  }


  return (
    <>
      <Row>
        <Col>
          <span className="fw-bold">Tables</span>
          <ListView
            items={tables}
            active={selectedTable}
            onClick={({ title }: { title: string }) => setSelectedTable(title)} />
        </Col>
        <Col>
          <span className="fw-bold">Columns</span>
          <ListView
            multiple
            items={columns}
            active={selectedColumns.filter(e => e.table == selectedTable).map(e => e.column)}
            onClick={handleColumnClick} />
        </Col>
      </Row>
    </>
  )
}