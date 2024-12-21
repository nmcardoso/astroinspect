import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { Data, Layout } from 'plotly.js'
import { useMemo } from 'react'
import Stack from 'react-bootstrap/Stack'
import ColumnDropdown from './ColumnDropdown'
import { PlotlyComponent } from './PlotlyComponent'
import Button from '@mui/material/Button'
import { maskOutliersUnivariate } from '@/lib/statistics'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'




export default function Histogram() {
  const { tcState, tcDispatch } = useXTableConfig()
  const histConfig = tcState.plots.histogram

  const data = useMemo(() => {
    let x = []
    if (histConfig.column != '') {
      x = tcState.grid.data?.map((e: any) => e[`tab:${histConfig.column}`])
    }
    if (tcState.plots.histogram.filterOutliers && x && x.length > 0) {
      x = maskOutliersUnivariate(x)
    }

    const trace1 = {
      x: x,
      name: 'x density',
      marker: { color: 'royalblue' },
      type: 'histogram',
    }

    return [trace1]
  }, [
    tcState.grid.data,
    histConfig.column,
    tcState.plots.histogram.filterOutliers,
  ])

  const layout = {
    showlegend: false,
    autosize: true,
    height: 740,
    hovermode: 'closest',
    bargap: 0,
    uirevision: 'true',
    xaxis: {
      showgrid: false,
      zeroline: false,
      title: histConfig.column,
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      title: 'Count',
    },
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="horizontal" gap={2}>
        <ColumnDropdown
          label="column"
          value={histConfig.column}
          dispatchKey="column"
          dispatchType={ContextActions.HISTOGRAM_PLOT_SETUP} />

        <FormControlLabel
          label="Filter outliers"
          control={
            <Checkbox
              checked={tcState.plots.histogram.filterOutliers}
              onChange={(e) => tcDispatch({
                type: ContextActions.HISTOGRAM_PLOT_SETUP,
                payload: {
                  filterOutliers: e.target.checked
                }
              })} />
          } />

        <Button
          disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != 'histogram'}
          variant="contained"
          color="primary"
          onClick={() => {
            tcDispatch({
              type: ContextActions.PLOT_SETUP,
              payload: {
                inspectSelected: true
              }
            })

            tcDispatch({
              type: ContextActions.CURRENT_VIEW_CHANGE,
              payload: 'grid'
            })
          }}>
          Inspect Selected
        </Button>
      </Stack>


      {/* <ColumnDropdown
        value={scatterConfig.sizeColumn}
        label="size"
        dispatchKey="sizeColumn"
        dispatchType={ContextActions.SCATTER_PLOT_SETUP} /> */}
      <PlotlyComponent
        data={data as Data[]}
        layout={layout as Layout}
        config={{ responsive: true }}
        className="w-100"
        onSelected={(e) => {
          const idx = e?.points?.map((x) => x.pointIndex)
          if (idx && idx.length > 0) {
            tcDispatch({
              type: ContextActions.PLOT_SETUP,
              payload: {
                filterIndex: e?.points?.map((x) => x.pointIndex),
                filterView: 'histogram'
              }
            })
          }
        }}
      />
    </Box>
  )
}