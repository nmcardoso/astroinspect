
import SdssSpectraTab from '@/components/setup/SdssSpectraTab'
import SplusSpectraTab from '@/components/setup/SplusSpectraTab'
import AppbarButton from '@/components/appbar/AppbarButton'
import SsidChartIcon from '@mui/icons-material/SsidChart'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

const menu: DropdownMenuItemProps[] = [
  {
    title: 'SDSS Spectra',
    modal: <SdssSpectraTab />,
    left: <QueryStatsIcon />,
    modalTitle: 'SDSS Spectra',
    modalIcon: <QueryStatsIcon />,
  },
  {
    title: 'S-PLUS PhotoSpectra',
    modal: <SplusSpectraTab />,
    left: <QueryStatsIcon />,
    modalTitle: 'S-PLUS PhotoSpectra',
    modalIcon: <QueryStatsIcon />,
  },
]

export default function SedButton() {
  return (
    <AppbarButton
      icon={<SsidChartIcon />}
      tooltip="SEDs"
      menu={menu}
      menuWidth={230}
      modalWidth={720} />
  )
}