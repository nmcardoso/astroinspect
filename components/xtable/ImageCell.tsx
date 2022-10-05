/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


type RedshiftMaskProps = {
  centerRa: number,
  centerDec: number,
  redshifts: {
    ra: number,
    dec: number,
    z: number
  }[]
}

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
            stroke-width="2px"
            fill="transparent" />
          <text
            x={200 + (centerRa - redshift.ra) * (400 / 0.0212)}
            y={230 + (centerDec - redshift.dec) * (400 / 0.0213)}
            fill="black"
            stroke="transparent"
            text-anchor="middle"
            alignment-baseline="hanging">
            z = {redshift.z}
          </text>
        </g>
      ))}
    </svg>
  )
}


const ImageModal = ({ show, onHide, src }: any) => {
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
          <RedshiftMask centerRa={326.89521889778166} centerDec={0.7732092724400577}
            redshifts={[{ ra: 326.89521889778166, dec: 0.7732092724400577, z: 10 }]} />
        </div>
      </Modal.Body>
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

  return (
    // <img src={src} height={90} alt="" loading="lazy" />
    <>
      <LazyLoadImage src={src}
        width={90} height={90}
        // PlaceholderSrc={PlaceholderImage}
        onClick={() => setShowModal(true)}
        className="cursor-pointer"
      />
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        src={src} />
    </>
    // <span>{asyncId == null ? '-' : asyncId}{ } ({id})</span>
  )
}