import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Nav from 'react-bootstrap/Nav'
import ScatterPlot from './ScatterPlot'
import ColorPlot from './ColorPlot'

export default function Plots() {
  const { tcState, tcDispatch } = useXTableConfig()

  return (
    <div className="container w-100">
      <Nav
        justify
        fill
        variant="underline"
        defaultActiveKey={tcState.plots.currentView}
        className="mb-3 mt-1"
        onSelect={(eventKey) => {
          tcDispatch({
            type: ContextActions.PLOT_VIEW_CHANGE,
            payload: eventKey
          })
        }}>
        <Nav.Item>
          <Nav.Link eventKey="scatter">Scatter plot</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="color">Color-color diagram</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="histogram">Histogram</Nav.Link>
        </Nav.Item>
      </Nav>

      {tcState.plots.currentView == 'scatter' && <ScatterPlot />}
      {tcState.plots.currentView == 'color' && <ColorPlot />}
    </div>
  )
}