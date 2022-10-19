/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import TableDataManager from '../../lib/TableDataManager'
import LegacyService from '../../services/LegacyService'


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
          <feFlood flood-color="#FFFFFF" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
        <filter x="-0.03" y="-0.03" width="1.06" height="1.06" id="bg-text-hover">
          <feFlood flood-color="#AFEEEE" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </defs>
      {redshifts.map(redshift => (
        <g className="circle-group" key={`${redshift.ra}-${redshift.dec}`}>
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


const ImageModal = ({ show, onHide, src, ra, dec }: any) => {
  const [redshiftEnabled, setRedshiftEnabled] = useState(false)
  const [zInfo, setZInfo] = useState<any>(null)

  useEffect(() => {
    if (redshiftEnabled && zInfo === null) {
      service.getNearbyRedshift(ra, dec, 0).then(resp => {
        setZInfo(resp)
      })
    }
    console.log(zInfo)
  }, [ra, dec, zInfo, redshiftEnabled])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false}
      centered
    >
      <Modal.Body className="mx-auto px-0 py-2">
        <div className="img-overlay-wrap">
          <img src={src} width={400} height={400} alt="" />
          {redshiftEnabled && zInfo && <RedshiftMask
            centerRa={ra}
            centerDec={dec}
            redshifts={zInfo} />}
        </div>
      </Modal.Body>
      <Modal.Footer className="py-2">
        <Form.Check
          type="switch"
          id="image-modal-redshift-toogle"
          label="Show Redshit"
          defaultChecked={redshiftEnabled}
          onChange={e => setRedshiftEnabled(e.target.checked)}
        />
      </Modal.Footer>
    </Modal>
  )
}


export default function ImageCell({ src, rowId }: { src: string, rowId: any }) {
  const [asyncId, setAsyncId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // useEffect(() => {
  //   const fact = (_id: any) => new Promise((resolve, reject) => {
  //     const img = new Image()
  //     img.addEventListener('load', () => {
  //       resolve(id)
  //     })
  //     img.src = src
  //   })
  //   semaphore.enqueue(1, fact, id).then((resp: any) => {
  //     console.log(`resolve ${resp}`)
  //     setAsyncId(resp)
  //   })
  // }, [id, src])

  const ra = useMemo(() => TableDataManager.getRa(rowId), [rowId])
  const dec = useMemo(() => TableDataManager.getDec(rowId), [rowId])

  return (
    // <img src={src} height={90} alt="" loading="lazy" />
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
        dec={dec} />
    </>
    // <span>{asyncId == null ? '-' : asyncId}{ } ({id})</span>
  )
}