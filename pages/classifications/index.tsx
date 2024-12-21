import ClassTab from '@/components/setup/ClassTab'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Index() {
  return (
    <Container>
      <Stack gap={4} sx={{ py: 2, mb: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Classes</Typography>
          <ClassTab />
        </Paper>
      </Stack>
    </Container>
  )
}