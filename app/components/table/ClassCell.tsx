import { useXTableConfig } from '@/contexts/XTableConfigContext'
import type { GroupCellRendererParams } from 'ag-grid-community'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'


export default function ClassCell(params: GroupCellRendererParams) {
  const { tcState } = useXTableConfig()

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <Select
        id={`class-select-${params.data['ai:id']}`}
        value={params.value || ''}
        sx={{my: 1}}
        onChange={e => {
          params.api.getRowNode(params.data['ai:id'])?.setDataValue('ai:class', e.target.value)
        }}>
        <MenuItem value="">-</MenuItem>
        {tcState.cols.classification.classNames.map(cls => (
          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}