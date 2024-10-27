import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Nav from 'react-bootstrap/Nav'
import ScatterPlot from './ScatterPlot'
import ColorPlot from './ColorPlot'
import { useEffect } from 'react'
import Histogram from './Histogram'
import Aladin from './Aladin'

export default function Plots() {
  const { tcState, tcDispatch } = useXTableConfig()

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <Nav
        justify
        fill
        variant="underline"
        defaultActiveKey={tcState.plots.currentView}
        className="mt-1"
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
        <Nav.Item>
          <Nav.Link eventKey="aladin">Aladin</Nav.Link>
        </Nav.Item>
      </Nav>

      {tcState.plots.currentView == 'scatter' && <ScatterPlot />}
      {tcState.plots.currentView == 'color' && <ColorPlot />}
      {tcState.plots.currentView == 'histogram' && <Histogram />}
      {tcState.plots.currentView == 'aladin' && <Aladin />}
    </div>
  )
}