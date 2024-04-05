'use client';

import { SessionProvider } from 'next-auth/react';
const NextNProgress = dynamic(() => import('next-nprogress-bar').then((mod) => mod.AppProgressBar), {
  loading: () => <></>,
  ssr: false,
});
const ToastContainer = dynamic(() => import('react-toastify').then((mod) => mod.ToastContainer), {
  loading: () => <></>,
  ssr: false,
});

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

function Providers({ children, session }) {
  useEffect(() => {
    import('react-toastify/dist/ReactToastify.min.css');
  }, []);

  return (
    <>
      <SessionProvider session={session}>{children}</SessionProvider>
      <NextNProgress height="3px" color="#eee" shallowRouting="true" options={{ easing: 'ease', speed: 500 }} />
      <ToastContainer position="bottom-center" theme="light" />
    </>
  );
}

export default Providers;
