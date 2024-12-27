import { SxProps } from '@mui/material'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'

type PaperModalProps = {
  children: React.ReactNode
  sx?: SxProps
  open: boolean
  onClose?: () => void
  elevation?: number
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  // bgcolor: 'background.paper',
  // boxShadow: 24,
}

export default function PaperModal({ children, sx, open, onClose, elevation = 24 }: PaperModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}>
      <Paper
        elevation={24}
        sx={{ ...modalStyle, ...(!!sx && sx) }}>
        {children}
      </Paper>
    </Modal>
  )
}