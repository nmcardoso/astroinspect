import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { BsBlockquoteLeft } from 'react-icons/bs'


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

export default function CitationButton() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <Button
        size="sm"
        variant="outline-primary"
        className="d-inline-flex align-items-center"
        onClick={() => setShowModal(true)}>
        <BsBlockquoteLeft className="me-1" size={18} />
        <span>Cite this software</span>
      </Button>
      <CitationModal
        show={showModal}
        onHide={() => setShowModal(false)} />
    </>
  )
}