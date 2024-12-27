import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'


type InspectSelectedButtonProps = {
  view: PlotsCurrentViewType
}


export default function InspectSelectedButton({ view }: InspectSelectedButtonProps) {
  const { tcState, tcDispatch } = useXTableConfig()
  const router = useRouter()

  return (
    <Button
      disabled={tcState.plots.filterIndex.length == 0 || tcState.plots.filterView != view}
      variant="contained"
      color="primary"
      onClick={() => {
        tcDispatch({
          type: ContextActions.PLOT_SETUP,
          payload: {
            inspectSelected: true
          }
        })
        router.push('/table')
      }}>
      Inspect Selected
    </Button>
  )
}