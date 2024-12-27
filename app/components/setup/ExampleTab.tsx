import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import Button from '@mui/material/Button'
import Emitter from '@/lib/Emitter'
import { ContextActions } from '@/interfaces/contextActions'
import { getTableReader } from '@/lib/io'
import TableHelper from '@/lib/TableHelper'
import { cloneDeep } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import FileOpenIcon from '@mui/icons-material/FileOpen'

const LoadExemple = ({ name, url }: { name: string, url: string }) => {
  const { tcState, tcDispatch } = useXTableConfig()
  const router = useRouter()

  const handleSubmit = useCallback(async () => {
    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        type: 'remote',
        state: 'loading',
      }
    })

    const summary = await getTableReader(url)?.getTableSummary()

    if (!!summary) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          type: 'remote',
          columns: summary.columns,
          selectedColumnsId: [summary.raIndex, summary.decIndex],
          raIndex: summary.raIndex,
          decIndex: summary.decIndex,
          raCol: summary.raCol,
          decCol: summary.decCol,
          dataTypes: summary.dataTypes,
          // state: summary.positionFound ? 'success' : 'positionNotFound',
          url,
        }
      })
    }

    let data = await getTableReader(url)?.read()

    const { colDef, initVal } = TableHelper.getColDefs(tcState)

    data = data?.map((e, i, _) => ({ ...e, ...initVal, 'ai:id': String(i + 1) }))

    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: {
        data: data,
        colDef: colDef,
        isLoaded: true,
        currColConfigs: cloneDeep(tcState.cols),
        currTable: { ...tcState.table },
        api: undefined,
      }
    })

    // tcDispatch({
    //   type: ContextActions.USER_FILE_INPUT,
    //   payload: {
    //     state: 'success'
    //   }
    // })

    router.push('/table')
  }, [tcState, tcDispatch, router])

  return (
    <Box>
      <Button startIcon={<FileOpenIcon />} onClick={handleSubmit}>
        {name}
      </Button>
    </Box>
  )
}


export default function ExampleTab() {
  return (
    <Box>
      <Typography sx={{ mb: 2 }}>
        The only requirement imposed by AstroInspect is that your table needs
        the RA and DEC columns, both in degrees, indicating the position of
        each object. It is from these columns that AstroInspect retrieves all
        the object information. However, you can do a quick test of this
        application using some of the example tables provided below. <b>Click
          on the desired table below</b> to open it in AstroInspect.
      </Typography>

      <LoadExemple
        name="GalaxyZoo_small.csv (250 rows, 11.5kB)"
        url="https://astroinspect.natanael.net/examples/galaxyzoo-small-sample.csv" />
      <LoadExemple
        name="GalaxyZoo_medium.csv (2,500 rows, 113.8kB)"
        url="https://astroinspect.natanael.net/examples/galaxyzoo-medium-sample.csv" />
      <LoadExemple
        name="GalaxyZoo_big.parquet (250,000 rows, 6.8MB)"
        url="https://astroinspect.natanael.net/examples/galaxyzoo-big-sample.parquet" />
    </Box>
  )
}