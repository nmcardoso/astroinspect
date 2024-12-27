import ExampleTab from '@/components/setup/ExampleTab'
import FileInputTab from '@/components/setup/FileInputTab'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import UploadFileIcon from '@mui/icons-material/UploadFile'

export default function Index() {
  const router = useRouter()
  useEffect(() => router.prefetch('/table'), [router])

  return (
    <Container>
      <Stack gap={4} sx={{ py: 4, mb: 4 }}>
        <Paper elevation={4} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <UploadFileIcon />
            <Typography variant="h6">Load table</Typography>
          </Stack>
          <Typography sx={{ mb: 2 }}>
            Follow the steps bellow to load a table to analyse
          </Typography>
          <FileInputTab />
        </Paper>

        <Paper elevation={4} sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <LightbulbIcon />
            <Typography variant="h6">Examples</Typography>
          </Stack>
          <ExampleTab />
        </Paper>
      </Stack>
    </Container>
  )
}