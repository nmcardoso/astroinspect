/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import LegacyService from '../../services/LegacyService'
import TableHelper from '../../lib/TableHelper'
import { useXTableData } from '../../contexts/XTableDataContext'


type RedshiftMaskProps = {
  centerRa: number,
  centerDec: number,
  redshifts: {
    ra: number,
    dec: number,
    z: number
  }[]
}

const service = new LegacyService()

const RedshiftMask = ({
  centerRa,
  centerDec,
  redshifts
}: RedshiftMaskProps) => {
  return (
    <svg viewBox="0 0 400 400">
      <defs>
        <filter x="-0.03" y="-0.03" width="1.06" height="1.06" id="bg-text">
          <feFlood floodColor="#FFFFFF" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
        <filter x="-0.03" y="-0.03" width="1.06" height="1.06" id="bg-text-hover">
          <feFlood floodColor="#AFEEEE" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </defs>
      {redshifts.map((redshift, i) => (
        <g className="circle-group" key={i}>
          <circle
            cx={200 + (centerRa - redshift.ra) * (400 / 0.0212)}
            cy={200 + (centerDec - redshift.dec) * (400 / 0.0213)}
            r="40"
            strokeWidth="2px"
            fill="transparent" />
          <text
            x={200 + (centerRa - redshift.ra) * (400 / 0.0212)}
            y={230 + (centerDec - redshift.dec) * (400 / 0.0213)}
            fill="black"
            stroke="transparent"
            textAnchor="middle"
            alignmentBaseline="hanging">
            {redshift.z}
          </text>
        </g>
      ))}
    </svg>
  )
}


const ImageModal = ({ show, onHide, src, ra, dec, showFooter, size, zoomWidth, zoomHeight }: any) => {
  const [redshiftEnabled, setRedshiftEnabled] = useState(false)
  const [zInfo, setZInfo] = useState<any>(null)

  useEffect(() => {
    if (showFooter && redshiftEnabled && zInfo === null) {
      service.getNearbyRedshift(ra, dec, 0).then(resp => {
        setZInfo(resp)
      })
    }
  }, [ra, dec, zInfo, redshiftEnabled, showFooter])

  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      animation={false}
      size={size}>
      <Modal.Body className="mx-auto px-0 py-2">
        <div className="img-overlay-wrap">
          <img src={src} width={zoomWidth} height={zoomHeight} alt="" />
          {showFooter && zInfo && <RedshiftMask
            centerRa={ra}
            centerDec={dec}
            redshifts={zInfo} />}
        </div>
      </Modal.Body>
      {showFooter && <Modal.Footer className="py-2">
        <Form.Check
          type="switch"
          id="image-modal-redshift-toogle"
          label="Show Redshit"
          defaultChecked={redshiftEnabled}
          onChange={e => setRedshiftEnabled(e.target.checked)}
        />
      </Modal.Footer>}
    </Modal>
  )
}


export default function ImageCell({
  src,
  rowId,
  zoomWidth,
  zoomHeight,
  showFooter = true,
  modalSize = "",
}: {
  src: string,
  rowId: any,
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  showFooter?: boolean,
  modalSize?: string
}) {
  const [showModal, setShowModal] = useState(false)

  const { tdState } = useXTableData()
  const ra = useMemo(() => TableHelper.getRa(rowId, tdState), [rowId, tdState])
  const dec = useMemo(() => TableHelper.getDec(rowId, tdState), [rowId, tdState])

  return (
    <>
      <LazyLoadImage
        src={src}
        width={90}
        height={90}
        // PlaceholderSrc={PlaceholderImage}
        onClick={() => setShowModal(true)}
        className="cursor-pointer"
      />
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        src={src}
        ra={ra}
        dec={dec}
        showFooter={showFooter}
        size={modalSize}
        zoomWidth={zoomWidth}
        zoomHeight={zoomHeight} />
    </>
  )
}