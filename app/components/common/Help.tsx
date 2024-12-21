import { ReactElement, useRef, useState } from 'react'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Box from '@mui/material/Box'

type PropsType = {
  children: any,
  title?: string | null,
  className?: string
}

export default function Help({
  children,
  title = null,
  className = ''
}: PropsType) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  };

  return (
    <Box>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <IconButton onClick={handleClick} onMouseEnter={handleClick} onMouseLeave={() => setOpen(false)}>
          <HelpOutlineIcon color="primary" />
        </IconButton>
      </ClickAwayListener>

      <Popper
        id="help-popup"
        open={open}
        anchorEl={anchorEl}
        transition
        placement="right-start"
        disablePortal={true}
        sx={{ zIndex: 1200 }}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: false,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={300}>
            <Paper sx={{ maxWidth: 280 }}>
              <Typography variant="subtitle2" sx={{ px: 1, pt: 1 }}>
                {title}
              </Typography>
              <Typography sx={{ p: 1 }} component="div">
                {children}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}