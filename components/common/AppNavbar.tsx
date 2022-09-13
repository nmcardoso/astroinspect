/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'


export default function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt="Logo"
            src="/galaxy_32.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          AstroTools
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/astrotools/table">Table</Nav.Link>
            <NavDropdown title="Other Tools" id="basic-nav-dropdown">
              <NavDropdown.Item href="#">Comming Soon</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  )
}