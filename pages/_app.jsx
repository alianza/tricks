import '../styles/globals.scss';
import Layout from '../components/layout/layout';
import dynamic from 'next/dynamic';
const NextNProgress = dynamic(() => import('nextjs-progressbar'), { loading: () => <div /> });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <NextNProgress color="white" />
      </Layout>
    </SessionProvider>
  );
}

import { SessionProvider } from 'next-auth/react';

export default MyApp;
