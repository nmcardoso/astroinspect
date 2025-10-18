import { useXTableConfig } from "@/contexts/XTableConfigContext";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SettingsIcon from '@mui/icons-material/Settings'
import Button from '@mui/material/Button'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { SyntheticEvent, useEffect, useState } from "react";
import { HIPS_REGISTRY } from "@/services/hips";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ContextActions } from "@/interfaces/contextActions";
import Help from "../common/Help";
import InputAdornment from "@mui/material/InputAdornment";

const strechFunctions = [
  'linear', 'asinh', 'power', 'sqrt', 'log',
]

const colormaps = [
  'viridis', 'plasma', 'inferno', 'magma', 'cividis',
  'Greys', 'Purples', 'Blues', 'Greens', 'Oranges', 'Reds',
  'YlOrBr', 'YlOrRd', 'OrRd', 'PuRd', 'RdPu', 'BuPu',
  'GnBu', 'PuBu', 'YlGnBu', 'PuBuGn', 'BuGn', 'YlGn',
  'binary', 'gist_yarg', 'gist_gray', 'gray', 'bone', 'pink',
  'spring', 'summer', 'autumn', 'winter', 'cool', 'Wistia',
  'hot', 'afmhot', 'gist_heat', 'copper',
  'PiYG', 'PRGn', 'BrBG', 'PuOr', 'RdGy', 'RdBu',
  'RdYlBu', 'RdYlGn', 'Spectral', 'coolwarm', 'bwr', 'seismic',
  'twilight', 'twilight_shifted', 'hsv',
  'Pastel1', 'Pastel2', 'Paired', 'Accent',
  'Dark2', 'Set1', 'Set2', 'Set3',
  'tab10', 'tab20', 'tab20b', 'tab20c',
  'flag', 'prism', 'ocean', 'gist_earth', 'terrain', 'gist_stern',
  'gnuplot', 'gnuplot2', 'CMRmap', 'cubehelix', 'brg',
  'gist_rainbow', 'rainbow', 'jet', 'nipy_spectral', 'gist_ncar',
]


function SettingsPanel({survey}: {survey?: any}) {
  const { tcState, tcDispatch } = useXTableConfig()
  const conf = tcState.cols.hipsImaging
  const defaults = conf.surveySettings?.[survey.id] ?? conf.defaultSettings
  const [minCut, setMinCut] = useState(defaults.minPixelCut)
  const [maxCut, setMaxCut] = useState(defaults.maxPixelCut)
  const [colormap, setColormap] = useState(defaults.colormap)
  const [stretch, setStretch] = useState(defaults.stretch)
  const [invertColors, setInvertColor] = useState(defaults.invert)
  const [fov, setFov] = useState<string>(String(defaults.fov))
  const [autoFov, setAutoFov] = useState(defaults.autofov)

  useEffect(() => {
    const defaults = conf.surveySettings?.[survey.id] ?? conf.defaultSettings
    setMinCut(defaults.minPixelCut)
    setMaxCut(defaults.maxPixelCut)
    setColormap(defaults.colormap)
    setStretch(defaults.stretch)
    setInvertColor(defaults.invert)
    setFov(String(defaults.fov))
    setAutoFov(defaults.autofov)
  }, [conf, survey])

  const handleColormapChange = (event: SyntheticEvent<Element, Event>, newValue: string | null) => {
    if (newValue) {
      setColormap(newValue)
    } else {
      setColormap(defaults.colormap)
    }
  }

  const handleCommitChanges = () => {
    tcDispatch({
      type: ContextActions.HIPS_IMAGING_SETTINGS,
      payload: {
        id: survey.id,
        settings: {
          minPixelCut: minCut,
          maxPixelCut: maxCut,
          colormap: colormap,
          stretch: stretch,
          invert: invertColors,
          fov: parseFloat(fov),
          autofov: autoFov,
        }
      }
    })
  }

  const active = (
    minCut != defaults.minPixelCut || maxCut != defaults.maxPixelCut ||
    colormap != defaults.colormap || stretch != defaults.stretch ||
    invertColors != defaults.invert || fov != String(defaults.fov) || 
    autoFov != defaults.autofov
  )

  return (
    <Box>
      <Typography variant="button">
        {survey.desc} Settings
      </Typography>

      <Stack direction="row" spacing={2} sx={{pt: 2}}>
        <TextField
          label="min pixel cut"
          id="min-pixel-cut"
          sx={{ width: '21ch' }}
          value={minCut}
          onChange={e => setMinCut(e.target.value)} />

        <TextField
          label="max pixel cut"
          id="max-pixel-cut"
          sx={{ width: '21ch' }}
          value={maxCut}
          onChange={e => setMaxCut(e.target.value)} />
      </Stack>

      <Autocomplete
          fullWidth
          options={colormaps}
          sx={{pt: 3}}
          value={colormap}
          onChange={handleColormapChange}
          renderInput={(params) => <TextField {...params} label="colormap" />}
        />

      <Stack direction="row" spacing={2} sx={{pt: 3}}>
        <FormControl sx={{width: 240}}>
          <InputLabel id="pixel-stretch-function-label">stretch function</InputLabel>
          <Select
            labelId="pixel-stretch-function-label"
            id="pixel-stretch-function"
            label="strech function"
            value={stretch}
            onChange={e => setStretch(e.target.value)}
          >
            {
              strechFunctions.map(f => <MenuItem value={f} key={f}>{f}</MenuItem>)
            }
          </Select>
        </FormControl>

        <FormControlLabel
        label="Invert colors"
        control={
          <Checkbox
            checked={invertColors}
            onChange={e => setInvertColor(e.target.checked)}/>
        } />
      </Stack>

      <Stack direction="row" spacing={2} sx={{pt: 3}}>
        <TextField
          label="field of view"
          id="fov"
          sx={{ width: 240 }}
          value={fov}
          onChange={e => setFov(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="start">arcmin</InputAdornment>,
            },
          }} />

          <FormControlLabel
            label="Auto FOV"
            control={
              <Checkbox
                checked={autoFov}
                onChange={e => setAutoFov(e.target.checked)}/>
            } />
      </Stack>

      <Stack direction="row-reverse" sx={{mt: 4}}>
        <Button variant="contained" color="primary" disabled={!active} onClick={handleCommitChanges}>
          Apply
        </Button>
      </Stack>
      
    </Box>
  )
}


export default function HipsImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const [selectedSurvey, setSelectedSurvey] = useState<any>(undefined)
  const checked = tcState.cols.hipsImaging.selectedSurveys

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    tcDispatch({
      type: ContextActions.HIPS_IMAGING,
      payload: {
        selectedSurveys: newChecked
      }
    })
  };

  return (
    <>
    <Stack direction="row" sx={{ alignItems: 'center' }}>
        <FormControlLabel
        label="Show HiPS stamps columns"
        control={
          <Checkbox
            checked={tcState.cols.hipsImaging.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.HIPS_IMAGING,
              payload: { enabled: e.target.checked }
            })} />
        } />
        <Help title="Enable HiPS stamps">
          Select this option to show HiPS stamps for selected surveys
        </Help>
      </Stack>

    <Stack direction="row" spacing={4}>
      <Box sx={{ width: 340, height: 400, overflow: 'auto'}}>
        <List sx={{height: 100}}>
            {HIPS_REGISTRY.map((value) => {
              const labelId = `checkbox-list-label-${value.id}`;

              return (
                <ListItem
                  key={value.id}
                  secondaryAction={
                    <IconButton edge="end" color={value === selectedSurvey ? 'primary' : 'default'} onClick={() => setSelectedSurvey(value)}>
                      <SettingsIcon />
                    </IconButton>
                  }
                  disablePadding
                  dense
                >
                  <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.includes(value.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.desc} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
      </Box>
      
          <Box>
            {selectedSurvey && <SettingsPanel survey={selectedSurvey} />}
          </Box>
    </Stack>
    </>
  )
}