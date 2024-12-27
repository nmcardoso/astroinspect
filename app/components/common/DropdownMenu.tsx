import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import MenuList from '@mui/material/MenuList'
import Popper from '@mui/material/Popper'
import Grow from '@mui/material/Grow'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  // bgcolor: 'background.paper',
  // boxShadow: 24,
}


export default function DropdownMenu({
  open,
  onClose,
  anchorEl,
  items,
  menuWidth = 250,
  modalWidth = 760,
}: DropdownMenuProps) {
  const [openItem, setOpenItem] = useState(-1)

  const handleClick = (i: number) => {
    if (!!items[i].onClick) {
      items[i]?.onClick()
      onClose()
    } else if (!!items[i].modal) {
      setOpenItem(i)
    }
  }

  const handleClose = (i: number) => {
    setOpenItem(-1)
    onClose()
  }

  const handleClickAway = () => {
    if (openItem < 0) {
      onClose()
    }
  }

  return (
    <Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 9 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'right top',
            }}>
            <Paper sx={{ width: menuWidth, maxWidth: '100%' }}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList>
                  {
                    items.map((item, i) => (
                      <Box key={i}>
                        {
                          item.divider ? (
                            <Divider />
                          ) : (
                            <MenuItem key={i} onClick={() => handleClick(i)}>
                              {
                                !!item.left && (<ListItemIcon>{item.left}</ListItemIcon>)
                              }
                              <ListItemText>{item.title}</ListItemText>
                              {
                                !!item.right && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}>
                                    {item.right}
                                  </Typography>
                                )
                              }
                            </MenuItem>
                          )
                        }
                      </Box>
                    ))
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {
        items.map((item, i) => (
          <Box key={i}>
            {
              item.modal && (
                // <Modal
                //   keepMounted
                //   open={openItem == i}
                //   onClose={() => handleClose(i)}>
                //   <Paper
                //     elevation={24}
                //     sx={{ ...modalStyle, width: modalWidth }}>
                //     {item.modal}
                //   </Paper>
                // </Modal>
                <Dialog
          onClose={() => handleClose(i)}
          open={openItem == i}
          maxWidth={false}>
          {!!item.modalTitle && (
            <>
              <DialogTitle sx={{ m: 0, pt: 2, pb: 0, pl: 2, pr: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  {item.modalIcon}
                  <span>{item.modalTitle}</span>
                </Stack>
              </DialogTitle>
              <IconButton
                onClick={() => handleClose(i)}
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
            {item.modal}
          </DialogContent>
        </Dialog>
              )
            }
          </Box>
        ))
      }
    </Box>
  )
}