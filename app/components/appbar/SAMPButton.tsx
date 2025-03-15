import CellTowerIcon from '@mui/icons-material/CellTower'
import AppbarButton from './AppbarButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSAMP } from '@/contexts/SAMPContext'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { getTableReader } from '@/lib/io'
import TableHelper from '@/lib/TableHelper'
import cloneDeep from 'lodash/cloneDeep'
import { useRouter } from 'next/navigation'


export default function SAMPButton() {
  const {isConnected, connect, disconnect, sampUrl} = useSAMP()
  const {tcState, tcDispatch} = useXTableConfig()
  const router = useRouter()
  const handleClick = useCallback(() => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }, [isConnected])


  const handleSubmit = useCallback(async () => {  
      const summary = await getTableReader(sampUrl)?.getTableSummary()
  
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
            state: summary.positionFound ? 'success' : 'positionNotFound',
            url: sampUrl,
          }
        })
      }
  
      let data = await getTableReader(sampUrl)?.read()
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
  
      tcDispatch({
        type: ContextActions.PLOT_SETUP,
        payload: {
          inspectSelected: false,
          filterIndex: [],
          filterView: undefined,
        }
      })
  
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          state: 'success'
        }
      })
  
      router.push('/table')
    }, [tcState, tcDispatch, router, sampUrl])


  useEffect(() => {
    if (!!sampUrl) {
      handleSubmit()
    }
  }, [sampUrl])


  return (
    <AppbarButton
      icon={<CellTowerIcon />}
      tooltip={isConnected ? "Disconnect from SAMP hub" : "Connect to SAMP hub"}
      onClick={handleClick}
      color={isConnected ? 'primary' : 'inherit'} />
  )
}