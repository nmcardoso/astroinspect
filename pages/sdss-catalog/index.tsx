import SdssCatalogTab from '@/components/setup/SdssCatalogTab'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

export default function Index() {
  return (
    <Container>
      <Stack gap={4} sx={{ py: 2, mb: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>SDSS Catalogue</Typography>
          <SdssCatalogTab />
        </Paper>
      </Stack>
    </Container>
  )
}