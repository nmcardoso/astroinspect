/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import TableDataManager from '../../lib/TableDataManager'
import SdssService from '../../services/SdssService'
import Modal from 'react-bootstrap/Modal'

const service = new SdssService()

const notFoundSrc = 'https://dummyimage.com/90x90/e8e8e8/474747.jpg&text=Not+Found'

const ImageModal = ({ show, onHide, src }: any) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      size="lg"
      centered
    >
      <Modal.Body className="p-1">
        <img src={src} width="100%" alt="" />
      </Modal.Body>
    </Modal>
  )
}

export default function SdssSpectraCell({ rowId }: { rowId: number }) {
  const [showModal, setShowModal] = useState(false)

  const specObjID = TableDataManager.getCellValue(rowId, 'sdssSpectra')
  const src = service.getSpecPlotUrlById(specObjID)

  return (
    <>
      <img
        className="cursor-pointer"
        src={specObjID === null ? notFoundSrc : src}
        height={90}
        alt=""
        onClick={() => setShowModal(true)} />
      <ImageModal
        src={src}
        show={showModal}
        onHide={() => setShowModal(false)} />
    </>
  )
}