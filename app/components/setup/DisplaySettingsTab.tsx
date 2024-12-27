import { ContextActions } from "@/interfaces/contextActions"
import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Help from "../common/Help"
import { useXTableConfig } from "@/contexts/XTableConfigContext"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"
import { FormEventHandler, useCallback } from "react"


function CellFigureHeightControler() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    tcDispatch({
      type: ContextActions.UI_SETUP,
      payload: { figureSize: e.target.figSize.value }
    })
  }, [])

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <TextField
          label="Cell figure height"
          id="figSize"
          sx={{ width: '28ch' }}
          defaultValue={tcState.ui.figureSize}
          name="figSize"
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="start">pixels</InputAdornment>,
            },
          }} />
        <Button variant="contained" type="submit">
          Apply
        </Button>
        <Help title="Figure height">
          Adjust the height of the displayed figure in each cell of the table
        </Help>
      </Stack>
    </Box>
  )
}


function InvertColorDarkModeControler() {
  const { tcState, tcDispatch } = useXTableConfig()

  return (
    <FormControlLabel
      label="Invert figure color in dark mode"
      control={
        <Checkbox
          checked={tcState.ui.invertColorDarkMode}
          onChange={(e) => tcDispatch({
            type: ContextActions.UI_SETUP,
            payload: { invertColorDarkMode: e.target.checked }
          })} />
      } />
  )
}


export default function DisplaySettingsTab() {
  return (
    <Stack direction="column" spacing={5}>
      <CellFigureHeightControler />
      <InvertColorDarkModeControler />
    </Stack>
  )
}