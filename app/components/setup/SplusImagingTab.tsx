import Chip from '@mui/material/Chip'
import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


const splusBands = [
  'U', 'F378', 'F395', 'F410', 'F430', 'G',
  'F515', 'R', 'F660', 'I', 'F861', 'Z'
]

function toggleUnique(data: { [key: string]: string[] }, key: string, value: string) {
  const d = { ...data }

  for (const k in data) {
    if (k != key) d[k] = data[k].filter(e => e != value)
    // if (d[k].length < 1) return data
  }

  if (d[key].includes(value)) {
    d[key] = d[key].filter(e => e != value)
  } else {
    d[key].push(value)
  }

  return d
}


function SplusFilterChip({ band, channel, color }:
  { band: string, channel: string, color: 'primary' | 'error' | 'info' | 'success' }) {
  const { tcState, tcDispatch } = useXTableConfig()
  const trilogyConfig = tcState.cols.splusImaging.trilogyConfig
  const { R, G, B } = trilogyConfig

  return (
    <Chip
      color={color}
      variant={trilogyConfig[channel].includes(band) ? "filled" : "outlined"}
      label={band}
      onClick={() => tcDispatch({
        type: ContextActions.SPLUS_TRILOGY_CONFIG,
        payload: toggleUnique({ R, G, B }, channel, band)
      })} />
  )
}


function TrilogyParams() {
  const { tcState, tcDispatch } = useXTableConfig()
  const trilogyConfig = tcState.cols.splusImaging.trilogyConfig

  return (
    <Stack spacing={2}>
      <Box>
      <Typography component="div" variant="overline">
        Color mapping
      </Typography>

        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <Typography width={110} textAlign="right" color="error" fontWeight="bold">Red channel</Typography>
          {splusBands.map(band => (
            <SplusFilterChip
              key={`R_${band}`}
              band={band}
              channel="R"
              color="error" />
          ))}

          <Help title="Red Composition">
            Choose the S-PLUS bands that will be mapped to the{' '}
            <span className="text-danger">red</span> channel of the{' '}
            RGB image. Each channel must be mapped by at least one S-PLUS filter
          </Help>
        </Stack>


        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <Typography width={110} textAlign="right" color="success" fontWeight="bold">Green channel</Typography>
          {splusBands.map(band => (
            <SplusFilterChip
              key={`G_${band}`}
              band={band}
              channel="G"
              color="success" />
          ))}
          <Help title="Green Composition">
            Choose the S-PLUS bands that will be mapped to the{' '}
            <span className="text-success">green</span> channel of the{' '}
            RGB image. Each channel must be mapped by at least one S-PLUS filter
          </Help>
        </Stack>


        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <Typography width={110} textAlign="right" color="primary" fontWeight="bold">Blue channel</Typography>
          {splusBands.map(band => (
            <SplusFilterChip
              key={`B_${band}`}
              band={band}
              channel="B"
              color="primary" />
          ))}
          <Help title="Blue Composition">
            Choose the S-PLUS bands that will be mapped to the{' '}
            <span className="text-primary">blue</span> channel of the{' '}
            RGB image. Each channel must be mapped by at least one S-PLUS filter
          </Help>
        </Stack>
      </Box>

      <Typography component="div" variant="overline">
        Algorithm parameters
      </Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          label="Noise"
          id="trilogy-Noise"
          sx={{ width: '28ch' }}
          value={trilogyConfig.noise}
          onChange={(e) => tcDispatch({
            type: ContextActions.SPLUS_TRILOGY_CONFIG,
            payload: { noise: e.target.value }
          })} />

        <TextField
          label="Q"
          id="trilogy-Q"
          sx={{ width: '28ch' }}
          value={trilogyConfig.Q}
          onChange={(e) => tcDispatch({
            type: ContextActions.SPLUS_TRILOGY_CONFIG,
            payload: { Q: e.target.value }
          })} />
      </Stack>
    </Stack>
  )
}


function LuptonParams() {
  const { tcState, tcDispatch } = useXTableConfig()
  const luptonConfig = tcState.cols.splusImaging.luptonConfig

  return (
    <Stack spacing={2}>
      <Typography component="div" variant="overline">
        Color mapping
      </Typography>

      <Grid container spacing={3}>
        <Grid size={4}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <FormControl fullWidth>
              <InputLabel id="lupton-R-label">Red channel</InputLabel>
              <Select
                labelId="lupton-R-label"
                id="lupton-R"
                value={luptonConfig.R}
                label="Red channel"
                onChange={e => tcDispatch({
                  type: ContextActions.SPLUS_LUPTON_CONFIG,
                  payload: { R: e.target.value }
                })}>
                {splusBands.map(band => (
                  <MenuItem value={band} key={`R-${band}`}>{band}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Help title="Red channel">
              The S-PLUS filter that will be mapped to red channel of the RGB stamp
            </Help>
          </Stack>
        </Grid>

        <Grid size={4}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <FormControl fullWidth>
              <InputLabel id="lupton-G-label">Green channel</InputLabel>
              <Select
                labelId="lupton-G-label"
                id="lupton-G"
                value={luptonConfig.G}
                label="Green channel"
                onChange={e => tcDispatch({
                  type: ContextActions.SPLUS_LUPTON_CONFIG,
                  payload: { G: e.target.value }
                })}>
                {splusBands.map(band => (
                  <MenuItem value={band} key={`G-${band}`}>{band}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Help title="Green channel">
              The S-PLUS filter that will be mapped to green channel of the RGB stamp
            </Help>
          </Stack>
        </Grid>

        <Grid size={4}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <FormControl fullWidth>
              <InputLabel id="lupton-B-label">Blue channel</InputLabel>
              <Select
                labelId="lupton-B-label"
                id="lupton-B"
                value={luptonConfig.B}
                label="Blue channel"
                onChange={e => tcDispatch({
                  type: ContextActions.SPLUS_LUPTON_CONFIG,
                  payload: { B: e.target.value }
                })}>
                {splusBands.map(band => (
                  <MenuItem value={band} key={`B-${band}`}>{band}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Help title="Blue channel">
              The S-PLUS filter that will be mapped to blue channel of the RGB stamp
            </Help>
          </Stack>
        </Grid>
      </Grid>

      <Typography component="div" variant="overline">
        Algorithm parameters
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Stretch"
          id="lupton-stretch"
          sx={{ width: '28ch' }}
          value={luptonConfig.stretch}
          onChange={(e) => tcDispatch({
            type: ContextActions.SPLUS_LUPTON_CONFIG,
            payload: { stretch: e.target.value }
          })} />

        <TextField
          label="Q"
          id="lupton-Q"
          sx={{ width: '28ch' }}
          value={luptonConfig.Q}
          onChange={(e) => tcDispatch({
            type: ContextActions.SPLUS_LUPTON_CONFIG,
            payload: { Q: e.target.value }
          })} />
      </Stack>
    </Stack>
  )
}


export default function SplusImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const splusImaging = tcState.cols.splusImaging

  return (
    <Stack spacing={2}>
      <FormControlLabel
        label="Show S-PLUS RGB images column"
        control={
          <Checkbox
            checked={splusImaging.enabled}
            onChange={(e) => tcDispatch({
              type: ContextActions.SPLUS_IMAGING,
              payload: { enabled: e.target.checked }
            })} />
        } />

      <Stack direction="row" spacing={2}>
        <Stack direction="row" sx={{ alignItems: 'center', flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Coloring algorithm</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={splusImaging.type}
              label="Coloring algorithm"
              onChange={(e) => tcDispatch({
                type: ContextActions.SPLUS_IMAGING,
                payload: { type: e.target.value }
              })}>
              <MenuItem value="trilogy">Trilogy</MenuItem>
              <MenuItem value="lupton">Lupton</MenuItem>
            </Select>
          </FormControl>
          <Help title="Image Type">
            The algorithm used to make RGB stamps from the FITS file<br />
            <b>Trilogy: </b> The Trilogy algorithm<br />
            <b>Lupton: </b> The Lupton method
          </Help>
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            label="Pixel scale"
            id="lupton-pixelscale"
            sx={{ width: '28ch' }}
            value={tcState.cols.splusImaging.pixelScale}
            onChange={(e) => tcDispatch({
              type: ContextActions.SPLUS_IMAGING,
              payload: { pixelScale: e.target.value }
            })}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="start">arcsec/pixel</InputAdornment>,
              },
            }} />
          <Help title="Pixel scale">
            The pixel scale of the S-PLUS stamp
          </Help>
        </Stack>
      </Stack>

      <Box>
        {splusImaging.type == 'trilogy' ? <TrilogyParams /> : <LuptonParams />}
      </Box>
    </Stack>
  )
}