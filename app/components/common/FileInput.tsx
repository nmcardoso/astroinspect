import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { ChangeEventHandler, RefObject, useRef, useState } from "react"
import { SxProps } from "@mui/material"
import { Theme } from "@mui/system"

type PropsType = {
  filename?: string
  width?: number
  inputRef?: RefObject<HTMLInputElement | null>
  onChange?: ChangeEventHandler<HTMLInputElement>
  sx?: SxProps<Theme>
}

export default function FileInput({ filename, width, inputRef, onChange, sx }: PropsType) {
  const [filenameInt, setFilenameInt] = useState<string | undefined>(undefined)

  filename = filename || filenameInt
  
  const defaultRef = useRef<HTMLInputElement>(null)
  if (!inputRef) {
    inputRef = defaultRef
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilenameInt(e.target.files?.[0].name)
    onChange!(e)
  }

  return (
    <Paper
      variant="outlined"
      className="cursor-pointer"
      onClick={handleClick}
      sx={{
        width,
        px: 2,
        py: 1.5,
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'action.disabled',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx
      }}>
      <input
        hidden
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleChange} />
      <Typography sx={{ textOverflow: 'ellipsis' }}>
        {
          filename ? (
            filename
          ) : (
            <i>No file selected</i>
          )
        }
      </Typography>
      <Button startIcon={<FileUploadIcon />} variant="contained">
        Upload
      </Button>
    </Paper>
  )
}