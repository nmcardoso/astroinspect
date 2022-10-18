/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import TableDataManager from '../../lib/TableDataManager'
import SdssService from '../../services/SdssService'
import Modal from 'react-bootstrap/Modal'

const service = new SdssService()

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
  const ra = useMemo(() => {
    return TableDataManager.getRa(rowId)
  }, [rowId])

  const dec = useMemo(() => {
    return TableDataManager.getDec(rowId)
  }, [rowId])

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    service.getSpecPlotUrl(ra, dec).then(url => {
      TableDataManager.setCellValue(rowId, 'sdssSpectra', url)
    })
  }, [ra, dec, rowId])

  const src = TableDataManager.getCellValue(rowId, 'sdssSpectra')

  return (
    <>
      <img
        className="cursor-pointer"
        src={src}
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