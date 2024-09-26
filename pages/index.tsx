import LoadInitialState from '@/components/common/LoadInitialState'
import { XTableConfigProvider } from '@/contexts/XTableConfigContext'
import Head from 'next/head'
import AstroInspect from '@/components/common/AstroInspect'

export default function XTable() {
  return (
    <>
      <Head>
        <title>AstroInspect</title>
      </Head>
      
      <XTableConfigProvider>
        <LoadInitialState />

        <AstroInspect />
      </XTableConfigProvider>
    </>
  )
}