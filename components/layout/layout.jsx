import Head from 'next/head';
import Header from './header';
import Footer from './footer';

export default function Layout({ children }) {
  return (
    <div
      id="app"
      className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900 decoration-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
    >
      <Head>
        <title>MongoDB Mongoose w/ Next.js - J.W. van Bremens</title>
      </Head>

      <Header />

      <main className="mx-auto max-w-7xl p-2 pb-12">{children}</main>

      <Footer />
    </div>
  );
}
