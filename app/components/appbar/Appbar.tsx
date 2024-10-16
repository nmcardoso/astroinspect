
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CitationButton from './CitationButton'
import Logo from './Logo'
import GithubButton from './GithubButton'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import BackButton from './BackButton'
import DownloadTableButton from './DownloadTableButton'
import ModeButton from './ModeButton'



export default function Appbar() {
  const { tcState } = useXTableConfig()

  return (
    <Navbar bg="light" expand="lg" className="p-1">
      <Container>
        <div>
          {tcState.currentView == 'grid' && <BackButton />}
          {tcState.grid.isLoaded && <DownloadTableButton />}
          {tcState.currentView == 'grid' && <ModeButton />}
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