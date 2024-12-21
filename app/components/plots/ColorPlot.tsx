import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { Data, Layout } from 'plotly.js'
import { useMemo } from 'react'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import ColumnDropdown from './ColumnDropdown'
import { PlotlyComponent } from './PlotlyComponent'
import { maskOutliersBivariate, maskOutliersTrivariate } from '@/lib/statistics'
import Button from '@mui/material/Button'
import SwapButton from './SwapButton'
import Box from '@mui/material/Box'
import  Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'


export default function ColorPlot() {
  const { tcState, tcDispatch } = useXTableConfig()
  const colorPlotConfig = tcState.plots.color

  const colors = useMemo(() => {
    let x, y = []
    if (colorPlotConfig.xColumn1 != '' && colorPlotConfig.xColumn2 != '') {
      x = tcState.grid.data?.map((e: any) => (
        e[`tab:${colorPlotConfig.xColumn1}`] - e[`tab:${colorPlotConfig.xColumn2}`])
      )
    }
    if (colorPlotConfig.yColumn1 != '' && colorPlotConfig.yColumn2 != '') {
      y = tcState.grid.data?.map((e: any) => (
        e[`tab:${colorPlotConfig.yColumn1}`] - e[`tab:${colorPlotConfig.yColumn2}`])
      )
    }
    return [x, y]
  }, [
    tcState.grid.data,
    colorPlotConfig.xColumn1,
    colorPlotConfig.xColumn2,
    colorPlotConfig.yColumn1,
    colorPlotConfig.yColumn2,
  ])

  const data = useMemo(() => {
    let color, colorbar = undefined
    let [x, y] = colors

    if (colorPlotConfig.colorColumn != '') {
      color = tcState.grid.data?.map((e: any) => e[`tab:${colorPlotConfig.colorColumn}`])
      colorbar = { orientation: 'v' }
    }
    if (tcState.plots.color.filterOutliers && x && y && x.length == y.length && x.length > 0) {
      if (colorPlotConfig.colorColumn != '') {
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

    // const trace2 = {
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
    colors,
    tcState.plots.color.filterOutliers,
    colorPlotConfig.colorColumn,
    tcState.grid.data
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
      title: `${colorPlotConfig.xColumn1} - ${colorPlotConfig.xColumn2}`,
    },
    yaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false,
      title: `${colorPlotConfig.yColumn1} - ${colorPlotConfig.yColumn2}`,
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
      <Stack direction="horizontal" gap={1}>
        <ColumnDropdown
          label="x axis"
          value={colorPlotConfig.xColumn1}
          dispatchKey="xColumn1"
          dispatchType={ContextActions.COLOR_PLOT_SETUP} />

        <span className="fw-bold">&mdash;</span>

        <ColumnDropdown
          label="x axis"
          value={colorPlotConfig.xColumn2}
          dispatchKey="xColumn2"
          dispatchType={ContextActions.COLOR_PLOT_SETUP} />

        <SwapButton
          onClick={() => tcDispatch({
            type: ContextActions.COLOR_PLOT_SETUP,
            payload: {
              xColumn1: colorPlotConfig.yColumn1,
              yColumn1: colorPlotConfig.xColumn1,
              xColumn2: colorPlotConfig.yColumn2,
              yColumn2: colorPlotConfig.xColumn2,
            }
          })} />

        <ColumnDropdown
          label="y axis"
          value={colorPlotConfig.yColumn1}
          dispatchKey="yColumn1"
          dispatchType={ContextActions.COLOR_PLOT_SETUP} />

        <span className="mx-2 fw-bold">&mdash;</span>

        <ColumnDropdown
          label="y axis"
          value={colorPlotConfig.yColumn2}
          dispatchKey="yColumn2"
          dispatchType={ContextActions.COLOR_PLOT_SETUP} />


        <Divider orientation="vertical" variant="middle" flexItem sx={{mx: 1}} />

        <ColumnDropdown
          label="color"
          value={colorPlotConfig.colorColumn}
          dispatchKey="colorColumn"
          dispatchType={ContextActions.COLOR_PLOT_SETUP} />

        <FormControlLabel
          label="Filter outliers"
          control={
            <Checkbox
              checked={tcState.plots.color.filterOutliers}
              onChange={(e) => tcDispatch({
                type: ContextActions.COLOR_PLOT_SETUP,
                payload: {
                  filterOutliers: e.target.checked
                }
              })} />
          } />

        <Button
          disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != 'color'}
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
        dispatchType={ContextActions.COLOR_PLOT_SETUP} /> */}

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
                filterView: 'color'
              }
            })
          }
        }}
      />
    </Box>
  )
}