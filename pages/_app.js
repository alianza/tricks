import '../styles/globals.scss';
import Layout from '../components/layout/layout';
import dynamic from 'next/dynamic';
const NextNProgress = dynamic(() => import('nextjs-progressbar'), { loading: () => <div /> });

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <NextNProgress />
    </Layout>
  );
}

export default MyApp;
