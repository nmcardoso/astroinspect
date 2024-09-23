import { Container } from 'react-bootstrap'
import AppNavbar from '@/components/common/AppNavbar'
import LoadInitialState from '@/components/common/LoadInitialState'
import ConfigForm from '@/components/setup/ConfigForm'
import { XTableConfigProvider } from '@/contexts/XTableConfigContext'
import XTableBody from '@/components/table/_XTableBody'
import { XTableDataProvider } from '@/contexts/XTableDataContext'
import Head from 'next/head'

export default function XTable() {
  return (
    <>
      <Head>
        <title>AstroInspect</title>
      </Head>
      
      <XTableConfigProvider>
        <LoadInitialState />

        <AppNavbar />

        <XTableDataProvider>
          <Container className="mt-3">
            <ConfigForm />
          </Container>

          <Container fluid className="px-0">
            <XTableBody />
          </Container>
        </XTableDataProvider>
      </XTableConfigProvider>
    </>
  )
}