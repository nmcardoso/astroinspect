import dynamic from 'next/dynamic';

export const PlotlyComponent = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: () => <span>loading</span> 
})