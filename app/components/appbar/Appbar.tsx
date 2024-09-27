
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CitationButton from './CitationButton'
import Logo from './Logo'
import GithubButton from './GithubButton'


export default function Appbar({left}: {left: any}) {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <div>
          {left}
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