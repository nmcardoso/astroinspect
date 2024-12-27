import AppbarButton from '@/components/appbar/AppbarButton'
import ChecklistIcon from '@mui/icons-material/Checklist'
import ClassTab from '@/components/setup/ClassTab'

export default function ClassificationButton() {
  return (
    <AppbarButton
      icon={<ChecklistIcon />}
      tooltip="Classification"
      modal={<ClassTab />}
      modalWidth={720}
      modalTitle="Classification"
      modalIcon={<ChecklistIcon />} />
  )
}