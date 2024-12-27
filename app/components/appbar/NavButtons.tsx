import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { usePathname, useRouter } from 'next/navigation'

export default function NavButtons() {
  const p = usePathname()
  const router = useRouter()

  return (
    <ToggleButtonGroup
    size="small"
      exclusive
      color="primary"
      value={p?.replace('/', '')}
      onChange={(e, view) => { () => {console.log(p?.replace('/', '')); router.push(`/${view}`) }}}>
      <ToggleButton value="table">T</ToggleButton>
      <ToggleButton value="plots">P</ToggleButton>
      <ToggleButton value="skyviewer">S</ToggleButton>
    </ToggleButtonGroup>
  )
}