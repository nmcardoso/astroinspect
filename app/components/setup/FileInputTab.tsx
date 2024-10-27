import ButtonChip from '@/components/common/ButtonChip'
import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { MouseEventHandler } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { HiCheck, HiX } from 'react-icons/hi'
import LocalFileInput from './LocalFileInput'
import RemoteFileInput from './RemoteFileInput'
import InputGroup from 'react-bootstrap/InputGroup'


const StateMessage = ({ state }: { state: any }) => {
  if (state == 'loading') {
    return (
      <p className="text-secondary">
        Loading table...
      </p>
    )
  }

  if (state == 'success') {
    return (
      <p className="text-success">
        <HiCheck /> RA and DEC columns successfully detected
      </p>
    )
  }

  if (state == 'positionNotFound') {
    return (
      <p className="text-danger">
        <HiX /> RA or DEC columns not detected
      </p>
    )
  }

  if (state == 'error') {
    return (
      <p className="text-danger">
        <HiX /> Failed to load this table, check if it&apos;s a valid csv file
      </p>
    )
  }

  return null
}


function PositionColumns() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleRAChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedIndex = parseInt(e.target.value)
    let selectedCols = [...tcState.table.selectedColumnsId]
    if (tcState.table.raIndex != undefined && selectedCols.includes(tcState.table.raIndex)) {
      selectedCols = selectedCols.filter((e) => e != tcState.table.raIndex)
    }
    if (!selectedCols.includes(selectedIndex)) {
      selectedCols.push(selectedIndex)
    }
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        raIndex: selectedIndex,
        raCol: tcState.table.columns?.[e.target.value as unknown as number],
        selectedColumnsId: selectedCols,
        state: selectedIndex >= 0 && tcState.table.decIndex != undefined && tcState.table.decIndex >= 0 ? 'success' : tcState.table.state
      }
    })
  }

  const handleDECChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedIndex = parseInt(e.target.value)
    let selectedCols = [...tcState.table.selectedColumnsId]
    if (tcState.table.decIndex != undefined && selectedCols.includes(tcState.table.decIndex)) {
      selectedCols = selectedCols.filter((e) => e != tcState.table.decIndex)
    }
    if (!selectedCols.includes(selectedIndex)) {
      selectedCols.push(selectedIndex)
    }
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        decIndex: selectedIndex,
        decCol: tcState.table.columns?.[e.target.value as unknown as number],
        selectedColumnsId: selectedCols,
        state: selectedIndex >= 0 && tcState.table.raIndex != undefined && tcState.table.raIndex >= 0 ? 'success' : tcState.table.state
      }
    })
  }

  return (
    <Form.Group as={Row} className="mb-2" controlId="tableSourceSelector">
      <Form.Label column sm="1" className="text-end">
        { }
      </Form.Label>
      <Col sm={5}>
        <InputGroup hasValidation>
          <InputGroup.Text>RA</InputGroup.Text>
          <Form.Select
            required
            isInvalid={tcState.table.raIndex == undefined || tcState.table.raIndex < 0}
            isValid={tcState.table.raIndex !== undefined && tcState.table.raIndex >= 0}
            value={tcState.table.raIndex as unknown as number}
            onChange={handleRAChange}>
            <option value={-1}>-</option>
            {
              tcState.table.columns.map((col, i) => (
                <option value={i} key={col}>
                  {col}
                </option>
              ))
            }
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            RA column not found
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            RA column detected
          </Form.Control.Feedback>
        </InputGroup>
      </Col>

      <Col sm={5}>
        <InputGroup hasValidation>
          <InputGroup.Text>DEC</InputGroup.Text>
          <Form.Select
            required
            isInvalid={tcState.table.decIndex == undefined || tcState.table.decIndex < 0}
            isValid={tcState.table.decIndex !== undefined && tcState.table.decIndex >= 0}
            value={tcState.table.decIndex as unknown as number}
            onChange={handleDECChange}>
            <option value={-1}>-</option>
            {
              tcState.table.columns.map((col, i) => (
                <option value={i} key={col}>
                  {col}
                </option>
              ))
            }
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            DEC column not found
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            DEC column detected
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Form.Group>
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


function ColumnButton({ colName, colId }: { colName: string, colId: number }) {
  const { tcState, tcDispatch } = useXTableConfig()
  const cls = tcState.table.selectedColumnsId.includes(colId) ? 'btn-primary' : 'btn-outline-primary'

  const handleToggle: MouseEventHandler<HTMLDivElement> = () => {
    let newColumns = []
    if (tcState.table.selectedColumnsId.includes(colId)) {
      const itemId = tcState.table.selectedColumnsId.indexOf(colId)
      newColumns = [...tcState.table.selectedColumnsId]
      newColumns.splice(itemId, 1)
    } else {
      newColumns = [...tcState.table.selectedColumnsId, colId]
    }
    // newColumns.sort((a, b) => a - b)

    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        selectedColumnsId: newColumns
      }
    })
  }
  return (
    <ButtonChip
      className={`${cls} me-2 mt-1`}
      onClick={handleToggle}>
      {colName}
    </ButtonChip>
  )
}


function FileInputColumns() {
  const { tcState } = useXTableConfig()

  return (
    <>
      {
        tcState.table.columns && tcState.table.columns.length > 0 && (
          <Form.Group as={Row} className="mb-2" controlId="tableSourceSelector">
            <Form.Label column sm="1" className="text-end">
              Columns
            </Form.Label>
            <Col sm="11">
              <div style={{ maxHeight: 250, overflow: 'auto' }}>
                {
                  tcState.table.columns.map(((col, i) => (
                    <ColumnButton key={i} colId={i} colName={col} />
                  )))
                }
                <Help title="Add Columns">
                  Select columns from input table to include.
                </Help>
              </div>

            </Col>
          </Form.Group>
        )
      }
    </>
  )
}


export default function FileInputTab() {
  const { tcState } = useXTableConfig()

  return (
    <>
      <SourceSelector />

      <div className={tcState.table.type == 'remote' ? 'd-none' : ''}>
        <LocalFileInput />
      </div>
      <div className={tcState.table.type == 'local' ? 'd-none' : ''}>
        <RemoteFileInput />
      </div>

      <div className={tcState.table.state == 'unloaded' ? 'd-none' : ''}>
        <PositionColumns />
      </div>

      <FileInputColumns />
    </>
  )
}