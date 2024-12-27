/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import React, { useState } from 'react'
import type { SxProps } from '@mui/material'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { CustomCellRendererProps } from 'ag-grid-react'
import ImagePlaceholderSwitcher from './ImagePlaceholderSwitcher'
import styles from '@/styles/StampCell.module.css'


const style: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '4px',
  p: 0,
}



function ReticleImage({ src, width, height, loading, style, onClick }) {
  return (
    <div className={styles.container}>
      <img src={src} width={height} height={height} className={styles.image} loading={loading} style={style} onClick={onClick} alt="" />
      <svg className={styles.reticle} viewBox="0 0 16 16" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="rgb(178, 50, 178)">
        <path d="M 0 7 L 5 7 L 5 9 L 0 9 L 0 7 Z" fillRule="evenodd"></path>
        <path d="M 11 7 L 16 7 L 16 9 L 11 9 L 11 7 Z" fillRule="evenodd"></path>
        <path d="M 7 11 L 9 11 L 9 16 L 7 16 L 7 11 Z" fillRule="evenodd"></path>
        <path d="M 7 0 L 9 0 L 9 5 L 7 5 L 7 0 Z" fillRule="evenodd"></path>
      </svg>
    </div>
  )
}


const ImageModal = ({ show, onHide, src, size, zoomWidth, zoomHeight, showReticle }: any) => {
  return (
    <Modal open={show} onClose={onHide}>
      <Box sx={{ width: zoomHeight, height: zoomHeight, ...style }}>
        {
          showReticle ? (
            <ReticleImage
              src={src}
              width={zoomHeight}
              height={zoomHeight} />
          ) : (
            <img
              src={src}
              width={zoomWidth}
              height={zoomHeight}
              alt="" />
          )
        }

      </Box>
    </Modal>
  )
}


function StampCell({
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
  const { tcState } = useXTableConfig()

  return (
    <>
      <ImagePlaceholderSwitcher src={src}>
        {
          tcState.ui.showReticle ? (
            <ReticleImage
              src={src as string}
              loading={lazy ? 'lazy' : 'eager'}
              width={tcState.ui.figureSize}
              height={tcState.ui.figureSize}
              style={{ cursor: 'zoom-in' }}
              onClick={() => setShowModal(true)} />
          ) : (
            <img
              src={src as string}
              alt=""
              loading={lazy ? 'lazy' : 'eager'}
              width={tcState.ui.figureSize}
              height={tcState.ui.figureSize}
              style={{ cursor: 'zoom-in' }}
              onClick={() => setShowModal(true)} />
          )
        }
      </ImagePlaceholderSwitcher>
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        src={src}
        size={modalSize}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        showReticle={tcState.ui.showReticle} />
    </>
  )
}


export default function stampCellFactory({
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
      <StampCell
        src={params.value}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        modalSize={modalSize}
        lazy={lazy} />
    )
  }

  return ImageCellMemo
}