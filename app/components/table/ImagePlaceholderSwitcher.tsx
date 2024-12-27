import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import Box from '@mui/material/Box'
import React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Typography } from '@mui/material'

const QueuedPlaceholder = () =>
  <Box
    sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <AccessTimeIcon fontSize="small" color="inherit" />
    <Typography variant="caption" sx={{ ml: 0.5 }} color="inherit">Queued</Typography>
  </Box>


const LoadingPlaceholder = () =>
  <Box
    sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <DownloadIcon fontSize="small" color="primary" />
    <Typography variant="caption" sx={{ ml: 0.5 }} color="primary">Downloading</Typography>
  </Box>

const ErrorPlaceholder = () =>
  <Box
    sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ErrorOutlineIcon fontSize="small" color="warning" />
    <Typography variant="caption" sx={{ ml: 0.5 }} color="warning">Not Found</Typography>
  </Box>


export default function ImagePlaceholderSwitcher({ src, children }: { src: string | symbol, children: React.ReactNode }) {
  if (src === queuedState) {
    return <QueuedPlaceholder />
  } else if (src === loadingState) {
    return <LoadingPlaceholder />
  } else if (src === loadErrorState) {
    return <ErrorPlaceholder />
  } else {
    return children
  }
}