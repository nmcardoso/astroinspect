import CellTowerIcon from '@mui/icons-material/CellTower'
import AppbarButton from './AppbarButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSAMP } from '@/contexts/SAMPContext'


export default function SAMPButton() {
  const {isConnected, connect, disconnect} = useSAMP()
  const handleClick = useCallback(() => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }, [isConnected])


  return (
    <AppbarButton
      icon={<CellTowerIcon />}
      tooltip={isConnected ? "Disconnect from SAMP hub" : "Connect to SAMP hub"}
      onClick={handleClick}
      color={isConnected ? 'primary' : 'inherit'} />
  )
}