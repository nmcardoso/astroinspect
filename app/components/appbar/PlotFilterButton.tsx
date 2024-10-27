import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md'



const disablePopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Disable plot filter</Popover.Header>
    <Popover.Body>
      Click to <b>disable</b> the table filter by plot selection and display all table rows
    </Popover.Body>
  </Popover>
)


const enablePopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Enable plot filter</Popover.Header>
    <Popover.Body>
      Click to <b>enable</b> the table filter by plot selection and display only the selected rows
    </Popover.Body>
  </Popover>
)


export default function PlotFilterButton() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleClick = () => {
    tcDispatch({
      type: ContextActions.PLOT_SETUP,
      payload: {
        inspectSelected: !tcState.plots.inspectSelected,
      }
    })
  }

  return (
    <>
      {tcState.grid.isLoaded && tcState.plots.inspectSelected && tcState.plots.filterIndex && tcState.plots.filterIndex.length > 0 && (
        <OverlayTrigger trigger="hover" placement="bottom" overlay={disablePopover}>
        <Button
          variant="primary"
          className="d-inline-flex align-items-center ms-2"
          onClick={() => handleClick()}
          size="sm">
          <MdFilterAlt size={19} className="" />
        </Button>
        </OverlayTrigger>
      )}

      {tcState.grid.isLoaded && !tcState.plots.inspectSelected && tcState.plots.filterIndex && tcState.plots.filterIndex.length > 0 && (
        <OverlayTrigger trigger="hover" placement="bottom" overlay={enablePopover}>
        <Button
          variant="outline-primary"
          className="d-inline-flex align-items-center ms-2"
          onClick={() => handleClick()}
          size="sm">
          <MdFilterAltOff size={19} className="" />
        </Button>
        </OverlayTrigger>
      )}
    </>
  )
}