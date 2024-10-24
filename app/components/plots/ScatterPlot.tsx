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

    const trace1 = {
      x: x,
      y: y,
      mode: 'markers',
      name: 'points',
      marker: {
        color: color || 'tab:blue',
        size: 2,
        opacity: 0.5,
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
    tcState.grid.data,
    scatterConfig.xColumn,
    scatterConfig.yColumn,
    scatterConfig.colorColumn
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
    <>
      <Form.Group as={Row} className="mb-3" controlId="x-axis">
        <Col sm={3}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold" style={{ wordBreak: 'keep-all' }}>
              x-axis:
            </span>
            <ColumnDropdown
              value={scatterConfig.xColumn}
              dispatchKey="xColumn"
              dispatchType={ContextActions.SCATTER_PLOT_SETUP} />
          </Stack>
        </Col>


        <Col sm={3}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold ms-lg-2" style={{ wordBreak: 'keep-all' }}>
              y-axis:
            </span>
            <ColumnDropdown
              value={scatterConfig.yColumn}
              dispatchKey="yColumn"
              dispatchType={ContextActions.SCATTER_PLOT_SETUP} />
          </Stack>
        </Col>


        <Col sm={3}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold ms-lg-2" style={{ wordBreak: 'keep-all' }}>
              color:
            </span>
            <ColumnDropdown
              value={scatterConfig.colorColumn}
              dispatchKey="colorColumn"
              dispatchType={ContextActions.SCATTER_PLOT_SETUP} />
          </Stack>
        </Col>


        <Col sm={3} className="align-content-center">
          <Form.Check
            type="switch"
            id="filter-outliers"
            label="Filter outliers"
            checked={tcState.plots.scatter.filterOutliers}
            onChange={(e) => tcDispatch({
              type: ContextActions.SCATTER_PLOT_SETUP,
              payload: {
                filterOutliers: e.target.checked
              }
            })} />
        </Col>

      </Form.Group>



      {/* <ColumnDropdown
        value={scatterConfig.sizeColumn}
        label="size"
        dispatchKey="sizeColumn"
        dispatchType={ContextActions.SCATTER_PLOT_SETUP} /> */}
      <PlotlyComponent
        style={{ width: '100%', height: '100%' }}
        data={data as Data[]}
        layout={layout as Layout}
        config={{ responsive: true }}
      />
    </>
  )
}