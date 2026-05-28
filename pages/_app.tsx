import type { AppProps } from 'next/app'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createPagesBrowserClient({ supabaseUrl:process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! }))
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#060d1a" />
        <meta name="description" content="Gerencie sua coleção de figurinhas da Copa do Mundo FIFA 2026." />
        <title>FigurinhaTracker · Copa 2026</title>
      </Head>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
