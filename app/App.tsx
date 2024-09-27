import { Button, Container } from 'react-bootstrap'
import Appbar from '@/components/appbar/Appbar'
import ConfigForm from '@/components/setup/ConfigForm'
import AIGrid from '@/components/table/AIGrid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Emitter from '@/lib/Emitter'
import { FaArrowLeft } from "react-icons/fa";
import DownloadTableButton from '@/components/appbar/DownloadTableButton'
import { useXTableConfig } from './contexts/XTableConfigContext'


export default function App() {
  const { tcState} = useXTableConfig()
  return (
    <>
      <div className="d-flex flex-column h-100">
        <Appbar />
        <div className="flex-grow-1">
          {tcState.currentView == 'settings' ? <ConfigForm /> : <AIGrid />}
        </div>
      </div>
    </>
  )
}