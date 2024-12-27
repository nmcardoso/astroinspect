import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import React, { useRef, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import DropdownMenu from '@/components/common/DropdownMenu'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  // bgcolor: 'background.paper',
  // boxShadow: 24,
}


export default function AppbarButton({
  icon,
  onClick,
  tooltip,
  modal,
  menu,
  menuWidth = 250,
  modalWidth = 760,
  modalTitle,
  modalIcon,
  toggle,
  active,
  color = 'inherit',
  disabled = false,
}: AppbarButtonProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!!onClick) {
      onClick(e)
    } else if (!!modal) {
      setOpen(true)
    } else if (!!menu) {
      setOpen(true)
    }
  }

  return (
    <>
      <Tooltip title={tooltip} arrow>
        {
          (toggle && active) ? (
            <ToggleButton
              value=""
              color="primary"
              selected={true}
              onChange={onClick as any}
              sx={{ py: 1, px: 1.25, mx: 0.3, border: 'none' }}>
              {icon}
            </ToggleButton>
          ) : (
            <Button
              disabled={disabled}
              ref={buttonRef}
              size="large"
              color={color}
              variant="text"
              sx={{ mx: 0.3, minWidth: 0, py: 1, px: 1.25 }}
              onClick={handleClick}>
              {icon}
            </Button>
          )
        }
      </Tooltip>
      {!!modal && (
        // <Modal
        //   keepMounted
        //   open={open}
        //   onClose={() => setOpen(false)}>
        //   <Paper elevation={24} sx={{ ...modalStyle, width: modalWidth }}>
        //     {modal}
        //   </Paper>
        // </Modal>
        <Dialog
          onClose={() => setOpen(false)}
          open={open}
          maxWidth={false}>
          {!!modalTitle && (
            <>
              <DialogTitle sx={{ m: 0, pt: 2, pb: 0, pl: 2, pr: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  {modalIcon}
                  <span>{modalTitle}</span>
                </Stack>
              </DialogTitle>
              <IconButton
                onClick={() => setOpen(false)}
                sx={(theme) => ({
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: theme.palette.grey[500],
                })}>
                <CloseIcon />
              </IconButton>
            </>
          )}
          <DialogContent sx={{ width: modalWidth }}>
            {modal}
          </DialogContent>
        </Dialog>

      )}
      {!!menu && (
        <DropdownMenu
          open={open}
          onClose={() => setOpen(false)}
          anchorEl={buttonRef.current}
          items={menu}
          modalWidth={modalWidth}
          menuWidth={menuWidth} />
      )}
    </>
  )
}