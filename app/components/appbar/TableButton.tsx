import TableChartIcon from '@mui/icons-material/TableChart'
import AppbarButton from './AppbarButton'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function TableButton() {
  const path = usePathname()
  const router = useRouter()
  
  const handleClick = useCallback(() => {
    if (path != '/table/') {
      router.push('/table')
    }
  }, [path, router])

  return (
    <AppbarButton
      toggle
      active={path == '/table/'}
      icon={<TableChartIcon />}
      tooltip="Table page"
      onClick={handleClick} />
  )
}