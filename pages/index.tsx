import { Container } from 'react-bootstrap'
import AppNavbar from '../app/common/AppNavbar'
import LoadInitialState from '../app/xtable/LoadInitialState'
import ConfigForm from '../app/xtable/ConfigForm'
import { XTableConfigProvider } from '../app/contexts/XTableConfigContext'
import XTableBody from '../app/xtable/_XTableBody'
import { XTableDataProvider } from '../app/contexts/XTableDataContext'

export default function XTable() {
  return (
    <>
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