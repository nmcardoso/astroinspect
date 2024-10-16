/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import { CustomCellRendererProps } from '@ag-grid-community/react'
import { useMemo, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { IoMdTime } from "react-icons/io"
import { MdDownload, MdErrorOutline } from "react-icons/md"



const ImageModal = ({ show, onHide, src, size, zoomWidth, zoomHeight }: any) => {
  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      animation={false}
      size={size}>
      <Modal.Body className="mx-auto px-0 py-2">
        <img src={src} width={zoomWidth} height={zoomHeight} alt="" />
      </Modal.Body>
    </Modal>
  )
}


const QueuedPlaceholder = () =>
  <div 
    className="border d-flex align-items-center justify-content-center" 
    style={{width: 120, height: 120, backgroundColor: '#f5f5f5'}}>
    <span className="text-dark"><IoMdTime size={15} /> Queued</span>
  </div>

const LoadingPlaceholder = () =>
  <div 
    className="border d-flex align-items-center justify-content-center" 
    style={{width: 120, height: 120, backgroundColor: '#f5f5f5'}}>
    <span className="text-primary"><MdDownload size={15} /> Downloading</span>
  </div>

const ErrorPlaceholder = () =>
  <div 
    className="border d-flex align-items-center justify-content-center" 
    style={{width: 120, height: 120, backgroundColor: '#f5f5f5'}}>
    <span className="text-danger"><MdErrorOutline size={15} /> Server Error</span>
  </div>


function ImageCell({
  src,
  zoomWidth,
  zoomHeight,
  modalSize = "",
  lazy = false,
}: {
  src: string | symbol,
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
  lazy?: boolean,
}) {
  const [showModal, setShowModal] = useState(false)

  const ImgComp = useMemo(() => {
    if (src === queuedState) {
      return QueuedPlaceholder
    } else if (src === loadingState) {
      return LoadingPlaceholder
    } else if (src === loadErrorState) {
      return ErrorPlaceholder
    } else {
      const Figure = () => (
        <img 
          src={src as string}
          alt=""
          loading={lazy ? 'lazy': 'eager'}
          height={120}
          style={{cursor: 'zoom-in'}}
          onClick={() => setShowModal(true)}/>
      )
      return Figure
    }
  }, [src, lazy])

  return (
    <>
      <ImgComp />
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        src={src}
        size={modalSize}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight} />
    </>
  )
}


export default function imageCellFactory({
  zoomWidth,
  zoomHeight,
  modalSize = "",
  lazy = false,
}: {
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
  lazy?: boolean,
}) {
  function ImageCellMemo(params: CustomCellRendererProps) {
    return (
      <ImageCell 
        src={params.value} 
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        modalSize={modalSize}
        lazy={lazy} />
    )
  }

  return ImageCellMemo
}