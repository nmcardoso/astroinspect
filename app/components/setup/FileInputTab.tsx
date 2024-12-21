import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { MouseEventHandler, SyntheticEvent } from 'react'
import Form from 'react-bootstrap/Form'
import { HiCheck, HiX } from 'react-icons/hi'
import LocalFileInput from './LocalFileInput'
import RemoteFileInput from './RemoteFileInput'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AIAutocomplete from '../common/AIAutocomplete'


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

  const handleRAChange = (e: SyntheticEvent<Element, Event>, newValue: any) => {
    const selectedIndex = newValue?.index
    if (selectedIndex == null) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          raIndex: -1,
          raCol: undefined,
          selectedColumnsId: tcState.table.selectedColumnsId,
          state: tcState.table.state
        }
      })
    } else {
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
          raCol: tcState.table.columns?.[newValue],
          selectedColumnsId: selectedCols,
          state: selectedIndex >= 0 && tcState.table.decIndex != undefined && tcState.table.decIndex >= 0 ? 'success' : tcState.table.state
        }
      })
    }
  }

  const handleDECChange = (e: SyntheticEvent<Element, Event>, newValue: any) => {
    const selectedIndex = newValue?.index
    if (selectedIndex == null) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          decIndex: -1,
          decCol: undefined,
          selectedColumnsId: tcState.table.selectedColumnsId,
          state: tcState.table.state
        }
      })
    } else {
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
          decCol: tcState.table.columns?.[selectedIndex],
          selectedColumnsId: selectedCols,
          state: selectedIndex >= 0 && tcState.table.raIndex != undefined && tcState.table.raIndex >= 0 ? 'success' : tcState.table.state
        }
      })
    }
  }

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'basline' }}>
      <AIAutocomplete
        label="RA"
        isInvalid={tcState.table.raIndex == undefined || tcState.table.raIndex < 0}
        isValid={tcState.table.raIndex !== undefined && tcState.table.raIndex >= 0}
        value={{ index: tcState.table.raIndex, label: (tcState.table.raIndex != undefined && tcState.table.columns?.[tcState.table.raIndex]) || '' }}
        onChange={handleRAChange}
        invalidMessage="RA column not found"
        getOptionLabel={opt => opt.label}
        getOptionKey={opt => opt.index}
        options={tcState.table.columns.map((c, i) => ({ label: c, index: i }))} />

      <AIAutocomplete
        label="DEC"
        isInvalid={tcState.table.decIndex == undefined || tcState.table.decIndex < 0}
        isValid={tcState.table.decIndex !== undefined && tcState.table.decIndex >= 0}
        value={{ index: tcState.table.decIndex, label: (tcState.table.decIndex != undefined && tcState.table.columns?.[tcState.table.decIndex]) || '' }}
        onChange={handleDECChange}
        invalidMessage="DEC column not found"
        getOptionLabel={opt => opt.label}
        getOptionKey={opt => opt.index}
        options={tcState.table.columns.map((c, i) => ({ label: c, index: i }))} />
    </Stack>
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
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="file-input-source-label"
          name="file-input-source-group"
          value={tcState.table.type}
          onChange={handleTypeChange}>
          <FormControlLabel value="local" control={<Radio />} label="Local" />
          <FormControlLabel value="remote" control={<Radio />} label="Remote" sx={{ pl: 3 }} />
        </RadioGroup>
      </FormControl>
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
    </Stack>
  )
}


function ColumnButton({ colName, colId }: { colName: string, colId: number }) {
  const { tcState, tcDispatch } = useXTableConfig()
  const variant = tcState.table.selectedColumnsId.includes(colId) ? 'filled' : 'outlined'

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
    <Chip
      variant={variant}
      color="primary"
      sx={{ mr: 1, mt: 1 }}
      onClick={handleToggle}
      label={colName} />
  )
}


function FileInputColumns() {
  const { tcState } = useXTableConfig()

  return (
    <>
      {
        tcState.table.columns && tcState.table.columns.length > 0 && (
          <Box sx={{ maxWidth: '100%', maxHeight: 250, overflow: 'auto' }}>
            {
              tcState.table.columns.map(((col, i) => (
                <ColumnButton key={i} colId={i} colName={col} />
              )))
            }
            {/* <Help title="Add Columns">
              Select columns from input table to include.
            </Help> */}
          </Box>
        )
      }
    </>
  )
}


export default function FileInputTab() {
  const { tcState } = useXTableConfig()

  return (
    <>
      <Stepper activeStep={0} orientation="vertical" nonLinear={true}>
        <Step expanded={true} active={true}>
          <StepLabel optional={undefined}>
            Source type
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <SourceSelector />
          </StepContent>
        </Step>

        <Step expanded={true} active={true}>
          <StepLabel optional={undefined}>
            Upload file
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <div className={tcState.table.type == 'remote' ? 'd-none' : ''}>
              <LocalFileInput />
            </div>
            <div className={tcState.table.type == 'local' ? 'd-none' : ''}>
              <RemoteFileInput />
            </div>
          </StepContent>
        </Step>

        <Step expanded={true} active={tcState.table.state != 'unloaded'}>
          <StepLabel optional={undefined}>
            Configure coordinates
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <div className={tcState.table.state == 'unloaded' ? 'd-none' : ''}>
              <PositionColumns />
            </div>
          </StepContent>
        </Step>

        <Step expanded={true} active={tcState.table.columns && tcState.table.columns.length > 0}>
          <StepLabel optional={undefined}>
            Select columns
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <FileInputColumns />
          </StepContent>
        </Step>
      </Stepper>
    </>
  )
}