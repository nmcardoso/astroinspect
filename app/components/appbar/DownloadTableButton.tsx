import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import type { ProcessHeaderForExportParams, ShouldRowBeSkippedParams } from 'ag-grid-community'
import { useCallback, useState } from 'react'
import AppbarButton from '@/components/appbar/AppbarButton'
import DownloadIcon from '@mui/icons-material/Download'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import { ContextActions } from '@/interfaces/contextActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

const DownloadModal = ({ show, onHide }: any) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const [filename, setFilename] = useState<string>('')
  const [colFilter, setColFilter] = useState<'all' | 'selected'>('all')
  const [classFilter, setClassFilter] = useState<'all' | 'classified' | 'unclassified'>('all')
  const [filterAndSort, setFilterAndSort] = useState(false)

  const handleDownload: React.FormEventHandler<HTMLFormElement> = (event) => {//useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()

    const getColKeys = () => {
      let userTableCols = []
      if (colFilter === 'selected') {
        userTableCols = tcState.table.selectedColumnsId.map(i => (
          `tab:${tcState.table.columns[i]}`
        ))
      } else {
        userTableCols = tcState.table.columns.map(c => (
          `tab:${c}`
        ))
      }
      const sdssCols = tcState.cols.sdssCatalog.selectedColumns.map(col => (
        `sdss:${col.table}_${col.column}`
      ))
      const classCols = tcState.cols.classification.enabled ? ['ai:class'] : []
      return [...userTableCols, ...sdssCols, ...classCols]
    }

    const skipClassified = ({ node }: ShouldRowBeSkippedParams) => (
      node.data?.['ai:class'] === undefined || node.data?.['ai:class'] === ''
    )

    const skipUnclassified = ({ node }: ShouldRowBeSkippedParams) => (
      node.data?.['ai:class'] !== undefined || node.data?.['ai:class'] !== ''
    )

    const getClassFilter = () => {
      if (classFilter === 'classified') {
        return skipClassified
      } else if (classFilter === 'unclassified') {
        return skipUnclassified
      } else {
        return undefined
      }
    }

    const processHeader = ({ column }: ProcessHeaderForExportParams) => {
      if (column.getColDef().field === 'ai:class') {
        return 'AstroInspectClass'
      }
      return column.getColDef().headerName
    }

    tcState.grid.api.exportDataAsCsv({
      suppressQuotes: true,
      columnKeys: getColKeys(),
      fileName: filename || 'AstroInspect',
      exportedRows: filterAndSort ? 'filteredAndSorted' : 'all',
      shouldRowBeSkipped: getClassFilter(),
      processHeaderCallback: processHeader,
    })
  }//, [tcState, classFilter, colFilter, filterAndSort, filename])

  return (
    <Box
      component="form"
      onSubmit={handleDownload}>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <TextField
          label="File name"
          id="download-modal-filename"
          sx={{ width: '42ch' }}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="start">.csv</InputAdornment>,
            },
          }} />
        <Help title="File name" className="ms-2">
          Choose a name and save your classifications in local computer
        </Help>
      </Stack>

      {tcState.cols.classification.enabled &&
        <FormControl>
          <Typography variant="overline" sx={{ mt: 2 }}>Classification settings</Typography>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <RadioGroup
              row
              aria-labelledby="download-modal-column-filter-label"
              name="download-modal-column-filter"
              value={classFilter}
              onChange={(e, value) => setClassFilter(value as ('all' | 'classified' | 'unclassified'))}>
              <FormControlLabel value="all" control={<Radio />} label="all" />
              <FormControlLabel value="classified" control={<Radio />} label="classified only" />
              <FormControlLabel value="unclassified" control={<Radio />} label="unclassified only" />
            </RadioGroup>
            <Help title="Filter rows by class" className="ms-0">
              This setting will sample the rows based in the classification
              state:
              <ul>
                <li>
                  <b>all: </b> in this case, no filtering is performed and
                  the output table will contain all rows, including both
                  classified and unclassified rows
                </li>
                <li>
                  <b>classified only: </b> the output table will contain only classified
                  rows
                </li>
                <li>
                  <b>unclassified only: </b> the output table will contain only unclassified
                  rows
                </li>
              </ul>
            </Help>
          </Stack>
        </FormControl>
      }

      <FormControl>
        <Typography variant="overline" sx={{ mt: 1.5 }}>Row settings</Typography>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <FormControlLabel
            label="filter & sort"
            control={
              <Checkbox
                checked={filterAndSort}
                onChange={e => setFilterAndSort(!filterAndSort)} />
            } />
          <Help title="Filter rows by filter">
            This setting will sample the rows based in the following
            criteria:
            <ul>
              <li>
                If this option is <b>selected</b>, the same filters applied in the application will
                also be applied to the output table, that is, it will contain the <u>same
                  rows that you are seeing in the application</u> and in the same order.
              </li>
              <li>
                If this option is <b>unselected</b>, no filtering is performed
                and the output table will have the <u>same rows as the input table</u> and
                in same order.
              </li>
            </ul>
            <b>Note: </b> If you have not applied any filtering or sorting to the
            columns, then the result will be the same for any option in this setting.
          </Help>
        </Stack>
      </FormControl>


      {/* <Form.Group as={Row} className="mb-2" controlId="rowFilter">
            <Form.Label column sm="2" className="text-end">
              Columns
            </Form.Label>
            <Col sm={8}>
              <div className="d-flex align-items-center mt-2">
                <Form.Check
                  inline
                  defaultChecked
                  label="all columns"
                  name="filterColumn"
                  type="radio"
                  value="all"
                  id="filterColumn-1"
                  onChange={(e) => setColFilter('all')}
                />
                <Form.Check
                  inline
                  label="selected columns"
                  name="filterColumn"
                  type="radio"
                  value="selected"
                  id="filterColumn-2"
                  onChange={(e) => setColFilter('selected')}
                />
                <Help title="Filter columns" className="ms-0">
                  This setting will select the columns based in the following
                  criteria:<br />
                  <ul>
                    <li>
                      <b>all columns: </b> includes all columns of the input table
                    </li>
                    <li>
                      <b>selected columns: </b> includes only selected columns of
                      the input table
                    </li>
                  </ul>
                  <b>Note: </b> in both cases, the selected columns of online
                  services (like SDSS) will be downloaded.
                </Help>
              </div>
            </Col>
          </Form.Group> */}

      <Box component="div" sx={{ display: 'block' }}>
        <Button startIcon={<DownloadIcon />} variant="contained" type="submit" sx={{ mt: 2 }}>
          Download table
        </Button>
      </Box>
    </Box>
  )
}



export default function DownloadTableButton() {
  return (
    <AppbarButton
      icon={<DownloadIcon />}
      tooltip="Download table"
      modal={<DownloadModal />}
      modalWidth={580}
      modalTitle="Download table"
      modalIcon={<DownloadIcon />} />
  )
}