import { useEffect, useMemo, useState } from 'react'
import ListView from '@/components/common/ListView'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Chip from '@mui/material/Chip'
import uniq from 'lodash/uniq'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'


type CatalogDisplayProps = {
  initialSelectedTable?: string,
  service: any,
  selectedColumns: { table: string, column: string }[],
  onAddColumn: (table?: string, column?: string) => any,
  onRemoveColumn: (table?: string, column?: string) => any,
}

export default function CatalogDisplay({
  initialSelectedTable = '',
  service,
  selectedColumns = [],
  onAddColumn,
  onRemoveColumn,
}: CatalogDisplayProps) {
  const [activeTable, setActiveTable] = useState(initialSelectedTable) //tables[0]
  const [activeColumn, setActiveColumn] = useState('')
  const [columns, setColumns] = useState<SdssColumnDesc[] | undefined>([])
  const [tables, setTables] = useState<string[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const selectedTables = useMemo(() => {
    return uniq(selectedColumns.map(col => col.table))
  }, [selectedColumns])

  useEffect(() => {
    if (!!activeTable) {
      setLoading(true)
      service.getColumns(activeTable).then((r: any) => {
        setColumns(r)
        setLoading(false)
      }).catch(console.log)
    }
  }, [activeTable, service])

  useEffect(() => {
    service.getTables().then((tbls: any) => {
      setTables(tbls)
      setLoading(false)
      if (tbls.length > 0) {
        setActiveTable(tbls[0])
      }
    }).catch(console.log)
  }, [service])

  const colNames = useMemo(() => columns?.map(col => col.name), [columns]) || []

  const activeColumnObj = useMemo(() => (
    columns?.find(col => col.name == activeColumn)
  ), [columns, activeColumn])

  const isActiveColumnSelected = useMemo(() => (
    selectedColumns.findIndex(s => (
      s.column == activeColumn && s.table == activeTable
    )) > -1
  ), [selectedColumns, activeColumn, activeTable])

  return (
    <Stack spacing={4}>
      <Grid container spacing={2}>
        <Grid size={5}>
          <Stack spacing={1}>
          <FormControl fullWidth>
            <InputLabel id="sdss-catalog-select-label">Table</InputLabel>
            <Select
              labelId="sdss-catalog-select-label"
              id="sdss-catalog-select"
              value={activeTable}
              label="Table"
              onChange={(e) => {
                setLoading(true)
                setActiveColumn('')
                setActiveTable(e.target.value)
              }}>
              {tables && tables.map(table => (
                <MenuItem value={table} key={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <ListView
            placeholder={loading}
            items={colNames}
            active={activeColumn}
            height={290}
            onClick={({ title }) => setActiveColumn(title)} />
            </Stack>
        </Grid>


        <Grid size={7}>
          {loading ? (
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <CircularProgress color="inherit" size={22} />
              <Typography>
                Loading columns of the <u>{activeTable}</u> table
              </Typography>
            </Stack>
          ) : (
            <>
              {activeColumnObj && <div>
                <div>
                  <b>{activeColumnObj.name}:</b>&nbsp;
                  {activeColumnObj.description}.&nbsp;
                  {activeColumnObj.unit && <>
                    Unit: <i dangerouslySetInnerHTML={{ __html: activeColumnObj.unit }} />
                  </>}
                </div>
                <div>
                  {isActiveColumnSelected ? (
                    <Button
                      variant="contained"
                      startIcon={<RemoveIcon />}
                      onClick={() => onRemoveColumn(activeTable, activeColumn)}>
                      Remove Selected Column
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => onAddColumn(activeTable, activeColumn)}>
                      Add Selected Column
                    </Button>
                  )}
                </div>
              </div>}
            </>
          )}
        </Grid>
      </Grid>

      {
        selectedColumns.length > 0 && <Box sx={{ mt: 2 }}>
          <Stack spacing={1}>
            {
              selectedTables.map(table => (
                <Box key={table}>
                  <Box>
                    <Typography>{table}:</Typography>
                    {
                      selectedColumns.filter(col => col.table == table).map(col => (
                        <Chip
                          key={col.column}
                          label={col.column}
                          onDelete={() => onRemoveColumn(col.table, col.column)}
                          sx={{ my: 1, mx: 1 }}
                        />
                      ))
                    }
                  </Box>
                </Box>
              ))
            }
          </Stack>
        </Box>
      }
    </Stack>
  )
}