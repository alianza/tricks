import Head from "next/head";
import Nav from "./nav";

export default function Layout({ children }) {
  return (
    <div
      id="app"
      className="min-h-screen bg-neutral-100 text-neutral-900 decoration-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <Head>
        <title>MongoDB Mongoose w/ Next.js - J.W. van Bremens</title>
      </Head>

      <Nav />

      <main className="p-2 pb-12 ">{children}</main>
    </div>
  );
}
