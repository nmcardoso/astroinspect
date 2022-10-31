import { Container } from 'react-bootstrap'
import AppNavbar from '../components/common/AppNavbar'
import LoadInitialState from '../components/xtable/LoadInitialState'
import ConfigForm from '../components/xtable/ConfigForm'
import { XTableConfigProvider } from '../contexts/XTableConfigContext'
import XTableBody from '../components/xtable/XTableBody'
import { XTableDataProvider } from '../contexts/XTableDataContext'

export default function XTable() {
  return (
    <>
      <XTableConfigProvider>
        <LoadInitialState />

        <AppNavbar title="XTable" />

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