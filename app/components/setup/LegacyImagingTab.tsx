import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Help from '@/components/common/Help'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

export default function LegacyImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const legacy = tcState.cols.legacyImaging

  return (
    <Stack spacing={2}>
      <FormControlLabel
        label="Show Legacy Survey RGB images column"
        control={
          <Checkbox
            checked={legacy.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.LEGACY_IMAGING,
              payload: { enabled: e.target.checked }
            })} />
        } />

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>

        <Box minWidth={300}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="legacy-dr-label">Data Release</InputLabel>
            <Select
              labelId="legacy-dr-label"
              id="legacy-dr"
              value={legacy.dataRelease}
              label="Data Release"
              onChange={e => tcDispatch({
                type: ContextActions.LEGACY_IMAGING,
                payload: { dataRelease: e.target.value }
              })}>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="9">9</MenuItem>
            </Select>
          </FormControl>
          <Help title="Data release" className="ms-1">
            The Legacy Survey data release version
          </Help>
        </Stack>
        </Box>


        <TextField
          label="Pixel scale"
          id="legacy-pixelscale"
          sx={{ width: '28ch' }}
          value={legacy.pixelScale}
          onChange={e => tcDispatch({
            type: ContextActions.LEGACY_IMAGING,
            payload: { pixelScale: e.target.value }
          })}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="start">arcsec/pixel</InputAdornment>,
            },
          }} />


        <FormControlLabel
          label="Auto pixel scale"
          control={
            <Checkbox
              checked={legacy.autoPixelScale}
              onChange={e => tcDispatch({
                type: ContextActions.LEGACY_IMAGING,
                payload: { autoPixelScale: e.target.checked }
              })} />
          } />

        <Help title="Auto pixel scale">
          <ul>
            <li>
              When <i>auto pixscale</i> is <b>enabled</b>, AstroInspect will
              compute the pixscale for each object based on
              the <code>mag_r</code> and <code>shape_r</code> values from the
              Legacy Survey catalogue. The specified value of pixscale will
              be used in cases where catalog values are not available.
            </li>
            <li>
              When <i>auto pixscale</i> is <b>disbled</b>, AstroInspect will
              suse the specified value of the pixscale.
            </li>
          </ul>
        </Help>
      </Stack>
    </Stack>
  )
}