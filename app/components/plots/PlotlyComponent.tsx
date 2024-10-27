import dynamic from 'next/dynamic'
import Loading from '../common/Loading'

export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: Loading
})