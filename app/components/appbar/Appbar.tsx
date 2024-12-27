import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Logo from '@/components/appbar/Logo'
import SdssCatalogButton from '@/components/appbar/SdssCatalogButton'
import SedButton from '@/components/appbar/SedButton'
import ImageButton from '@/components/appbar/ImageButton'
import ClassificationButton from '@/components/appbar/ClassificationButton'
import ColumnsButton from '@/components/appbar/ColumnsButton'
import DownloadTableButton from '@/components/appbar/DownloadTableButton'
import CitationButton from '@/components/appbar/CitationButton'
import ConfigButton from '@/components/appbar/ConfigButton'
import SAMPButton from '@/components/appbar/SAMPButton'
import TableButton from '@/components/appbar/TableButton'
import PlotsButton from '@/components/appbar/PlotsButton'
import SkyviewerButton from '@/components/appbar/SkyviewerButton'
import FilenameText from '@/components/appbar/FilenameText'
import NavButtons from './NavButtons'
import { usePathname, useRouter } from 'next/navigation'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlotFilterButton from './PlotFilterButton'


function MinimalAppbar() {
  const { tcState } = useXTableConfig()
  const router = useRouter()
  return (
    <AppBar position="static" color="inherit" variant="outlined">
      <Toolbar variant="dense">
        {
          tcState.grid.isLoaded && tcState.table.state == 'success' && (
            <Button
              variant="contained"
              onClick={() => router.push('/table')}
              startIcon={<ArrowBackIcon />}
              size="small">
              Back to table
            </Button>
          )
        }
        <Stack
          direction="row"
          spacing={2.5}
          sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
        </Stack>
        <SAMPButton />
        <CitationButton />
        <ConfigButton />
      </Toolbar>
    </AppBar>
  )
}


function DefaultAppbar() {
  return (
    <AppBar position="static" color="inherit" variant="outlined">
      <Toolbar variant="dense">
        <Stack direction="row" spacing={2.5} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Logo />
          <FilenameText />
        </Stack>

        <TableButton />
        <PlotsButton />
        <SkyviewerButton />
        {/* <NavButtons /> */}

        <Divider orientation="vertical" variant="middle" flexItem />

        <ColumnsButton />
        <ClassificationButton />
        <ImageButton />
        <SedButton />
        <SdssCatalogButton />

        <Divider orientation="vertical" variant="middle" flexItem />

        <PlotFilterButton />
        <DownloadTableButton />
        <SAMPButton />
        <CitationButton />
        <ConfigButton />
      </Toolbar>
    </AppBar>
  )
}


export default function Appbar() {
  const path = usePathname()

  return (
    <>
      {
        path == '/' ? <MinimalAppbar /> : <DefaultAppbar />
      }
    </>
  )
}