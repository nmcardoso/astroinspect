type AppbarButtonProps = {
  icon: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  tooltip?: React.ReactNode
  modal?: React.ReactElement
  menu?: DropdownMenuItemProps[]
  modalWidth?: number
  modalTitle?: React.ReactNode
  modalIcon?: React.ReactNode
  menuWidth?: number
  toggle?: boolean
  active?: boolean
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  disabled?: boolean
}