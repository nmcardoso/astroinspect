/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import { LazyLoadComponent, LazyLoadImage } from 'react-lazy-load-image-component'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import LegacyService from '@/services/LegacyService'
import TableHelper from '@/lib/TableHelper'
import { useXTableData } from '@/contexts/XTableDataContext'
import Spinner from 'react-bootstrap/Spinner'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import SplusService from '@/services/SplusService'
import { CustomCellRendererProps } from '@ag-grid-community/react'
import Image from 'react-bootstrap/Image'
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import { MdErrorOutline, MdDownload } from "react-icons/md"
import { IoMdTime } from "react-icons/io"


const notFoundSrc = 'https://dummyimage.com/90x90/e8e8e8/474747.jpg&text=Not+Found'
const legacyService = new LegacyService()
const splusService = new SplusService()



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
}: {
  src: string | symbol,
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
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
          src={src}
          alt=""
          height={120}
          onClick={() => setShowModal(true)}/>
      )
      return Figure
    }
  }, [src])

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
}: {
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
}) {
  // const Wrapper = (params: any) => (
  //   <ImageCell 
  //   src={params.value} 
  //   zoomWidth={zoomWidth}
  //   zoomHeight={zoomHeight}
  //   modalSize={modalSize} />
  // )

  // const ImageCellMemo = useMemo(() => {
  //   return (
  //     function Wrapper(params: CustomCellRendererProps) {
  //       return (
  //         <ImageCell 
  //           src={params.value} 
  //           zoomWidth={zoomWidth}
  //           zoomHeight={zoomHeight}
  //           modalSize={modalSize} />
  //       )
  //     }
  //   )
  // }, [zoomWidth, zoomHeight, modalSize])

  function ImageCellMemo(params: CustomCellRendererProps) {
    return (
      <ImageCell 
        src={params.value} 
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        modalSize={modalSize} />
    )
  }

  return ImageCellMemo
}