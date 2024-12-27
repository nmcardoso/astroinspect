import SdssCatalogTab from '@/components/setup/SdssCatalogTab'
import AppbarButton from '@/components/appbar/AppbarButton'
import FilterDramaIcon from '@mui/icons-material/FilterDrama'

export default function SdssCatalogButton() {
  return (
    <AppbarButton
      icon={<FilterDramaIcon />}
      tooltip="SDSS catalog"
      modal={<SdssCatalogTab />}
      modalWidth={720}
      modalTitle="SDSS catalog"
      modalIcon={<FilterDramaIcon />} />
  )
}