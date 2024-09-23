import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { getBaseURL } from '../app/lib/utils'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    navigator.serviceWorker
      .register(getBaseURL() + 'sw_v2.js', {
        updateViaCache: 'none'
      })
      .then((registration) =>
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        )
      )
      .catch((err) => console.log('Service Worker registration failed: ', err))
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
