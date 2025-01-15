import '../styles/globals.scss';
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

const NextNProgress = dynamic(() => import('nextjs-progressbar'), { loading: () => <div />, ssr: false });
const ToastContainer = dynamic(() => import('react-toastify').then((mod) => mod.ToastContainer), {
  loading: () => <div />,
  ssr: false,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer position="bottom-center" theme="light" />
      <NextNProgress color="white" />
    </SessionProvider>
  );
}
export default MyApp;
