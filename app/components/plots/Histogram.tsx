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
import Button from 'react-bootstrap/Button'
import { maskOutliersUnivariate } from '@/lib/statistics'




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
    <div className="container-fluid w-100 mt-2">
      <Form.Group as={Row} className="mb-3" controlId="x-axis">
        <Col sm={3}>
          <Stack direction="horizontal" gap={2}>
            <span className="fw-bold" style={{ wordBreak: 'keep-all' }}>
              x-axis:
            </span>
            <ColumnDropdown
              value={histConfig.column}
              dispatchKey="column"
              dispatchType={ContextActions.HISTOGRAM_PLOT_SETUP} />
          </Stack>
        </Col>


        <Col sm={3} className="align-content-center">
          <Stack direction="horizontal" gap={3}>
            <Form.Check
              type="switch"
              id="filter-outliers-histogram"
              label="Filter outliers"
              checked={tcState.plots.histogram.filterOutliers}
              onChange={(e) => tcDispatch({
                type: ContextActions.HISTOGRAM_PLOT_SETUP,
                payload: {
                  filterOutliers: e.target.checked
                }
              })} />

            <Button
              disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != 'histogram'}
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
    </div>
  )
}