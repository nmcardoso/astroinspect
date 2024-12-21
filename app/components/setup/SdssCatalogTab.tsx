import SdssService from '@/services/sdss'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
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