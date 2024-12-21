import Appbar from '@/components/appbar/Appbar'
import ConfigForm from '@/components/setup/ConfigForm'
import AIGrid from '@/components/table/AIGrid'
import { useXTableConfig } from './contexts/XTableConfigContext'
import Plots from './components/plots/Plots'




import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';




const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
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