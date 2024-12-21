import { useXTableConfig } from '@/contexts/XTableConfigContext'
import  Autocomplete  from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export default function ColumnDropdown({ label = undefined, value = '', dispatchKey, dispatchType }: ColumnDropdownProps) {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleChange = (event: React.SyntheticEvent, newValue: string | null) => {
    tcDispatch({
      type: dispatchType,
      payload: {
        [dispatchKey]: newValue
      }
    })
  }

  return (
    <Autocomplete
      disablePortal
      sx={{flexGrow: 1}}
      getOptionKey={e => e}
      getOptionLabel={e => e}
      options={tcState.table.columns}
      value={value}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={handleChange}
    />
  )
}