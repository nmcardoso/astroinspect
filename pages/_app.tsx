import LoadInitialState from '@/components/common/LoadInitialState'
import { XTableConfigProvider } from '@/contexts/XTableConfigContext'
import '@/styles/globals.css'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import createTheme from '@mui/material/styles/createTheme'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { GoogleAnalytics, event, usePageViews } from 'nextjs-google-analytics'
import { GA_MEASUREMENT_ID } from '../app/lib/gtag'
import Appbar from '@/components/appbar/Appbar'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ToggleColorMode } from '@/contexts/ColorMode'
import { NotificationsProvider } from '@/contexts/NotificationsContext'
import { SAMPProvider } from '@/contexts/SAMPContext'


export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(
    name,
    {
      category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
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

  return (
    <XTableConfigProvider>
      <ToggleColorMode>
        <CssBaseline />
        <LoadInitialState />
        <AppCacheProvider>
          <NotificationsProvider>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <link rel="icon" type="image/x-icon" href="/favicon.ico" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon_16.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon_32.png" />
              <link rel="icon" type="image/png" sizes="64x64" href="/favicon_64.png" />
              <link rel="icon" type="image/png" sizes="128x128" href="/favicon_128.png" />
              <link rel="icon" type="image/png" sizes="180x180" href="/favicon_180.png" />
              <link rel="icon" type="image/png" sizes="192x192" href="/favicon_192.png" />
              <link rel="icon" type="image/png" sizes="256x256" href="/favicon_256.png" />
              <link rel="icon" type="image/png" sizes="512x512" href="/favicon_512.png" />
              <link rel="manifest" href="/site.webmanifest" />
              <title>AstroInspect</title>
            </Head>
            <GoogleAnalytics gaMeasurementId={GA_MEASUREMENT_ID} />
            <SAMPProvider>
              <Stack direction="column" sx={{ height: '100%', width: '100%' }}>
                <Appbar />
                <Box sx={{ flexGrow: 1 }}>
                  <Component {...pageProps} />
                </Box>
              </Stack>
            </SAMPProvider>
          </NotificationsProvider>
        </AppCacheProvider>
      </ToggleColorMode>
    </XTableConfigProvider>
  )
}

export default MyApp
