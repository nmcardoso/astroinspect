import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import ScatterPlot from './ScatterPlot'
import ColorPlot from './ColorPlot'
import Histogram from './Histogram'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { SyntheticEvent } from 'react'

export default function Plots() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    tcDispatch({
      type: ContextActions.PLOT_VIEW_CHANGE,
      payload: newValue
    })
  }

  return (
    <TabContext value={tcState.plots.currentView}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', height: '100%' }}>
        <TabList onChange={handleChange} aria-label="data visualization">
          <Tab label="Scatter plot" value="scatter" />
          <Tab label="Color-color diagram" value="color" />
          <Tab label="Histogram" value="histogram" />
        </TabList>
      </Box>
      <TabPanel value="scatter"><ScatterPlot /></TabPanel>
      <TabPanel value="color"><ColorPlot /></TabPanel>
      <TabPanel value="histogram"><Histogram /></TabPanel>
    </TabContext>
  )
}