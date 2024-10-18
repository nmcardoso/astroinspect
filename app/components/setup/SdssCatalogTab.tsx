import { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import SdssService from '@/services/sdss'
import ListView from '@/components/common/ListView'
import Modal from 'react-bootstrap/Modal'
import { Button, Table } from 'react-bootstrap'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { BiPlus } from 'react-icons/bi'
import { HiMinusSm } from 'react-icons/hi'
import Chip from '@/components/common/Chip'
import uniq from 'lodash/uniq'
import { ContextActions } from '@/interfaces/contextActions'
import CatalogDisplay from '../common/CatalogDisplay'

const service = new SdssService()


export default function SdssCatalogTab() {
  const { tcState, tcDispatch } = useXTableConfig()
  const selectedColumns = tcState.cols.sdssCatalog.selectedColumns

  const handleRemoveColumn = (table?: string, column?: string) => {
    if (!table || !column) return undefined
    const idx = selectedColumns.findIndex(e => (
      e.column == column && e.table == table
    ))
    tcDispatch({
      type: ContextActions.SDSS_CATALOG,
      payload: {
        selectedColumns: selectedColumns.filter((_, i) => i != idx)
      }
    })
  }

  const handleAddColumn = (table?: string, column?: string) => {
    if (!table || !column) return undefined
    const newEntry = {
      table: table,
      column: column
    }
    tcDispatch({
      type: ContextActions.SDSS_CATALOG,
      payload: {
        selectedColumns: [...selectedColumns, newEntry]
      }
    })
  }

  return (
    <>
      <CatalogDisplay
        onAddColumn={handleAddColumn}
        onRemoveColumn={handleRemoveColumn}
        selectedColumns={selectedColumns}
        service={service}
      />
    </>
  )
}