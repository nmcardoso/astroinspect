import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { GoogleAnalytics, event, usePageViews } from 'nextjs-google-analytics'
import { GA_MEASUREMENT_ID } from '../app/lib/gtag'

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

  return <>
    <GoogleAnalytics gaMeasurementId={GA_MEASUREMENT_ID} />
    <Component {...pageProps} />
  </>
}

export default MyApp
