import Appbar from '@/components/appbar/Appbar.old'
import ConfigForm from '@/components/setup/ConfigForm'
import AIGrid from '@/components/table/AIGrid'
import { useXTableConfig } from './contexts/XTableConfigContext'
import Plots from './components/plots/Plots'
import { createTheme } from '@mui/material/styles';



const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-ag-theme-mode',
  },
  colorSchemes: { light: true, dark: true },
});


export default function App() {
  const { tcState } = useXTableConfig()
  return (
    <>
      <div className="d-flex flex-column h-100">
        <Appbar />
        <div className="flex-grow-1">
          {tcState.currentView == 'settings' && <ConfigForm />}
          {tcState.currentView == 'grid' && <AIGrid />}
          {tcState.currentView == 'plots' && <Plots />}
        </div>
      </div>
    </>
  )
}