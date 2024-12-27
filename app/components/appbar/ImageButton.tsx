import AppbarButton from '@/components/appbar/AppbarButton'
import CustomImagingTab from '@/components/setup/CustomImagingTab'
import SplusImagingTab from '@/components/setup/SplusImagingTab'
import LegacyImagingTab from '@/components/setup/LegacyImagingTab'
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined'
import CollectionsIcon from '@mui/icons-material/Collections'


const menu: DropdownMenuItemProps[] = [
  {
    title: 'Legacy stamps',
    modal: <LegacyImagingTab />,
    left: <CollectionsIcon />,
    modalTitle: 'Legacy stamps',
    modalIcon: <CollectionsIcon />,
  },
  {
    title: 'S-PLUS stamps',
    modal: <SplusImagingTab />,
    left: <CollectionsIcon />,
    modalTitle: 'S-PLUS stamps',
    modalIcon: <CollectionsIcon />,
  },
  {
    title: 'Custom images',
    modal: <CustomImagingTab />,
    left: <CollectionsIcon />,
    modalTitle: 'Custom images',
    modalIcon: <CollectionsIcon />,
  },
]

export default function ImageButton() {
  return (
    <AppbarButton
      icon={<PhotoOutlinedIcon />}
      tooltip="Images"
      menu={menu}
      menuWidth={230}
      modalWidth={850} />
  )
}