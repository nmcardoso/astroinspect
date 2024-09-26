import { getBaseURL } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { BsGithub } from 'react-icons/bs'
import CitationButton from './CitationButton'


const Logo = () => (
  <Navbar.Brand as="div" className="mx-auto">
    <Link href="/">
      <div className="d-flex align-items-center">
        <Image
          alt="AstronInspect"
          src={`${getBaseURL()}galaxy_128.png`}
          width="30"
          height="30"
          className="d-inline-block align-top" />
        <span className="ms-2 fw-bold">AstroInspect</span>
      </div>
    </Link>
  </Navbar.Brand>
)

const GithubButton = () => (
  <Button
    className="me-2"
    size="sm"
    variant="outline-primary"
    href="https://github.com/nmcardoso/astrotools"
    target="_BLANK">
    <BsGithub size={20} />
  </Button>
)


export default function AppNavbar({left}: {left: any}) {
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