import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Link from 'next/link'
import { BsGithub } from 'react-icons/bs'
import { getBaseURL } from '../../lib/utils'


const DOI = '10.5281/zenodo.7268504'
const CITATION = `@software{astrotools,
    doi = {10.5281/zenodo.7268504},
    url = {https://doi.org/10.5281/zenodo.7268504},
    year = {2022},
    month = oct,
    publisher = {Zenodo},
    author = {Cardoso, N. M.},
    title = {Astrotools: Web-based astronomical tools}
}`



const CitationModal = ({ show, onHide }: any) => {
  const [isDoiCopied, setDoiCopied] = useState(false)
  const [isCitationCopied, setCitationCopied] = useState(false)

  useEffect(() => {
    if (isDoiCopied) setTimeout(() => setDoiCopied(false), 3000)
    if (isCitationCopied) setTimeout(() => setCitationCopied(false), 3000)
  }, [isDoiCopied, isCitationCopied])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      size="lg"
      centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5" id="contained-modal-title-vcenter">
          How to cite this software
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          If you used this software during the production process of
          your scientific project, please consider citing it with
          the information provided below.
        </p>

        <div className="mt-4">
          <Badge>DOI</Badge>
          <CopyToClipboard
            text={DOI}
            onCopy={() => setDoiCopied(true)}>
            <Button variant="link" size="sm">Copy to Clipboard</Button>
          </CopyToClipboard>
          {isDoiCopied && <small className="text-success ms-3">Copied!</small>}
          <pre className="pre-scrollabes bg-dark bg-opacity-10 rounded-3 p-3">
            {DOI}
          </pre>
        </div>

        <div className="mt-4">
          <Badge>BibTex</Badge>
          <CopyToClipboard
            text={CITATION}
            onCopy={() => setCitationCopied(true)}>
            <Button variant="link" size="sm">Copy to Clipboard</Button>
          </CopyToClipboard>
          {isCitationCopied && <small className="text-success ms-3">Copied!</small>}
          <pre className="pre-scrollabes bg-dark bg-opacity-10 rounded-3 p-3">
            {CITATION}
          </pre>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default function AppNavbar({ title = '' }: any) {
  const [showModal, setShowModal] = useState(false)

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand href="#">
          <Link href="/">
            <div className="d-flex align-items-center">
              <Image
                alt=""
                src={`${getBaseURL()}galaxy_128.png`}
                width="30"
                height="30"
                className="d-inline-block align-top" />
              <span className="ms-2">AstroTools</span>
            </div>
          </Link>
        </Navbar.Brand>

        <div className="mx-auto">
          <span className="fw-bold">{title}</span>
        </div>

        <div>
          <Button
            className="me-2"
            size="sm"
            variant="outline-primary"
            href="https://github.com/nmcardoso/astrotools"
            target="_BLANK">
            <BsGithub size={20} />
          </Button>

          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setShowModal(true)}>
            Cite this software
          </Button>
          <CitationModal
            show={showModal}
            onHide={() => setShowModal(false)} />
        </div>
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