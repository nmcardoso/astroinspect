import FileInputTab from '@/components/setup/FileInputTab'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Index() {
  return (
    <Container>
      <Stack gap={4} sx={{ py: 4, mb: 4 }}>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h6">Load table</Typography>
          <Typography sx={{mb: 2}}>
            Follow the steps bellow to load a table to analyse
          </Typography>
          <FileInputTab />
        </Paper>
      </Stack>
    </Container>
  )
}