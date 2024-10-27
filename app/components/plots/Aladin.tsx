import dynamic from 'next/dynamic'
import Loading from '../common/Loading'

const AladinComp = dynamic(() => import('./AladinComponent'), { 
  ssr: false, 
  loading: Loading
})



export default function Aladin() {
  return (
    <AladinComp width="100%" height="100%" />
  )
}