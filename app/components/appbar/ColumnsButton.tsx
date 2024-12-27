import AppbarButton from '@/components/appbar/AppbarButton'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ColumnsTab from '@/components/setup/ColumnsTab'

export default function ColumnsButton() {
  return (
    <AppbarButton
      icon={<ViewWeekIcon />}
      tooltip="Columns"
      modal={<ColumnsTab />}
      modalWidth={720}
      modalTitle="Display columns"
      modalIcon={<ViewWeekIcon />} />
  )
}