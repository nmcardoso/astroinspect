import { Container } from 'react-bootstrap'
import AppNavbar from '../app/components/common/AppNavbar'
import LoadInitialState from '../app/components/common/LoadInitialState'
import ConfigForm from '../app/components/setup/ConfigForm'
import { XTableConfigProvider } from '../app/contexts/XTableConfigContext'
import XTableBody from '../app/components/table/_XTableBody'
import { XTableDataProvider } from '../app/contexts/XTableDataContext'
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