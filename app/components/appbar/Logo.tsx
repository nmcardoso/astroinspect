import { getBaseURL } from '@/lib/utils'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Logo() {
  const router = useRouter()

  return (
    <Box onClick={() => router.push('/')} className="cursor-pointer">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Image
          alt=""
          src={`${getBaseURL()}favicon_64.png`}
          width="30"
          height="30" />
        <Typography variant="h6" component="div">AstroInspect</Typography>
      </Stack>
    </Box>
  )
}