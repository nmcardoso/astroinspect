import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import dynamic from 'next/dynamic'
import { Data, Layout } from 'plotly.js'
import { useMemo } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import ColumnDropdown from './ColumnDropdown'
import { PlotlyComponent } from './PlotlyComponent'
import { maskOutliersBivariate, maskOutliersTrivariate } from '@/lib/statistics'
import Button from 'react-bootstrap/Button'


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
        color: color || 'tab:blue',
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
      marker: { color: 'tab:blue' },
      yaxis: 'y2',
      type: 'histogram'
    }

    const trace4 = {
      y: y,
      name: 'y density',
      marker: { color: 'tab:blue' },
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
    <div className="container-fluid w-100 mt-2">
      <Form.Group as={Row} className="mb-3" controlId="x-axis">
        <Col sm={6}>

          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold" style={{ wordBreak: 'keep-all' }}>
              x-axis:
            </span>
            <ColumnDropdown
              value={colorPlotConfig.xColumn1}
              dispatchKey="xColumn1"
              dispatchType={ContextActions.COLOR_PLOT_SETUP} />
            <span className="fw-bold">&mdash;</span>
            <ColumnDropdown
              value={colorPlotConfig.xColumn2}
              dispatchKey="xColumn2"
              dispatchType={ContextActions.COLOR_PLOT_SETUP} />
          </Stack>
        </Col>


        <Col sm={6}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold ms-lg-2" style={{ wordBreak: 'keep-all' }}>
              y-axis:
            </span>
            <ColumnDropdown
              value={colorPlotConfig.yColumn1}
              dispatchKey="yColumn1"
              dispatchType={ContextActions.COLOR_PLOT_SETUP} />
            <span className="mx-2 fw-bold">&mdash;</span>
            <ColumnDropdown
              value={colorPlotConfig.yColumn2}
              dispatchKey="yColumn2"
              dispatchType={ContextActions.COLOR_PLOT_SETUP} />
          </Stack>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="x-axis">
        <Col sm={4}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold ms-lg-2" style={{ wordBreak: 'keep-all' }}>
              color:
            </span>
            <ColumnDropdown
              value={colorPlotConfig.colorColumn}
              dispatchKey="colorColumn"
              dispatchType={ContextActions.COLOR_PLOT_SETUP} />
          </Stack>
        </Col>

        <Col sm={4} className="align-content-center ms-2">
          <Stack direction="horizontal" gap={3}>
            <Form.Check
              type="switch"
              id="filter-outliers"
              label="Filter outliers"
              checked={tcState.plots.color.filterOutliers}
              onChange={(e) => tcDispatch({
                type: ContextActions.COLOR_PLOT_SETUP,
                payload: {
                  filterOutliers: e.target.checked
                }
              })} />

            <Button
              disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != 'color'}
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
        </Col>
      </Form.Group>


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
    </div>
  )
}