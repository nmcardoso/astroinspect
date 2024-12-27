import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FileInputColumns from '@/components/setup/FileInputColumns'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { ContextActions } from '@/interfaces/contextActions'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { useCallback } from 'react'
import TableHelper from '@/lib/TableHelper'
import { cloneDeep } from 'lodash'


type ColumnCheckboxProps = {
  label: string
  actionType: ContextActions
  enabled: boolean
}

function ColumnCheckbox({ label, actionType, enabled }: ColumnCheckboxProps) {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // const { colDef, initVal } = TableHelper.getColDefs(tcState)
    // tcDispatch({
    //   type: ContextActions.GRID_UPDATE,
    //   payload: {
    //     data: tcState.grid.data?.map((d: any) => ({ ...d, ...initVal })),
    //     // currColConfigs: cloneDeep(tcState.cols),
    //     // currTable: { ...tcState.table },
    //     colDef: colDef,
    //   }
    // })

    tcDispatch({
      type: actionType,
      payload: { enabled: checked }
    })
  }, [tcState, enabled, actionType])

  return (
    <FormControlLabel
      label={label}
      control={<Checkbox checked={enabled} onChange={handleChange} />} />
  )
}


function AstroInspectColumns() {
  const { tcState, tcDispatch } = useXTableConfig()
  const c = tcState.cols
  return (
    <Box>
      <ColumnCheckbox
        label="Classification"
        actionType={ContextActions.CLASSIFICATION_CONFIG}
        enabled={c.classification.enabled} />

      <ColumnCheckbox
        label="S-PLUS image"
        actionType={ContextActions.SPLUS_IMAGING}
        enabled={c.splusImaging.enabled as boolean} />

      <ColumnCheckbox
        label="Legacy image"
        actionType={ContextActions.LEGACY_IMAGING}
        enabled={c.legacyImaging.enabled} />

      <ColumnCheckbox
        label="Custom image"
        actionType={ContextActions.CUSTOM_IMAGE_ENABLE}
        enabled={c.customImaging.enabled} />

      <ColumnCheckbox
        label="SDSS spectra"
        actionType={ContextActions.SDSS_IMAGING}
        enabled={c.sdssSpectra.enabled} />

      <ColumnCheckbox
        label="S-PLUS photo-spectra"
        actionType={ContextActions.SPLUS_PHOTO_SPECTRA}
        enabled={c.splusPhotoSpectra.enabled} />

      <ColumnCheckbox
        label="SDSS catalog"
        actionType={ContextActions.SDSS_CATALOG}
        enabled={c.sdssCatalog.enabled} />
    </Box>
  )
}


export default function ColumnsTab() {
  return (
    <Box>
      <Typography component="div" variant="overline">
        Input table columns
      </Typography>
      <FileInputColumns />

      <Typography component="div" variant="overline" sx={{ mt: 2 }}>
        AstroInspect columns
      </Typography>
      <AstroInspectColumns />
    </Box>
  )
}