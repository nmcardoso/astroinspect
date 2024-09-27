import { Button, Container } from 'react-bootstrap'
import Appbar from '@/components/appbar/Appbar'
import ConfigForm from '@/components/setup/ConfigForm'
import AIGrid from '@/components/table/AIGrid'
import { XTableDataProvider } from '@/contexts/XTableDataContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Emitter from '@/lib/Emitter'
import { FaArrowLeft } from "react-icons/fa";
import DownloadTableButton from '@/components/appbar/DownloadTableButton'


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
        <Appbar left={currPanel == 'table' ? <BackButton /> : ''} />
        <div className="flex-grow-1">
          <XTableDataProvider>
            {currPanel == 'config' ? <ConfigForm /> : <AIGrid />}
          </XTableDataProvider>
        </div>
      </div>
    </>
  )
}