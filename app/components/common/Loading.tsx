import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'

export default function Loading() {
  return (
    <Stack direction="row" sx={{alignItems: 'center'}}>
      <CircularProgress />
      <span className="text-secondary ms-2">Loading...</span>
    </Stack>
  )
}