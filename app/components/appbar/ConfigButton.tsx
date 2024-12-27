import SettingsIcon from '@mui/icons-material/Settings'
import AppbarButton from './AppbarButton'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { useColorMode } from '@/contexts/ColorMode'
import TableHelper from '@/lib/TableHelper'
import DisplaySettingsTab from '../setup/DisplaySettingsTab'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey'
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt'
import AddIcon from '@mui/icons-material/Add'


const rows = [
  {
    shortcut: <><kbd>Ctrl</kbd> + <kbd>C</kbd> or <br /> <kbd><KeyboardCommandKeyIcon sx={{fontSize: 14}} /></kbd> + <kbd>C</kbd></>,
    description: "Copy the value of the selected cell to clipboard"
  },
  {
    shortcut: <><kbd>Ctrl</kbd> + <kbd>X</kbd> or <br /> <kbd><KeyboardCommandKeyIcon sx={{fontSize: 14}} /></kbd> + <kbd>X</kbd></>,
    description: "Copy the position (RA and Dec) of the selected object to clipboard"
  },
]

function KeyboardShortcutsModal() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shortcut</TableCell>
            <TableCell align="left">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.shortcut}
              </TableCell>
              <TableCell align="left">{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}



export default function ConfigButton() {
  const { tcState, tcDispatch } = useXTableConfig()
  const router = useRouter()
  const theme = useTheme()
  const colorMode = useColorMode()

  const handleEditToggle = useCallback(() => {
    const state = { ...tcState }
    state.grid.editable = !state.grid.editable
    const { colDef } = TableHelper.getColDefs(state)
    // tcState.grid.api.setGridOption('columnDefs', colDef)
    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: { editable: state.grid.editable, colDef }
    })
  }, [tcState])

  // const handleToggle = () => {
  //   const state = { ...tcState }
  //   state.grid.editable = !isEditable
  //   const { colDef } = TableHelper.getColDefs(state)
  //   tcState.grid.api.setGridOption('columnDefs', colDef)
  //   setEditable(!isEditable)
  // }

  const handleReticleToggle = useCallback(() => {
    tcDispatch({
      type: ContextActions.UI_SETUP,
      payload: { showReticle: !tcState.ui.showReticle }
    })
  }, [tcState.ui.showReticle, tcDispatch])

  const menu = useMemo(() => {
    return [
      {
        title: 'Keyboard shortcuts',
        modal: <KeyboardShortcutsModal />,
        left: <KeyboardAltIcon />,
        modalTitle: 'Keyboard shortcuts',
        modalIcon: <KeyboardAltIcon />,
      },
      {
        title: 'Display settings',
        modal: <DisplaySettingsTab />,
        left: <DisplaySettingsIcon />,
        modalTitle: 'Display settings',
        modalIcon: <DisplaySettingsIcon />,
      },
      {
        divider: true,
      },
      {
        title: tcState.ui.showReticle ? 'Hide reticle' : 'Show reticle',
        onClick: handleReticleToggle,
        left: <AddIcon />,
      },
      {
        title: tcState.grid.editable ? 'Disable edit' : 'Enable edit',
        onClick: handleEditToggle,
        left: <>{tcState.grid.editable ? <EditOffIcon /> : <EditIcon />}</>
      },
      {
        title: theme.palette.mode === 'light' ? 'Dark mode' : 'Light mode',
        onClick: colorMode.toggleColorMode,
        left: <>{theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</>,
      },
    ]
  }, [theme.palette.mode, tcState.grid.editable, tcState.ui.showReticle])

  return (
    <AppbarButton
      icon={<SettingsIcon />}
      tooltip="Settings"
      menu={menu}
      modalWidth={560}
      menuWidth={240} />
  )
}