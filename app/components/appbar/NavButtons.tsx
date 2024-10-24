import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const activeClass = "bg-white text-primary px-3 rounded-5"
const baseClass = "rounded-5"

export default function NavButtons() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleClick = (view: CurrentViewType) => {
    tcDispatch({
      type: ContextActions.CURRENT_VIEW_CHANGE,
      payload: view
    })
  }

  return (
    <ButtonGroup className="bg-primary rounded-5">
      <Button
        variant="primary"
        className={tcState.currentView == 'settings' ? activeClass : baseClass}
        size="sm"
        onClick={() => handleClick('settings')}>
        Setup
      </Button>
      <Button
        variant="primary"
        className={tcState.currentView == 'grid' ? activeClass : baseClass}
        size="sm"
        disabled={!tcState.grid.isLoaded}
        onClick={() => handleClick('grid')}>
        Table
      </Button>
      <Button
        variant="primary"
        className={tcState.currentView == 'plots' ? activeClass : baseClass}
        size="sm"
        disabled={!tcState.grid.isLoaded}
        onClick={() => handleClick('plots')}>
        Plots
      </Button>
    </ButtonGroup>
  )
}