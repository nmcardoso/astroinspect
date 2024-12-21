import Autocomplete, { AutocompleteOwnerState, AutocompleteProps, AutocompleteRenderOptionState } from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { ReactNode } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Typography from '@mui/material/Typography'

type PropsType = {
  options: any[]
  label?: string
  isInvalid?: boolean
  isValid?: boolean
  // highlight?: boolean
  invalidMessage?: string | ReactNode
  validMessage?: string | ReactNode
  defaultMessage?: string | ReactNode
  getOptionLabel?: (option: any) => string
}

type AcPropsType = Omit<AutocompleteProps<any, false, false, false>, 'renderInput'>


export default function AIAutocomplete({
  label,
  options,
  value,
  onChange,
  getOptionLabel = option => option,
  isInvalid,
  isValid,
  invalidMessage,
  validMessage,
  defaultMessage,
  sx,
  ...props
}: PropsType & AcPropsType) {
  let helperText = undefined
  if (isInvalid && !!invalidMessage) {
    helperText = <><ErrorOutlineIcon sx={{ fontSize: 12, mr: 0.5 }} color="error" />{invalidMessage}</>
  } else if (isValid && !!validMessage) {
    helperText = <><CheckCircleOutlineIcon sx={{ fontSize: 12, mr: 0.5 }} color="success" />{validMessage}</>
  } else if (!!defaultMessage) {
    helperText = defaultMessage
  }

  return (
    <Autocomplete
      disablePortal
      sx={{ width: 300, ...(sx || {}) }}
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={isInvalid}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {isInvalid && (
                    <InputAdornment position="start">
                      <ErrorOutlineIcon color="error" />
                    </InputAdornment>
                  )}
                  {isValid && (
                    <InputAdornment position="start">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  )}
                </>
              )
            }
          }}
        />
      )}
      renderOption={(props, option, { inputValue }) => {
        const { key, ...optionProps } = props
        const label = getOptionLabel(option)
        const matches = match(label, inputValue, { insideWords: true })
        const parts = parse(label, matches)

        return (
          <li key={key} {...optionProps}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}>
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
      {...props}
    />
  )
}