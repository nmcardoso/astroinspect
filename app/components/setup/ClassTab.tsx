import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Help from '@/components/common/Help'
import { AiOutlineCloudDownload } from 'react-icons/ai'
import { useCallback, useEffect, useState } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import Chip from '@/components/common/Chip'
import { FaRegKeyboard } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal'
import { ContextActions } from '@/interfaces/contextActions'
import { BiPlus } from 'react-icons/bi'

type handlerType = (value: string, classes: string[], dispatcher: any) => void

const handleAddClass: handlerType = (value, classes, dispatcher) => {
  const sanitizedValue = value.trim()
  if (sanitizedValue && !classes.includes(sanitizedValue)) {
    classes.push(sanitizedValue)
    dispatcher({
      type: ContextActions.CLASSIFICATION_CONFIG,
      payload: { classNames: classes }
    })
  }
}

const handleDelClass: handlerType = (value, classes, dispatcher) => {
  const newClasses = classes.filter(v => v != value)
  dispatcher({
    type: ContextActions.CLASSIFICATION_CONFIG,
    payload: { classNames: newClasses }
  })
}

function CategoricalControl() {
  const { tcState, tcDispatch } = useXTableConfig()
  const cls = tcState.cols.classification
  const [classInput, setClassInput] = useState('')
  const [showHotkeyModal, setHotkeyModal] = useState(false)

  return (
    <Form.Group as={Row} className="mb-2" controlId="classNames">
      <Form.Label column sm={1}>
        Classes
      </Form.Label>
      <Col sm={8}>
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddClass(classInput, cls.classNames, tcDispatch)
            setClassInput('')
          }}>
          <div className="d-flex align-items-center mb-2">
            <InputGroup>
              <Form.Control
                placeholder="Class name"
                value={classInput}
                onChange={e => setClassInput(e.target.value)} />
              <Button 
                variant="primary" 
                type="submit" 
                className="d-inline-flex align-items-center">
                <BiPlus size={20} className="me-1" />
                <span>Add</span>
              </Button>
            </InputGroup>
            <Help title="Class Name" className="ms-1">
              Type the class name and press <kbd>ENTER</kbd> or click Add button
            </Help>
            <Button
              style={{ whiteSpace: 'nowrap' }}
              className="ms-4"
              variant="outline-primary"
              disabled={tcState.cols.classification.classNames.length == 0}
              onClick={() => setHotkeyModal(true)}>
              <FaRegKeyboard size={20} className="me-1" /> Hotkeys
            </Button>
            <Help title="Hotkeys" className="ms-1">
              Classify your table quickly by configuring keyboard keys to
              select classes
            </Help>
            <HotkeyModal
              show={showHotkeyModal}
              onHide={() => setHotkeyModal(false)} />
          </div>
        </Form>
        {cls.classNames.map(className => (
          <Chip
            key={`cname_${className}`}
            className="mb-1 me-1"
            onClose={() => handleDelClass(className, cls.classNames, tcDispatch)}>
            {className}
            {className in tcState.cols.classification.keyMap && (
              <span>
                {' ('}
                <b>{tcState.cols.classification.keyMap[className].toUpperCase()}</b>
                {')'}
              </span>
            )}
          </Chip>
        ))}
      </Col>
    </Form.Group>
  )
}

function HotkeyModal({ show, onHide }: any) {
  const { tcState, tcDispatch } = useXTableConfig()
  const cls = tcState.cols.classification
  const [selectedClass, setSelectedClass] = useState<any>(-1)

  const handleKeyDown = useCallback((event: any) => {
    event.stopPropagation()
    if (/^[\w\d]$/i.test(event.key) && selectedClass != -1) {
      tcDispatch({
        type: ContextActions.CLASSIFICATION_CONFIG,
        payload: {
          keyMap: {
            ...tcState.cols.classification.keyMap,
            [selectedClass]: event.key
          }
        }
      })
    }
  }, [tcDispatch, tcState, selectedClass])

  useEffect(() => {
    if (show) {
      document.addEventListener("keydown", handleKeyDown, true)
    } else {
      document.removeEventListener("keydown", handleKeyDown, true)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [handleKeyDown, show])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Hotkeys configuration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          Select a class below and press an alphanumeric (A-Z, 0-9)
          character on the keyboard.
          After associating the keyboard shortcuts for the desired classes,
          just click on the table row and press the key referring to the class.
        </p>
        <Form onSubmit={e => e.preventDefault()}>
          <Form.Group as={Row} className="mb-3" controlId="hotkeyClass">
            <Form.Label column sm={2}>
              Class
            </Form.Label>
            <Col sm={10}>
              <Form.Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}>
                <option value={-1}>Select a class</option>
                {cls.classNames.map(className => (
                  <option
                    key={className}
                    value={className}>
                    {className}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>

          <Row className="d-inline-flex align-items-center">
            <Col sm={2}>
              Hotkey
            </Col>
            <Col sm={3}>
              <Form.Control
                readOnly
                type="text"
                size="lg"
                value={cls.keyMap[selectedClass] ? cls.keyMap[selectedClass].toUpperCase() : ''}
                style={{ fontWeight: 800, textAlign: 'center' }} />
            </Col>
            <Col>
              <Button
                className="ps-0"
                variant="link"
                onClick={() => {
                  const keyMap = tcState.cols.classification.keyMap
                  if (selectedClass in keyMap) {
                    delete keyMap[selectedClass]
                    tcDispatch({
                      type: ContextActions.CLASSIFICATION_CONFIG,
                      payload: { keyMap }
                    })
                  }
                }}>
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
}



export default function ClassTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  // const { tdState } = useXTableData()
  const cls = tcState.cols.classification

  // const handleDownload = (e: any) => {
  //   e.preventDefault()
  //   const data = tdState.data
  //   let fname = e.target.classDownload.value

  //   if (!fname || !fname?.trim() || !data?.length) return
  //   fname = fname.endsWith('.csv') ? fname : fname + '.csv'

  //   const colMap: any = Object.keys(data[0]).map(col => {
  //     if (col == 'classification') {
  //       return { from: col, to: 'XTableClass' }
  //     } else if (col.startsWith('sourceTable:')) {
  //       return { from: col, to: col.split(':')[1] }
  //     } else if (col.startsWith('sdss:')) {
  //       return { from: col, to: col.split('.')[1] }
  //     }
  //     return null
  //   }).filter(col => col != null)

  //   const _data = cls.enabled && cls.filterUnclassified ?
  //     data.filter((row: any) => !!row.classification) : data

  //   const transformedData = _data.map((row: any) => {
  //     const transformedRow: any = {}
  //     for (const c of colMap) {
  //       transformedRow[c.to] = row[c.from]
  //     }
  //     return transformedRow
  //   })

  //   const csvStr = Papa.unparse(transformedData, { header: true })
  //   const fileStr = 'data:text/csv;charset=utf-8,' + csvStr
  //   const linkEl = document.createElement('a')
  //   linkEl.setAttribute('href', encodeURI(fileStr))
  //   linkEl.setAttribute('download', fname)
  //   document.body.appendChild(linkEl)
  //   linkEl.click()
  //   linkEl.remove()
  // }

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
              label="Show classification column"
              checked={cls.enabled}
              onChange={(e) => tcDispatch({
                type: ContextActions.CLASSIFICATION_CONFIG,
                payload: { enabled: e.target.checked }
              })} />
            <Help title="Enable Classifications" className="ms-1">
              Select this option if you want to classify the table,
              unsect to hide the classification column
            </Help>
          </div>
        </Col>
      </Form.Group>

      <CategoricalControl />
    </>
  )
}