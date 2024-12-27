/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { SxProps, useTheme } from '@mui/material'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { CustomCellRendererProps } from 'ag-grid-react'
import ImagePlaceholderSwitcher from './ImagePlaceholderSwitcher'


const style: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: '4px',
}


const ImageModal = ({ show, onHide, src, size, zoomWidth, zoomHeight, invertColor = false }: any) => {
  return (
    <Modal open={show} onClose={onHide}>
      <Box sx={style}>
        <img
          src={src}
          width={zoomWidth}
          height={zoomHeight}
          className={invertColor ? 'invert-color-dark' : ''}
          alt="" />
      </Box>
    </Modal>
  )
}


function ImageCell({
  src,
  zoomWidth,
  zoomHeight,
  modalSize = "",
  lazy = false,
  isPlotImage = false,
}: {
  src: string | symbol,
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
  lazy?: boolean,
  isPlotImage?: boolean,
}) {
  const [showModal, setShowModal] = useState(false)
  const { tcState } = useXTableConfig()
  const theme = useTheme()
  const invert = Boolean(isPlotImage) && tcState.ui.invertColorDarkMode && theme.palette.mode == 'dark'

  return (
    <>
      <ImagePlaceholderSwitcher src={src}>
        <img
          src={src as string}
          alt=""
          className={invert ? 'invert-color' : ''}
          loading={lazy ? 'lazy' : 'eager'}
          height={tcState.ui.figureSize}
          style={{ cursor: 'zoom-in' }}
          onClick={() => setShowModal(true)} />
      </ImagePlaceholderSwitcher>
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        src={src}
        size={modalSize}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        invertColor={invert} />
    </>
  )
}


export default function imageCellFactory({
  zoomWidth,
  zoomHeight,
  modalSize = "",
  lazy = false,
  isPlotImage = false,
}: {
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  modalSize?: string,
  lazy?: boolean,
  isPlotImage?: boolean,
}) {
  function ImageCellMemo(params: CustomCellRendererProps) {
    return (
      <ImageCell
        src={params.value}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight}
        modalSize={modalSize}
        lazy={lazy}
        isPlotImage={isPlotImage} />
    )
  }

  return ImageCellMemo
}