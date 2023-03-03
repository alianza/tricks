import Head from 'next/head';
import Header from './header';
import Footer from './footer';

export default function Layout({ children }) {
  return (
    <div
      id="app"
      className="flex min-h-screen flex-col items-center bg-neutral-100 text-neutral-900 decoration-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
    >
      <Head>
        <title>Skateboarding Trick List - Jan-Willem van Bremen</title>
        <meta
          name="description"
          content="A modern web application to catalog skate tricks, grind, manuals and combinations of those - made by Jan-Willem van Bremen"
        />
      </Head>

      <Header />

      <main className="mx-auto max-w-7xl max-w-full p-2 py-12">{children}</main>

      <Footer />
    </div>
  );
}
