/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import { LazyLoadComponent, LazyLoadImage } from 'react-lazy-load-image-component'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import LegacyService from '../services/LegacyService'
import TableHelper from '../lib/TableHelper'
import { useXTableData } from '../contexts/XTableDataContext'
import Spinner from 'react-bootstrap/Spinner'
import { useXTableConfig } from '../contexts/XTableConfigContext'
import SplusService from '../services/SplusService'


type RedshiftMaskProps = {
  refRa: number,
  refDec: number,
  sourceSize: number,
  targetSize: number,
  pixScale: number,
  redshifts: {
    ra: number,
    dec: number,
    z: number
  }[]
}

type EllipseMaskProps = {
  targetSize: number,
  pixScale: number,
  majorAxis: number,
  minorAxis: number,
  rotation: number,
}

const notFoundSrc = 'https://dummyimage.com/90x90/e8e8e8/474747.jpg&text=Not+Found'
const legacyService = new LegacyService()
const splusService = new SplusService()

const textOffset = 35

const RedshiftMask = ({
  refRa,
  refDec,
  sourceSize,
  targetSize,
  pixScale,
  redshifts
}: RedshiftMaskProps) => {
  const targetCenter = targetSize / 2
  const k = (targetSize / (pixScale * sourceSize / 3600))

  return (
    <svg viewBox={`0 0 ${targetSize} ${targetSize}`}>
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
      {redshifts.map((redshift, i) => {
        return (
          <g className="circle-group" key={i}>
            <circle
              cx={targetCenter + (refRa - redshift.ra) * k}
              cy={targetCenter + (refDec - redshift.dec) * k}
              r="40"
              strokeWidth="2px"
              fill="transparent" />
            <text
              x={targetCenter + (refRa - redshift.ra) * k}
              y={targetCenter + textOffset + (refDec - redshift.dec) * k}
              fill="black"
              stroke="transparent"
              textAnchor="middle"
              alignmentBaseline="hanging">
              {redshift.z}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const EllipseMask = ({
  targetSize,
  pixScale,
  majorAxis,
  minorAxis,
  rotation
}: EllipseMaskProps) => {
  const targetCenter = targetSize / 2
  return (
    <svg viewBox={`0 0 ${targetSize} ${targetSize}`}>
      <g>
        <ellipse
          cx={targetCenter}
          cy={targetCenter}
          rx={majorAxis / pixScale}
          ry={minorAxis / pixScale}
          transform={`rotate(${90 + rotation}, ${targetCenter}, ${targetCenter})`}
          stroke="#FFF"
          strokeWidth={1.5}
          fill="transparent" />
      </g>
    </svg>
  )
}


const ImageModal = ({ show, onHide, src, ra, dec, showFooter, size, zoomWidth, zoomHeight, pixScale }: any) => {
  const [zInfo, setZInfo] = useState<any>(null)
  const [fluxInfo, setFluxInfo] = useState<any>(null)
  const [isZLoading, setZLoading] = useState(false)
  const [isFluxLoading, setFluxLoading] = useState(false)
  const { tcState, tcDispatch } = useXTableConfig()
  const showRedshift = tcState.stampModal.showRedshift
  const showAutoFluxRadius = tcState.stampModal.showAutoFluxRadius
  const showPetroFluxRadius = tcState.stampModal.showPetroFluxRadius

  useEffect(() => {
    if (show && showFooter && showRedshift && zInfo === null) {
      setZLoading(true)
      legacyService.getNearbyRedshift(ra, dec, 0).then(resp => {
        setZLoading(false)
        setZInfo(resp)
      })
    }
  }, [ra, dec, show, zInfo, showRedshift, showFooter])

  useEffect(() => {
    if (show && showFooter && showAutoFluxRadius && fluxInfo === null) {
      setFluxLoading(true)
      splusService.getFluxRadius(ra, dec).then(data => {
        setFluxLoading(false)
        setFluxInfo(data)
      })
    }
  }, [ra, dec, show, fluxInfo, showFooter, showAutoFluxRadius])

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
          {showFooter && showRedshift && zInfo &&
            <RedshiftMask
              refRa={ra}
              refDec={dec}
              sourceSize={256}
              targetSize={zoomWidth}
              pixScale={pixScale}
              redshifts={zInfo} />
          }
          {showFooter && showAutoFluxRadius && fluxInfo &&
            <EllipseMask
              targetSize={zoomWidth}
              pixScale={pixScale}
              majorAxis={fluxInfo.A * fluxInfo.kronRadius}
              minorAxis={fluxInfo.B * fluxInfo.kronRadius}
              rotation={fluxInfo.theta} />
          }
        </div>
      </Modal.Body>
      {showFooter &&
        <Modal.Footer className="py-2">
          {(isZLoading || isFluxLoading) &&
            <div className="me-3">
              <Spinner
                animation="border"
                variant="secondary"
                as="span"
                size="sm"
                className="me-2" />
              <span className="text-muted">
                Loading...
              </span>
            </div>
          }

          <Form.Check
            type="switch"
            className="me-3"
            id="image-modal-auto-flux-toogle"
            label="Auto flux"
            defaultChecked={showAutoFluxRadius}
            disabled={isFluxLoading}
            onChange={e => tcDispatch({
              type: 'setStampModal',
              payload: {
                showAutoFluxRadius: e.target.checked
              }
            })} />

          <Form.Check
            type="switch"
            id="image-modal-redshift-toogle"
            label="Redshit"
            defaultChecked={showRedshift}
            disabled={isZLoading}
            onChange={e => tcDispatch({
              type: 'setStampModal',
              payload: {
                showRedshift: e.target.checked
              }
            })} />
        </Modal.Footer>
      }
    </Modal>
  )
}

const LoadPlaceholder = () =>
  <Spinner
    as="span"
    size="sm"
    role="status"
    animation="border"
    variant="secondary" />


export default function ImageCell({
  src,
  rowId,
  pixScale,
  zoomWidth,
  zoomHeight,
  showFooter = true,
  modalSize = "",
}: {
  src: string,
  rowId: any,
  pixScale?: number
  zoomWidth?: number | string,
  zoomHeight?: number | string,
  showFooter?: boolean,
  modalSize?: string,
}) {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(false)

  const { tdState } = useXTableData()
  const ra = useMemo(() => TableHelper.getRa(rowId, tdState), [rowId, tdState])
  const dec = useMemo(() => TableHelper.getDec(rowId, tdState), [rowId, tdState])

  return (
    <>
      <LazyLoadImage
        src={error ? notFoundSrc : src}
        // width={100}
        height={100}
        placeholder={<LoadPlaceholder />}
        onClick={() => !error && setShowModal(true)}
        className="cursor-pointer"
        onError={() => setError(true)}
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
        zoomHeight={zoomHeight}
        pixScale={pixScale} />
    </>
  )
}