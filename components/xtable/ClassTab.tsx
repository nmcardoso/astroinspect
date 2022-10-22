import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Help from '../common/Help'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { useContext, useState } from 'react'
import { useXTableConfig } from '../../contexts/XTableConfigContext'
import Chip from '../common/Chip'
import Papa from 'papaparse'
import { useXTableData } from '../../contexts/XTableDataContext'
import Emitter from '../../lib/Emitter'

type handlerType = (value: string, classes: string[], dispatcher: any) => void

const handleAddClass: handlerType = (value, classes, dispatcher) => {
  const sanitizedValue = value.trim()
  if (sanitizedValue && !classes.includes(sanitizedValue)) {
    classes.push(sanitizedValue)
    dispatcher({
      type: 'setClassification',
      payload: { classNames: classes }
    })
  }
}

const handleDelClass: handlerType = (value, classes, dispatcher) => {
  const newClasses = classes.filter(v => v != value)
  dispatcher({
    type: 'setClassification',
    payload: { classNames: newClasses }
  })
}

function CategoricalControl() {
  const { tcState, tcDispatch } = useXTableConfig()
  const cls = tcState.classification
  const [classInput, setClassInput] = useState('')

  return (
    <Form.Group as={Row} className="mb-2" controlId="classNames">
      <Form.Label column sm={1}>
        Classes
      </Form.Label>
      <Col sm={8}>
        <div className="d-flex align-items-center mb-2">
          <InputGroup>
            <Form.Control
              placeholder="Class name"
              value={classInput}
              onChange={e => setClassInput(e.target.value)}
              onKeyDown={e => {
                const key = e.key || e.keyCode
                if (key === 'Enter' || key === 13) {
                  handleAddClass(classInput, cls.classNames, tcDispatch)
                  setClassInput('')
                }
              }} />
            <Button
              variant="success"
              onClick={() => {
                handleAddClass(classInput, cls.classNames, tcDispatch)
                setClassInput('')
              }}>
              Add
            </Button>
          </InputGroup>
          <Help title="Class Name" className="ms-1">
            Type the class name and press `ENTER` or click `Add`
          </Help>
        </div>
        {cls.classNames.map(className => (
          <Chip
            key={`cname_${className}`}
            className="mb-1 me-1"
            onClose={() => handleDelClass(className, cls.classNames, tcDispatch)}>
            {className}
          </Chip>
        ))}
      </Col>
    </Form.Group>
  )
}



export default function ClassTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const { tdState } = useXTableData()
  const cls = tcState.classification

  const handleDownload = (e: any) => {
    e.preventDefault()
    let fname = e.target.classDownload.value
    if (!fname || !fname?.trim()) return
    fname = fname.endsWith('.csv') ? fname : fname + '.csv'

    const data = tdState.data
    const colMap: any = Object.keys(data[0]).map(col => {
      if (col == 'classification') {
        return { from: col, to: 'XTableClass' }
      } else if (col.startsWith('sourceTable:')) {
        return { from: col, to: col.split(':')[1] }
      } else if (col.startsWith('sdss:')) {
        return { from: col, to: col.split('.')[1] }
      }
      return null
    }).filter(col => col != null)

    const _data = !tcState.classification.filterUnclassified ? data :
      data.filter((row: any) => !!row.classification)
    const transformedData = _data.map((row: any) => {
      const transformedRow: any = {}
      for (const c of colMap) {
        transformedRow[c.to] = row[c.from]
      }
      return transformedRow
    })

    const csvStr = Papa.unparse(transformedData, { header: true })
    const fileStr = 'data:text/csv;charset=utf-8,' + csvStr
    const linkEl = document.createElement('a')
    linkEl.setAttribute('href', encodeURI(fileStr))
    linkEl.setAttribute('download', fname)
    document.body.appendChild(linkEl)
    linkEl.click()
    linkEl.remove()
  }

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="classCheck">
        <Form.Label column sm="1">
          Enable
        </Form.Label>
        <Col sm="11" className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              label="Show Classification Column"
              checked={cls.enabled}
              onChange={(e) => tcDispatch({
                type: 'setClassification',
                payload: { enabled: e.target.checked }
              })} />
            <Help title="Enable Classifications" className="ms-1">
              Select this option if you want to classify the table,
              unsect to hide the classification column
            </Help>
          </div>
        </Col>
      </Form.Group>

      {/* <Form.Group as={Row} className="mb-2" controlId="classCheck">
        <Form.Label column sm="1">
          Type
        </Form.Label>
        <Col sm="11">
          <div className="d-flex align-items-center">
            <Form.Select
              value={cls.type}
              onChange={(e) => tcDispatch({
                type: 'setClassification',
                payload: { type: e.target.value }
              })}>
              <option value="categorical">Categorical</option>
              <option value="binary">Binary</option>
              <option value="filter">Filter</option>
            </Form.Select>
            <Help title="Classification Type" className="ms-1">
              Classification types are designed for 3 different use cases:<br />
              <b>Categorical: </b> you can classify as many classes you want and
              the classes will be displayed in a dropdown<br />
              <b>Binary: </b> you can classify between two classes, but this
              is faster than categorical since you can just click in row to
              toggle the class of the object<br />
              <b>Filter: </b> is a binary classification were only the positive
              class (selected rows) will be saved
            </Help>
          </div>
        </Col>
      </Form.Group> */}

      {cls.type == 'categorical' ? <CategoricalControl /> :
        (cls.type == 'binary' ? null : null)}

      <Form
        className="mt-3"
        onSubmit={handleDownload}>
        <Form.Group as={Row} className="mb-2" controlId="classDownload">
          <Form.Label column sm="1">
            Save
          </Form.Label>
          <Col sm={8}>
            <div className="d-flex align-items-center">
              <InputGroup>
                <Form.Control placeholder="File name" />
                <Button variant="primary" type="submit">
                  <AiOutlineCloudDownload size={18} className="me-1" />
                  {' '}Download classifications
                </Button>
              </InputGroup>
              <Help title="Save Classifications" className="ms-1">
                Choose a name and save your classifications in local computer
              </Help>
            </div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-2" controlId="classFilter">
          <Form.Label column sm="1">
          </Form.Label>
          <Col sm={8}>
            <div className="d-flex align-items-center">
              <Form.Check
                type="switch"
                label="Filter unclassified rows"
                checked={tcState.classification.filterUnclassified}
                onChange={e => tcDispatch({
                  type: 'setClassification',
                  payload: { filterUnclassified: e.target.checked }
                })}
              />
              <Help title="Filter unclassified" className="ms-1">
                Download file without the unclassified rows
              </Help>
            </div>
          </Col>
        </Form.Group>
      </Form>
    </>
  )
}