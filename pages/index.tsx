import LoadInitialState from '@/components/common/LoadInitialState'
import { XTableConfigProvider } from '@/contexts/XTableConfigContext'
import Head from 'next/head'
import App from '@/App'

export default function XTable() {
  return (
    <>
      <Head>
        <link 
          rel="icon" 
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌌</text></svg>" />
        <title>AstroInspect</title>
      </Head>
      
      <XTableConfigProvider>
        <LoadInitialState />

        <App />
      </XTableConfigProvider>
    </>
  )
}