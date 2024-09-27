import { getBaseURL } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from 'react-bootstrap/Navbar'

export default function Logo() {
  return (
    <Navbar.Brand as="div" className="mx-auto">
      <Link href="/">
        <div className="d-flex align-items-center">
          <Image
            alt="AstronInspect"
            src={`${getBaseURL()}galaxy_128.png`}
            width="30"
            height="30"
            className="d-inline-block align-top" />
          <span className="ms-2 fw-bold">AstroInspect</span>
        </div>
      </Link>
    </Navbar.Brand>
  )
}