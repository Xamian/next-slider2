import Head from 'next/head'
import '../styles/globals.css'
import { useEffect } from 'react'
import { preloadAIWorker } from '../common/ai'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // start warming the AI worker as early as possible on the client
    try { preloadAIWorker(); } catch (e) {}
  }, [])

  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
