import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import AppbarButton from './AppbarButton'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'



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
      {tcState.plots.inspectSelected && tcState.plots.filterIndex && tcState.plots.filterIndex.length > 0 && (
        <AppbarButton
          color="primary"
          icon={<FilterAltIcon />}
          tooltip="Disable filter"
          onClick={handleClick} />
      )}

      {!tcState.plots.inspectSelected && tcState.plots.filterIndex && tcState.plots.filterIndex.length > 0 && (
        <AppbarButton
          icon={<FilterAltOffIcon />}
          tooltip="Enable filter"
          onClick={handleClick} />
      )}
    </>
  )
}