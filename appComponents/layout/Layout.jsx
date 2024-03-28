import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import DesktopNav from './DesktopNav';

export default function Layout({ children }) {
  return (
    <div
      id="app"
      className="flex min-h-screen flex-col items-center bg-neutral-100 text-neutral-900 decoration-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
    >
      <Head>
        <title>Skateboarding Tricks Tracker</title>
        <meta
          name="description"
          content="A modern web application to catalog skate tricks, grind, manuals and combinations - made by Jan-Willem van Bremen"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=yes, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#2563eb" />
      </Head>

      <Header />

      <div className="min-h-full grow flex max-w-full w-full">
        <DesktopNav />
        <main className="mx-auto flex max-w-full xl:max-w-[calc(100%-theme(spacing.desktopNav))] flex-col px-4 py-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
