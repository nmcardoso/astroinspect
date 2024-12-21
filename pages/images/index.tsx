import SplusImagingTab from '@/components/setup/SplusImagingTab'
import LegacyImagingTab from '@/components/setup/LegacyImagingTab'
import CustomImagingTab from '@/components/setup/CustomImagingTab'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

export default function Index() {
  return (
    <Container>
      <Stack gap={4} sx={{py: 2, mb: 6}}>
        <Paper sx={{p:2}}>
          <Typography variant="h6" sx={{mb: 2}}>S-PLUS images settings</Typography>
          <SplusImagingTab />
        </Paper>

        <Paper  sx={{p:2}}>
        <Typography variant="h6" sx={{mb: 2}}>Legacy Survey images settings</Typography>
          <LegacyImagingTab />
        </Paper>

        <Paper  sx={{p:2}}>
        <Typography variant="h6" sx={{mb: 2}}>Custom images settings</Typography>
          <CustomImagingTab />
        </Paper>
      </Stack>
    </Container>
  )
}