import { Button, Container } from 'react-bootstrap'
import AppNavbar from '@/components/common/AppNavbar'
import ConfigForm from '@/components/setup/ConfigForm'
import XTableBody from '@/components/table/_XTableBody'
import { XTableDataProvider } from '@/contexts/XTableDataContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Emitter from '@/lib/Emitter'
import { FaArrowLeft } from "react-icons/fa";
import DownloadTableButton from '@/components/common/DownloadTableButton'


export default function App() {
  const [currPanel, setCurrPanel] = useState('config')

  useEffect(() => {
    Emitter.on('load_table', () => {
      setCurrPanel('table')
    })

    Emitter.on('back', () => {
      setCurrPanel('config')
    })
  })

  const BackButton = useCallback(() => {
    return (
      <>
        <Button onClick={() => setCurrPanel('config')} className="d-inline-flex align-items-center me-2">
          <FaArrowLeft size={14} className="me-2" />
          <span>Back</span>
        </Button>
        <DownloadTableButton />
      </>
    )
  }, [])

  return (
    <>
      <div className="d-flex flex-column h-100">
        <AppNavbar left={currPanel == 'table' ? <BackButton /> : ''} />
        <div className="flex-grow-1">
          <XTableDataProvider>
            {currPanel == 'config' ? <ConfigForm /> : <XTableBody />}
          </XTableDataProvider>
        </div>
      </div>
    </>
  )
}