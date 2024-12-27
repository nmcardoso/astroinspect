import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { SyntheticEvent, useCallback, useState } from 'react'
import { HiCheck, HiX } from 'react-icons/hi'
import LocalFileInput from '@/components/setup/LocalFileInput'
import RemoteFileInput from '@/components/setup/RemoteFileInput'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AIAutocomplete from '@/components/common/AIAutocomplete'
import FileInputColumns from '@/components/setup/FileInputColumns'
import { useRouter } from 'next/navigation'
import { getTableReader } from '@/lib/io'
import TableHelper from '@/lib/TableHelper'
import { cloneDeep } from 'lodash'
import LoadingButton from '@mui/lab/LoadingButton'
import FlashOnIcon from '@mui/icons-material/FlashOn'


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
          // state: selectedIndex >= 0 && tcState.table.decIndex != undefined && tcState.table.decIndex >= 0 ? 'success' : tcState.table.state
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
          // state: selectedIndex >= 0 && tcState.table.raIndex != undefined && tcState.table.raIndex >= 0 ? 'success' : tcState.table.state
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


export default function FileInputTab() {
  const { tcState } = useXTableConfig()
  const router = useRouter()
  const { tcDispatch } = useXTableConfig()

  const step1Error = false
  const step2Error = tcState.table.state == 'error'
  const step3Error = tcState.table.state == 'positionNotFound' && (
    tcState.table.raIndex == undefined || tcState.table.raIndex < 0 ||
    tcState.table.decIndex == undefined || tcState.table.decIndex < 0
  )
  const step4Error = !(tcState.table.columns && tcState.table.columns.length > 0)

  const handleTableLoad = useCallback(async () => {
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        state: 'loading'
      }
    })

    let data
    if (tcState.table.type === 'local' && !!tcState.table.file) {
      data = await getTableReader(tcState.table.file as File)?.read()
    } else if (tcState.table.type === 'remote' && !!tcState.table.url) {
      data = await getTableReader(tcState.table.url as string)?.read()
    } else {
      return
    }

    const { colDef, initVal } = TableHelper.getColDefs(tcState)

    data = data?.map((e, i, _) => ({ ...e, ...initVal, 'ai:id': String(i + 1) }))

    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: {
        data: data,
        colDef: colDef,
        isLoaded: true,
        currColConfigs: cloneDeep(tcState.cols),
        currTable: { ...tcState.table },
        api: undefined,
      }
    })

    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        state: 'success'
      }
    })

    router.push('/table')
  }, [tcState, router,])

  return (
    <>
      <Stepper activeStep={0} orientation="vertical" nonLinear={true}>
        <Step expanded={true} active={true}>
          <StepLabel optional={undefined} error={step1Error}>
            Source type
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <SourceSelector />
          </StepContent>
        </Step>

        <Step expanded={true} active={true}>
          <StepLabel optional={undefined} error={step2Error}>
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

        <Step
          expanded={!step2Error}
          active={
            !step2Error && tcState.table.state !== 'unloaded' &&
            tcState.table.state !== 'loading'
          }>
          <StepLabel
            optional={
              step3Error && <Typography variant="caption" color="error">
                Can not detect coordinates columns automatically,
                please select the RA and DEC columns manually
              </Typography>}
            error={step3Error}>
            Configure coordinates
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <div className={tcState.table.state == 'unloaded' ? 'd-none' : ''}>
              <PositionColumns />
            </div>
          </StepContent>
        </Step>

        <Step
          expanded={!step3Error}
          active={!step2Error && !step3Error && tcState.table.state !== 'unloaded' &&
            tcState.table.state !== 'loading'
          }>
          <StepLabel>
            Select columns
          </StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            {!step3Error && <FileInputColumns />}
          </StepContent>
        </Step>
      </Stepper>

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: 3 }}>
        <LoadingButton
          loading={tcState.table.state == 'loading'}
          loadingPosition="start"
          disabled={step1Error || step2Error || step3Error || tcState.table.state == 'unloaded'}
          variant="contained"
          size="large"
          startIcon={<FlashOnIcon />}
          onClick={handleTableLoad}>
          Load table
        </LoadingButton>
      </Box>
    </>
  )
}