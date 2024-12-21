import { useXTableConfig } from '@/contexts/XTableConfigContext'
import Button from '@mui/material/Button'
import Help from '@/components/common/Help'
import { ContextActions } from '@/interfaces/contextActions'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

const CustomImagingColumnGroup = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging.columns[index]

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Base URL"
            id={`custom-base-url-${index}`}
            value={custom.url}
            onChange={e => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_UPDATE,
              payload: { index, url: e.target.value }
            })} />
          <Help title="Base Resource URL">
            The <b>base resource url</b> is the first (static) part of the URL.
            This value must starts with <code>http://</code>{" "}
            or <code>https://</code><br />
            The final url for each row is:<br />
            <kbd>Base URL</kbd> + <kbd>RI column</kbd> + <kbd>suffix</kbd>
          </Help>
        </Stack>
      </Grid>

      <Grid size={4}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            label="Suffix"
            id={`custom-suffix-${index}`}
            sx={{ width: '28ch' }}
            value={custom.fileExtension}
            onChange={e => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_UPDATE,
              payload: { index, fileExtension: e.target.value }
            })} />
          <Help title="URL Suffix">
            The <b>url suffix</b> is the last (static) part of the URL and {" "}
            is used to specify the file extension, for example.<br />
            The final url for each row is:<br />
            <kbd>Base URL</kbd> + <kbd>RI column</kbd> + <kbd>suffix</kbd>
          </Help>
        </Stack>
      </Grid>

      <Grid size={8}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id={`custom-RI-${index}-label`}>RI column</InputLabel>
            <Select
              labelId={`custom-RI-${index}-label`}
              id={`custom-RI-${index}`}
              value={tcState.cols.customImaging.columns?.[index]?.columnIndex || -1}
              label="RI column"
              onChange={e => tcDispatch({
                type: ContextActions.SPLUS_LUPTON_CONFIG,
                payload: { R: e.target.value }
              })}>
              <MenuItem value={-1}>Select a column</MenuItem>
              {tcState.table.columns.map((colName, idx) => (
                <MenuItem value={idx} key={`custom-RI-${idx}-${index}`}>
                  {colName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Help title="Resource Identification Column">
            The <b>resource identification column</b> (RI column) is the {" "}
            only variable part of the url. This field must specify the {" "}
            column to use to make a specific url for each row.<br />
            The final url for each row is:<br />
            <kbd>Base URL</kbd> + <kbd>RI Column</kbd> + <kbd>suffix</kbd>
          </Help>
        </Stack>
      </Grid>
      <Grid size={4}>
        <Button
          color="error"
          variant="outlined"
          startIcon={<RemoveIcon />}
          onClick={() => tcDispatch({
            type: ContextActions.CUSTOM_IMAGE_REMOVE,
            payload: { index, prevColumns: tcState.cols.customImaging.columns }
          })}>
          Remove column
        </Button>
      </Grid>
    </Grid>
  )
}

export default function CustomImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging

  return (
    <Stack spacing={2}>
      <FormControlLabel
        label="Show custom images columns"
        control={
          <Checkbox
            checked={custom.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.CUSTOM_IMAGE_ENABLE,
              payload: { enabled: e.target.checked }
            })} />
        } />

      {custom.columns.map((_, i) => (
        <Stack spacing={3} key={i}>
          <Box><CustomImagingColumnGroup index={i} /></Box>
          <Divider variant="middle" flexItem sx={{ bgcolor: 'secondary' }} />
        </Stack>
      ))}

      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => tcDispatch({
            type: ContextActions.CUSTOM_IMAGE_NEW,
            payload: { prevColumns: tcState.cols.customImaging.columns }
          })}>
          Add custom image column
        </Button>
      </Box>
    </Stack>
  )
}