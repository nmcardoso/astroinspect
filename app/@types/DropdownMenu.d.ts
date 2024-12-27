type DropdownMenuProps = {
  open: boolean
  onClose: () => void
  anchorEl?: Element | null
  items: DropdownMenuItemProps[]
  menuWidth?: number
  modalWidth?: number
}

type DropdownMenuItemProps = {
  title?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  onClick?: () => void
  modal?: React.ReactNode
  modalTitle?: React.ReactNode
  modalIcon?: React.ReactNode
  divider?: boolean
}