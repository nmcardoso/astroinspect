import { useXTableConfig } from "@/contexts/XTableConfigContext"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/navigation"
import UploadFileIcon from '@mui/icons-material/UploadFile'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DropdownMenu from "../common/DropdownMenu"
import { useMemo, useRef, useState } from 'react'

export default function FilenameText() {
  const { tcState } = useXTableConfig()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)

  const menu = useMemo(() => {
    return [
      {
        title: 'Load other table',
        onClick: () => router.push('/'),
        left: <UploadFileIcon />
      }
    ]
  }, [])

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Button variant="outlined" size="small" endIcon={<KeyboardArrowDownIcon />} ref={buttonRef} onClick={() => setOpen(v => !v)}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '310px',
            whiteSpace: 'nowrap',
          }} >
          {tcState.table.type == 'local' ? tcState.table?.file?.name : tcState.table.url?.substring(tcState.table.url?.lastIndexOf('/') + 1)}
        </Typography>
      </Button>

      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={buttonRef.current}
        items={menu}
        menuWidth={220} />

      {/* <Button
        variant="outlined"
        startIcon={<SwapHorizIcon />}
        onClick={() => router.push('/')}
        size="small" >
        Change
      </Button> */}
    </Stack>
  )
}