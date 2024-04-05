import '@/styles/globals.scss';
import Providers from '@/appComponents/providers/Providers';
import Header from '@/appComponents/layout/Header';
import DesktopNav from '@/appComponents/layout/DesktopNav';
import Footer from '@/appComponents/layout/Footer';

export const metadata = {
  title: 'Skateboarding Tricks Tracker',
  description:
    'A modern web application to catalog skate tricks, grind, manuals and combinations - made by Jan-Willem van Bremen',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#2563eb',
};

function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-header">
      <body>
        <Providers>
          <div
            id="app"
            className="flex min-h-screen flex-col items-center bg-neutral-100 text-neutral-900 decoration-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
          >
            <Header />

            <div className="flex min-h-full w-full max-w-full grow">
              <DesktopNav />
              <main className="mx-auto flex max-w-full flex-col px-4 py-8 xl:max-w-[calc(100%-theme(spacing.desktopNav))]">
                {children}
              </main>
            </div>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
