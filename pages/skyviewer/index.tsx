import Aladin from '@/components/plots/Aladin'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Index() {
  const {tcState} = useXTableConfig()
  const router = useRouter()

  useEffect(() => {
    if (!tcState.grid.data) {
      router.push('/')
    }
  }, [tcState.grid.data, router])

  return (
    <Aladin />
  )
}