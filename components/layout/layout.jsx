import Head from "next/head";
import Nav from "./nav";

export default function Layout({ children }) {
  return (
    <div id="app" className="bg-light dark:bg-dark min-h-screen">
      <Head>
        <title>Pet Care App</title>
      </Head>

      <Nav />

      <main className="flex flex-col items-center gap-4">{children}</main>
    </div>
  );
}
