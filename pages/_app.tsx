import LoadInitialState from '@/components/common/LoadInitialState'
import { XTableConfigProvider } from '@/contexts/XTableConfigContext'
import '@/styles/globals.css'
import BarChartIcon from '@mui/icons-material/BarChart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FilterDramaIcon from '@mui/icons-material/FilterDrama'
import GridOnIcon from '@mui/icons-material/GridOn'
import LanguageIcon from '@mui/icons-material/Language'
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined'
import SsidChartIcon from '@mui/icons-material/SsidChart'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import createTheme from '@mui/material/styles/createTheme'
import type { Navigation } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { AppProvider } from '@toolpad/core/nextjs'
import { PageContainer } from '@toolpad/core/PageContainer'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { GoogleAnalytics, event, usePageViews } from 'nextjs-google-analytics'
import * as React from 'react'
import { GA_MEASUREMENT_ID } from '../app/lib/gtag'

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Data',
  },
  {
    segment: '',
    title: 'Table',
    icon: <GridOnIcon />,
  },
  {
    segment: 'plots/',
    title: 'Plots',
    icon: <BarChartIcon />,
  },
  {
    segment: 'skyviewer/',
    title: 'Sky viewer',
    icon: <LanguageIcon />,
  },

  {
    kind: 'divider',
  },

  {
    kind: 'header',
    title: 'Setup'
  },
  {
    segment: 'load/',
    title: 'Load table',
    icon: <FileUploadIcon />,
  },
  {
    segment: 'classifications/',
    title: 'Classifications',
    icon: <ChecklistIcon />,
  },
  {
    segment: 'sdss-catalog/',
    title: 'SDSS catalog',
    icon: <FilterDramaIcon />,
  },
  {
    segment: 'images/',
    title: 'Images',
    icon: <PhotoOutlinedIcon />,
  },
  {
    segment: 'sed/',
    title: 'SEDs',
    icon: <SsidChartIcon />,
  },
];

const BRANDING = {
  title: 'AstroInspect',
};


export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(
    name,
    {
      category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
      value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
      label: id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate.
      userId: GA_MEASUREMENT_ID
    },
  )
}




function MyApp({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   navigator.serviceWorker
  //     .register(getBaseURL() + 'sw_v2.js', {
  //       updateViaCache: 'none'
  //     })
  //     .then((registration) =>
  //       console.log(
  //         'Service Worker registration successful with scope: ',
  //         registration.scope
  //       )
  //     )
  //     .catch((err) => console.log('Service Worker registration failed: ', err))
  // }, [])
  usePageViews({ gaMeasurementId: GA_MEASUREMENT_ID })

  // const theme = createTheme({
  //   components: {
  //     MuiToolbar: {
  //       styleOverrides: {
  //         regular: {
  //           padding: 0,
  //           height: 48,
  //           maxHeight: 48,
  //         }
  //       }
  //     }
  //   },
  // })

  return (
    <XTableConfigProvider>
      <LoadInitialState />
      <AppCacheProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌌</text></svg>" />
          <title>AstroInspect</title>
        </Head>
        <AppProvider navigation={NAVIGATION} branding={BRANDING}>
          <DashboardLayout defaultSidebarCollapsed={true} sidebarExpandedWidth={250}>
            <GoogleAnalytics gaMeasurementId={GA_MEASUREMENT_ID} />
            <Component {...pageProps} />
          </DashboardLayout>
        </AppProvider>
      </AppCacheProvider>
    </XTableConfigProvider>
  )
}

export default MyApp
