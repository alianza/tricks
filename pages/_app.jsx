import '../styles/globals.scss';
import Layout from '../components/layout/layout';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
const NextNProgress = dynamic(() => import('nextjs-progressbar'), { loading: () => <div />, ssr: false });
const ToastContainer = dynamic(() => import('react-toastify').then((mod) => mod.ToastContainer), {
  loading: () => <div />,
  ssr: false,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    import('react-toastify/dist/ReactToastify.min.css');
  }, []);

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
