import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from '@mui/material/Button'
import Help from '@/components/common/Help'
import { useCallback, useEffect, useState } from 'react'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import Chip from '@mui/material/Chip'
import Modal from 'react-bootstrap/Modal'
import { ContextActions } from '@/interfaces/contextActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt'
import AddIcon from '@mui/icons-material/Add'
import Grid2 from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { DialogsProvider, useDialogs } from '@toolpad/core/useDialogs'
import Alert from '@mui/material/Alert'

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
  const dialogs = useDialogs()

  return (
    <>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddClass(classInput, cls.classNames, tcDispatch)
            setClassInput('')
          }}>

          <TextField
            label="Class name"
            variant="outlined"
            sx={{ width: '40ch' }}
            value={classInput}
            onChange={e => setClassInput(e.target.value)}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="start">
                  <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                    Add
                  </Button>
                </InputAdornment>,
              },
            }}
          />
        </Box>
        <Help title="Class Name" className="ms-1">
          Type the class name and press <kbd>ENTER</kbd> or click Add button
        </Help>
      </Stack>


      <Box>
        {cls.classNames.map(className => (
          <Chip
            key={`cname_${className}`}
            sx={{ m: 1 }}
            onDelete={() => handleDelClass(className, cls.classNames, tcDispatch)}
            onClick={async () => {
              const hotkey = await dialogs.prompt(
                'Type the hotkey (one character) then press <ENTER>',
                { title: '', okText: 'set hotkey' }
              )
              if (hotkey) {
                tcDispatch({
                  type: ContextActions.CLASSIFICATION_CONFIG,
                  payload: {
                    keyMap: {
                      ...tcState.cols.classification.keyMap,
                      [className]: hotkey
                    }
                  }
                })
              }
            }}
            label={
              <Typography fontSize={15}>
                {className}
                {className in tcState.cols.classification.keyMap && (
                  <span>
                    {' ('}
                    <b>{tcState.cols.classification.keyMap[className].toUpperCase()}</b>
                    {')'}
                  </span>
                )}
              </Typography>
            }
          />
        ))}
      </Box>
    </>
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
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Show classification column"
          checked={cls.enabled}
          onChange={(e) => tcDispatch({
            type: ContextActions.CLASSIFICATION_CONFIG,
            payload: { enabled: e.target.checked }
          })}
        />
        <Help title="Enable Classifications">
          Select this option if you want to classify the table,
          unsect to hide the classification column
        </Help>
      </Stack>

      <CategoricalControl />

      <Box sx={{display: 'flex', pt: 2}}>
        <Alert severity="info">
          <b>Tip:</b> click in the class name to set a hotkey for faster classification
        </Alert>
      </Box>

    </>
  )
}