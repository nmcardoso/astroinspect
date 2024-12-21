import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Help from '@/components/common/Help'


const splusLines = ['iso', 'aper3', 'aper6', 'auto', 'petro', 'pstotal']

export default function SplusSpectraTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const selectedLines = tcState.cols.splusPhotoSpectra.selectedLines

  const handleLineToggle = (line: string, selectedLines: string[]) => {
    const checked = selectedLines.includes(line)
    if (checked) {
      tcDispatch({
        type: ContextActions.SPLUS_PHOTO_SPECTRA,
        payload: {
          selectedLines: selectedLines.filter(e => e != line)
        }
      })
    } else {
      tcDispatch({
        type: ContextActions.SPLUS_PHOTO_SPECTRA,
        payload: {
          selectedLines: [...selectedLines, line]
        }
      })
    }
  }

  return (
    <Stack spacing={1}>
      <FormControlLabel
        label="Show S-PLUS photo-spectra column"
        control={
          <Checkbox
            checked={tcState.cols.splusPhotoSpectra.enabled}
            onChange={() => tcDispatch({
              type: ContextActions.SPLUS_PHOTO_SPECTRA,
              payload: { enabled: !tcState.cols.splusPhotoSpectra.enabled }
            })} />
        } />

      <Stack direction="row" spacing={2} sx={{alignItems: 'center'}}>
        <Typography>Appertures</Typography>
        {splusLines.map(line => (
          <FormControlLabel
            key={line}
            label={line}
            control={
              <Checkbox
                checked={selectedLines.includes(line)}
                onChange={() => handleLineToggle(line, selectedLines)} />
            } />
        ))}
        <Help title="Appertures">
          Appertures that will apper as lines in the photo-spectra plot
        </Help>
      </Stack>
    </Stack>
  )
}