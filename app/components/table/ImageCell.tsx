/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import { CustomCellRendererProps } from '@ag-grid-community/react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useMemo, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
}


const ImageModal = ({ show, onHide, src, size, zoomWidth, zoomHeight }: any) => {
  return (
    <Modal open={show} onClose={onHide}>
      <Box sx={style}>
        <img src={src} width={zoomWidth} height={zoomHeight} alt="" />
      </Box>
    </Modal>
  )
}


const QueuedPlaceholder = () =>
  <div
    className="border d-flex align-items-center justify-content-center"
    style={{ width: 120, height: 120, backgroundColor: '#f5f5f5' }}>
    <span><AccessTimeIcon /> Queued</span>
  </div>

const LoadingPlaceholder = () =>
  <div
    className="border d-flex align-items-center justify-content-center"
    style={{ width: 120, height: 120, backgroundColor: '#f5f5f5' }}>
    <span><DownloadIcon /> Downloading</span>
  </div>

const ErrorPlaceholder = () =>
  <div
    className="border d-flex align-items-center justify-content-center"
    style={{ width: 120, height: 120, backgroundColor: '#f5f5f5' }}>
    <span><ErrorOutlineIcon /> Server Error</span>
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
          loading={lazy ? 'lazy' : 'eager'}
          height={120}
          style={{ cursor: 'zoom-in' }}
          onClick={() => setShowModal(true)} />
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