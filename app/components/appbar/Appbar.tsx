
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CitationButton from './CitationButton'
import Logo from './Logo'
import GithubButton from './GithubButton'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import BackButton from './BackButton'
import DownloadTableButton from './DownloadTableButton'



export default function Appbar() {
  const { tcState } = useXTableConfig()

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <div>
          {tcState.currentView == 'grid' && <BackButton />}
          {tcState.grid.isLoaded && <DownloadTableButton />}
        </div>

        <Logo />

        <div>
          <GithubButton />
          <CitationButton />
        </div>
      </Container>
    </Navbar>
  )
}