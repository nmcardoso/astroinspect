
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CitationButton from './CitationButton'
import Logo from './Logo'
import GithubButton from './GithubButton'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import BackButton from './BackButton'
import DownloadTableButton from './DownloadTableButton'
import ViewModeButton from './ViewModeButton'
import NavButtons from './NavButtons'
import  Stack  from 'react-bootstrap/Stack'
import FilenameText from './FilenameText'
import PlotFilterButton from './PlotFilterButton'




export default function Appbar() {
  const { tcState } = useXTableConfig()

  return (
    <Navbar bg="light" expand="lg" className="p-1">
      <Container fluid>
        {/* Left side */}
        <NavButtons />
        <PlotFilterButton />

        {/* Middle */}
        <Stack direction="horizontal" className="mx-auto"> 
          <Logo />
          <FilenameText />
        </Stack>
        
        {/* Right side */}
        <Stack direction="horizontal" gap={2}>
          <span className="text-muded small">v1.0</span>
          <DownloadTableButton />
          <ViewModeButton />
          {/* <GithubButton /> */}
          <CitationButton />
        </Stack>
      </Container>
    </Navbar>
  )
}