import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'


export default function SdssSpectraTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const sdss = tcState.cols.sdssSpectra

  return (
    <Stack>
      <FormControlLabel
        label="Show SDSS spectra column"
        control={
          <Checkbox
            checked={sdss.enabled}
            onChange={e => tcDispatch({
              type: ContextActions.SDSS_IMAGING,
              payload: { enabled: e.target.checked }
            })} />
        } />
    </Stack>
  )
}