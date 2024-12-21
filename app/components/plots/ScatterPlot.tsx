import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { Data, Layout } from 'plotly.js'
import { useMemo } from 'react'
import Stack from '@mui/material/Stack'
import ColumnDropdown from './ColumnDropdown'
import { PlotlyComponent } from './PlotlyComponent'
import Button from '@mui/material/Button'
import { maskOutliersBivariate, maskOutliersTrivariate } from '@/lib/statistics'
import SwapButton from './SwapButton'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'


export default function ScatterPlot() {
  const { tcState, tcDispatch } = useXTableConfig()
  const scatterConfig = tcState.plots.scatter

  const data = useMemo(() => {
    let color, colorbar = undefined
    let x, y = []
    if (scatterConfig.xColumn != '') {
      x = tcState.grid.data?.map((e: any) => e[`tab:${scatterConfig.xColumn}`])
    }
    if (scatterConfig.yColumn != '') {
      y = tcState.grid.data?.map((e: any) => e[`tab:${scatterConfig.yColumn}`])
    }
    if (scatterConfig.colorColumn != '') {
      color = tcState.grid.data?.map((e: any) => e[`tab:${scatterConfig.colorColumn}`])
      colorbar = { orientation: 'v' }
    }
    if (tcState.plots.scatter.filterOutliers && x && y && x.length == y.length && x.length > 0) {
      if (scatterConfig.colorColumn != '') {
        [x, y, color] = maskOutliersTrivariate(x, y, color)
      } else {
        [x, y] = maskOutliersBivariate(x, y)
      }
    }

    const trace1 = {
      x: x,
      y: y,
      mode: 'markers',
      name: 'points',
      marker: {
        color: color || 'royalblue',
        size: 3,
        opacity: 0.7,
        colorbar: colorbar,
      },
      type: 'scatter'
    }

    // var trace2 = {
    //   x: x,
    //   y: y,
    //   name: 'density',
    //   ncontours: 20,
    //   colorscale: 'Hot',
    //   reversescale: true,
    //   showscale: false,
    //   type: 'histogram2dcontour'
    // }

    const trace3 = {
      x: x,
      name: 'x density',
      marker: { color: 'royalblue' },
      yaxis: 'y2',
      type: 'histogram'
    }

    const trace4 = {
      y: y,
      name: 'y density',
      marker: { color: 'royalblue' },
      xaxis: 'x2',
      type: 'histogram'
    }

    return [trace1, trace3, trace4]
  }, [
    tcState.grid.data,
    scatterConfig.xColumn,
    scatterConfig.yColumn,
    scatterConfig.colorColumn,
    tcState.plots.scatter.filterOutliers,
  ])

  const layout = {
    showlegend: false,
    autosize: true,
    height: 740,
    margin: { t: 50 },
    hovermode: 'closest',
    bargap: 0,
    uirevision: 'true',
    xaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false,
      title: scatterConfig.xColumn,
    },
    yaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false,
      title: scatterConfig.yColumn,
    },
    xaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    },
    yaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" gap={2} sx={{ alignItems: 'center' }}>
        <ColumnDropdown
          label="x axis"
          value={scatterConfig.xColumn}
          dispatchKey="xColumn"
          dispatchType={ContextActions.SCATTER_PLOT_SETUP} />

        <SwapButton
          onClick={() => tcDispatch({
            type: ContextActions.SCATTER_PLOT_SETUP,
            payload: {
              xColumn: scatterConfig.yColumn,
              yColumn: scatterConfig.xColumn,
            }
          })} />

        <ColumnDropdown
          label='y axis'
          value={scatterConfig.yColumn}
          dispatchKey="yColumn"
          dispatchType={ContextActions.SCATTER_PLOT_SETUP} />

        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />

        <ColumnDropdown
          label="color"
          value={scatterConfig.colorColumn}
          dispatchKey="colorColumn"
          dispatchType={ContextActions.SCATTER_PLOT_SETUP} />

        <FormControlLabel
          label="Filter outliers"
          control={
            <Checkbox
              checked={tcState.plots.scatter.filterOutliers}
              onChange={(e) => tcDispatch({
                type: ContextActions.SCATTER_PLOT_SETUP,
                payload: {
                  filterOutliers: e.target.checked
                }
              })} />
          } />

        <Button
          disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != 'scatter'}
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
                filterIndex: idx,
                filterView: 'scatter'
              }
            })
          }
        }}
      />
    </Box>
  )
}