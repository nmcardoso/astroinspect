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
import Autocomplete from '@mui/material/Autocomplete'
import { useCallback, useRef } from 'react'
import { queuedState } from '@/lib/states'
import { Typography } from '@mui/material'
import AddLinkIcon from '@mui/icons-material/AddLink'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FolderIcon from '@mui/icons-material/Folder'
import LinkIcon from '@mui/icons-material/Link'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'


const invalidateLoadedCells = (tcState: IState, index: number) => {
  if (tcState.grid.api && !tcState.grid.api.isDestroyed()) {
    const itemsToUpdate: any[] = []
    tcState.grid.api!.forEachNode((rowNode: any, i: any) => {
      const data = rowNode.data
      data[`img:custom_${index}`] = queuedState
      itemsToUpdate.push(data);
    })
    tcState.grid.api!.applyTransaction({ update: itemsToUpdate })!
  }
}



const RemoveButton = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()

  return (
    <Button
      color="error"
      variant="outlined"
      startIcon={<DeleteIcon />}
      onClick={() => {
        tcDispatch({
          type: ContextActions.CUSTOM_IMAGE_REMOVE,
          payload: { index, prevColumns: tcState.cols.customImaging.columns }
        })
        invalidateLoadedCells(tcState, index)
      }}>
      Remove
    </Button>
  )
}



const ViewButton = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const visible = tcState.cols.customImaging.columns?.[index]?.visible

  return (
    <Button
      color="primary"
      variant="outlined"
      startIcon={visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      onClick={() => {
        tcDispatch({
          type: ContextActions.CUSTOM_IMAGE_UPDATE,
          payload: { index, visible: !visible }
        })
      }}>
      {visible ? 'Hide' : 'Show'}
    </Button>
  )
}



const CustomImagingUrlSetup = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging.columns?.[index]

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            label="Base URL"
            id={`custom-base-url-${index}`}
            value={custom.prepend}
            onChange={e => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, prepend: e.target.value }
              })
              invalidateLoadedCells(tcState, index)
            }} />
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
            size="small"
            label="Suffix"
            id={`custom-suffix-${index}`}
            sx={{ width: '28ch' }}
            value={custom.append}
            onChange={e => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, append: e.target.value }
              })
              invalidateLoadedCells(tcState, index)
            }} />
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
          <Autocomplete
            size="small"
            disablePortal={false}
            sx={{ flexGrow: 1 }}
            getOptionKey={e => e}
            getOptionLabel={e => e}
            options={tcState.table.columns}
            value={tcState.table.columns?.[custom?.columnIndex] || undefined}
            renderInput={(params) => <TextField {...params} label="Column" />}
            onChange={(e, newValue) => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, columnIndex: tcState.table.columns.findIndex(v => v == newValue) }
              })
              invalidateLoadedCells(tcState, index)
            }
            }
          />
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
        <Stack direction="row" spacing={2}>
          <ViewButton index={index} />
          <RemoveButton index={index} />
        </Stack>
      </Grid>
    </Grid>
  )
}





const CustomImagingFolderSetup = ({ index }: { index: number }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging.columns?.[index]
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Button
            size="small"
            variant="contained"
            sx={{ mr: 2 }}
            startIcon={<DriveFolderUploadIcon />}
            onClick={() => inputRef.current?.click()}>
            Upload
          </Button>

          {
            custom.folder && custom.folder.length > 0 ? (
              <Typography sx={{ textWrap: 'nowrap' }}>
                {custom.folder.length} selected files
              </Typography>
            ) : (
              <Typography sx={{ textWrap: 'nowrap' }}>
                No selected files
              </Typography>
            )
          }
          <input
            hidden
            ref={inputRef}
            type="file"
            webkitdirectory=""
            mozdirectory=""
            directory=""
            style={{ display: 'none' }}
            onChange={(e) => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, folder: e.target.files }
              })
              invalidateLoadedCells(tcState, index)
            }} />
          <Help title="Images folder">
            Select a folder from your computer that contains the images to be loaded by AstroInspect
          </Help>



          <TextField
            size="small"
            label="Prefix"
            id={`custom-prefix-folder-${index}`}
            sx={{ width: '22ch', ml: 2 }}
            value={custom.prepend}
            onChange={e => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, prepend: e.target.value }
              })
              invalidateLoadedCells(tcState, index)
            }} />
          <Help title="Filename prefix">
            (Optional) Choose the filename prefix. The value typed here will be inserted at 
            the beggining of the expression that generates the filename for each row
          </Help>

          <Box sx={{ ml: 2 }}>
            {
              custom.columnIndex >= 0 && !!tcState.table.columns?.[custom.columnIndex] && !!tcState.grid.data?.[0] && (
                <Typography variant="body1">
                  E.g.: {custom.prepend}{tcState.grid.data[0][`tab:${tcState.table.columns[custom.columnIndex]}`]}{custom.append}
                </Typography>
              )
            }
          </Box>
        </Stack>
      </Grid>

      <Grid size={4}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Autocomplete
            size="small"
            disablePortal={false}
            sx={{ flexGrow: 1 }}
            getOptionKey={e => e}
            getOptionLabel={e => e}
            options={tcState.table.columns}
            value={tcState.table.columns?.[custom?.columnIndex] || undefined}
            renderInput={(params) => <TextField {...params} label="Column" />}
            onChange={(e, newValue) => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, columnIndex: tcState.table.columns.findIndex(v => v == newValue) }
              })
              invalidateLoadedCells(tcState, index)
            }
            }
          />
          <Help title="Resource Identification Column">
            The <b>resource identification column</b> (RI column) is the {" "}
            only variable part of the filename. This field must specify the {" "}
            column to use to make a specific filename for each row.<br />
            The final filename for each row is:<br />
            <kbd>Prefix</kbd> + <kbd>RI Column</kbd> + <kbd>Suffix</kbd>
          </Help>
        </Stack>
      </Grid>

      <Grid size={4}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            size="small"
            label="Suffix"
            id={`custom-suffix-folder-${index}`}
            sx={{ width: '28ch' }}
            value={custom.append}
            onChange={e => {
              tcDispatch({
                type: ContextActions.CUSTOM_IMAGE_UPDATE,
                payload: { index, append: e.target.value }
              })
              invalidateLoadedCells(tcState, index)
            }} />
          <Help title="Filename suffix">
            (Optional) Choose the filename suffix. The value typed here will be inserted at 
            the end of the expression that generates the filename for each row.
          </Help>
        </Stack>
      </Grid>
      <Grid size={4}>
        <Stack direction="row" spacing={2}>
          <ViewButton index={index} />
          <RemoveButton index={index} />
        </Stack>
      </Grid>
    </Grid>
  )
}




export default function CustomImagingTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const custom = tcState.cols.customImaging

  return (
    <Stack spacing={1}>
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

      {custom.columns.map((col, i) => (
        <Box key={i}>
          <Box sx={{ pb: 2 }}>
            {
              col.type == 'url' ? (
                <>
                  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.8}>
                    <LinkIcon fontSize='small' />
                    <Typography variant="overline">Custom url column {i + 1}</Typography>
                  </Stack>
                  <CustomImagingUrlSetup index={i} />
                </>
              ) : (
                <>
                  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.8}>
                    <FolderIcon fontSize='small' />
                    <Typography variant="overline">Custom folder column {i + 1}</Typography>
                  </Stack>
                  <CustomImagingFolderSetup index={i} />
                </>
              )
            }
          </Box>
          <Divider flexItem sx={{ bgcolor: 'secondary' }} />
        </Box>
      ))}

      <Box>
        <Button
          sx={{ mr: 2 }}
          startIcon={<CreateNewFolderIcon />}
          onClick={() => tcDispatch({
            type: ContextActions.CUSTOM_IMAGE_NEW,
            payload: { prevColumns: tcState.cols.customImaging.columns, type: 'folder' }
          })}>
          Add folder column
        </Button>

        <Button
          startIcon={<AddLinkIcon />}
          onClick={() => tcDispatch({
            type: ContextActions.CUSTOM_IMAGE_NEW,
            payload: { prevColumns: tcState.cols.customImaging.columns, type: 'url' }
          })}>
          Add URL column
        </Button>
      </Box>
    </Stack>
  )
}