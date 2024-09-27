import { AiOutlineCloudDownload } from 'react-icons/ai'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useEffect, useState } from 'react'


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
        
      </Modal.Body>
    </Modal>
  )
}



export default function DownloadTableButton() {
  return (
    <Button 
      variant="outline-primary" 
      className="d-inline-flex align-items-center"
      onClick={() => {}}>
      <AiOutlineCloudDownload size={19} className="me-1" />
      <span>Download</span>
    </Button>
  )
}