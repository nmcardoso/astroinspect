import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ProcessHeaderForExportParams, ShouldRowBeSkippedParams } from '@ag-grid-community/core'
import { useCallback, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import { AiOutlineCloudDownload } from 'react-icons/ai'


const DownloadModal = ({ show, onHide }: any) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const [filename, setFilename] = useState<string>('')
  const [colFilter, setColFilter] = useState<'all' | 'selected'>('all')
  const [classFilter, setClassFilter] = useState<'all' | 'classified' | 'unclassified'>('all')
  const [filterAndSort, setFilterAndSort] = useState(false)

  const handleDownload: React.FormEventHandler<HTMLFormElement> = (event) => {//useCallback((event) => {
    event.preventDefault()
    // event.stopPropagation()

    const getColKeys = () => {
      let userTableCols = []
      if (colFilter === 'all') {
        userTableCols = tcState.table.selectedColumnsId.map(i => (
          `tab:${tcState.table.columns[i]}`
        ))
      } else {
        userTableCols = tcState.table.columns.map(c => (
          `tab:${c}`
        ))
      }
      const sdssCols = tcState.cols.sdssCatalog.selectedColumns.map(col => (
        `sdss:${col.table}_${col.column}`
      ))
      const classCols = tcState.cols.classification.enabled ? ['ai:class'] : []
      return [...userTableCols, ...sdssCols, ...classCols]
    }

    const skipClassified = ({ node }: ShouldRowBeSkippedParams) => (
      node.data?.['ai:class'] === undefined
    )

    const skipUnclassified = ({ node }: ShouldRowBeSkippedParams) => (
      node.data?.['ai:class'] !== undefined
    )

    const getClassFilter = () => {
      if (classFilter === 'classified') {
        return skipClassified
      } else if (classFilter === 'unclassified') {
        return skipUnclassified
      } else {
        return undefined
      }
    }

    const processHeader = ({ column }: ProcessHeaderForExportParams) => {
      if (column.getColDef().field === 'ai:class') {
        return 'AstroInspectClass'
      }
      return column.getColDef().headerName
    }
    tcState.grid.api.exportDataAsCsv({
      suppressQuotes: true,
      columnKeys: getColKeys(),
      fileName: filename || 'AstroInspect',
      exportedRows: filterAndSort ? 'filteredAndSorted' : 'all',
      shouldRowBeSkipped: getClassFilter(),
      processHeaderCallback: processHeader,
    })
  }//, [tcState, classFilter, colFilter, filterAndSort, filename])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      size="lg"
      centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5" id="contained-modal-title-vcenter">
          Download current table
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleDownload}
          className="mt-3">
          <Form.Group as={Row} className="mb-2" controlId="classDownload">
            <Form.Label column sm="2" className="text-end">
              File name
            </Form.Label>
            <Col sm={8}>
              <div className="d-flex align-items-center">
                <InputGroup>
                  <Form.Control
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="File name" />
                  <InputGroup.Text id="basic-addon2">.csv</InputGroup.Text>
                </InputGroup>
                <Help title="File name" className="ms-2">
                  Choose a name and save your classifications in local computer
                </Help>
              </div>
            </Col>
          </Form.Group>


          {tcState.cols.classification.enabled &&
            <Form.Group as={Row} className="mb-2" controlId="colFilter">
              <Form.Label column sm="2" className="text-end">
                Classification
              </Form.Label>
              <Col sm={8}>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    inline
                    className="me-2"
                    checked={classFilter === 'all'}
                    label="all"
                    name="filterClass"
                    type="radio"
                    value="all"
                    id="filterClass-1"
                    onChange={(e) => setClassFilter('all')}
                  />
                  <Form.Check
                    inline
                    className="me-2"
                    checked={classFilter === 'classified'}
                    label="classified only"
                    name="filterClass"
                    type="radio"
                    value="classified"
                    id="filterClass-2"
                    onChange={(e) => setClassFilter('classified')}
                  />
                  <Form.Check
                    inline
                    className="me-2"
                    checked={classFilter === 'unclassified'}
                    label="unclassified only"
                    name="filterClass"
                    type="radio"
                    value="unclassified"
                    id="filterClass-3"
                    onChange={(e) => setClassFilter('unclassified')}
                  />
                  <Help title="Filter rows by class" className="ms-0">
                    This setting will sample the rows based in the classification
                    state:
                    <ul>
                      <li>
                        <b>all: </b> in this case, no filtering is performed and
                        the output table will contain all rows, including both
                        classified and unclassified rows
                      </li>
                      <li>
                        <b>classified only: </b> the output table will contain only classified
                        rows
                      </li>
                      <li>
                        <b>unclassified only: </b> the output table will contain only unclassified
                        rows
                      </li>
                    </ul>
                  </Help>
                </div>
              </Col>
            </Form.Group>
          }


          <Form.Group as={Row} className="mb-2" controlId="classFilter">
            <Form.Label column sm="2" className="text-end">
              Rows
            </Form.Label>
            <Col sm={8}>
              <div className="d-flex align-items-center mt-2">
                <Form.Check
                  inline
                  checked={filterAndSort}
                  label="filter & sort"
                  name="filterRow"
                  type="checkbox"
                  value="filteredAndSorted"
                  id="filterRow-2"
                  onChange={(e) => setFilterAndSort(true)}
                />
                <Help title="Filter rows by filter" className="ms-0">
                  This setting will sample the rows based in the following
                  criteria:
                  <ul>
                    <li>
                      If this option is <b>selected</b>, the same filters applied in the application will
                      also be applied to the output table, that is, it will contain the <u>same
                        rows that you are seeing in the application</u> and in the same order.
                    </li>
                    <li>
                      If this option is <b>unselected</b>, no filtering is performed
                      and the output table will have the <u>same rows as the input table</u> and
                      in same order.
                    </li>
                  </ul>
                  <b>Note: </b> If you have not applied any filtering or sorting to the
                  columns, then the result will be the same for any option in this setting.
                </Help>
              </div>
            </Col>
          </Form.Group>



          {/* <Form.Group as={Row} className="mb-2" controlId="rowFilter">
            <Form.Label column sm="2" className="text-end">
              Columns
            </Form.Label>
            <Col sm={8}>
              <div className="d-flex align-items-center mt-2">
                <Form.Check
                  inline
                  defaultChecked
                  label="all columns"
                  name="filterColumn"
                  type="radio"
                  value="all"
                  id="filterColumn-1"
                  onChange={(e) => setColFilter('all')}
                />
                <Form.Check
                  inline
                  label="selected columns"
                  name="filterColumn"
                  type="radio"
                  value="selected"
                  id="filterColumn-2"
                  onChange={(e) => setColFilter('selected')}
                />
                <Help title="Filter columns" className="ms-0">
                  This setting will select the columns based in the following
                  criteria:<br />
                  <ul>
                    <li>
                      <b>all columns: </b> includes all columns of the input table
                    </li>
                    <li>
                      <b>selected columns: </b> includes only selected columns of
                      the input table
                    </li>
                  </ul>
                  <b>Note: </b> in both cases, the selected columns of online
                  services (like SDSS) will be downloaded.
                </Help>
              </div>
            </Col>
          </Form.Group> */}


          <Form.Group as={Row} className="my-3" controlId="classDownloadBtn">
            <Form.Label column sm="2" className="text-end" />
            <Col sm={8}>
              <InputGroup>
                <Button variant="primary" type="submit">
                  <AiOutlineCloudDownload size={18} className="me-1" />
                  {' '}Download table
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}



export default function DownloadTableButton() {
  const { tcState } = useXTableConfig()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        variant="outline-primary"
        className="d-inline-flex align-items-center"
        onClick={() => setShowModal(true)}>
        <AiOutlineCloudDownload size={19} className="me-1" />
        <span>Download</span>
      </Button>
      <DownloadModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  )
}