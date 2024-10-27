
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CitationButton from './CitationButton'
import Logo from './Logo'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import DownloadTableButton from './DownloadTableButton'
import ViewModeButton from './ViewModeButton'
import NavButtons from './NavButtons'
import  Stack  from 'react-bootstrap/Stack'
import FilenameText from './FilenameText'
import PlotFilterButton from './PlotFilterButton'
import Version from './Version'




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
          <Version />
          <DownloadTableButton />
          <ViewModeButton />
          {/* <GithubButton /> */}
          <CitationButton />
        </Stack>
      </Container>
    </Navbar>
  )
}