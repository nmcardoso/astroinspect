import AIGrid from '@/components/table/AIGrid'
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
  }, [])
  
  return (
    <AIGrid />
  )
}