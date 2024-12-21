import IconButton from '@mui/material/IconButton'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

export default function SwapButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton color="primary" sx={{ p: 1 }} onClick={onClick}>
      <SwapHorizIcon />
    </IconButton>
  )
}