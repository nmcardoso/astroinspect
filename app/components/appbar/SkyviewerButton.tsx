import LanguageIcon from '@mui/icons-material/Language'
import AppbarButton from './AppbarButton'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function SkyviewerButton() {
  const path = usePathname()
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (path != '/skyviewer/') {
      router.push('/skyviewer')
    }
  }, [path, router])

  return (
    <AppbarButton
      toggle
      active={path == '/skyviewer/'}
      icon={<LanguageIcon />}
      tooltip="Skyviewer page"
      onClick={handleClick} />
  )
}