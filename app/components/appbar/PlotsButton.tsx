import BarChartIcon from '@mui/icons-material/BarChart'
import AppbarButton from './AppbarButton'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function PlotsButton() {
  const path = usePathname()
  const router = useRouter()
  
  const handleClick = useCallback(() => {
    if (path != '/plots/') {
      router.push('/plots')
    }
  }, [path, router])

  return (
    <AppbarButton
      toggle
      active={path == '/plots/'}
      icon={<BarChartIcon />}
      tooltip="Plots page"
      onClick={handleClick} />
  )
}