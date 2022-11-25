import Head from "next/head";
import NavLink from "../navLink/navLink";
import Link from "next/link";

function Layout({ children }) {
  return (
    <div id="app" className="bg-light dark:bg-dark min-h-screen">
      <Head>
        <title>Pet Care App</title>
      </Head>

      <div className="top-bar">
        <div className="nav text-dark decoration-dark dark:text-light dark:decoration-light">
          <NavLink label="Home" href="/" exact />
          <NavLink label="New Pet" href="/new-pet" />
        </div>

        <Link href="/">
          <img
            id="title"
            src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
            alt="pet care logo"
            className="hover:scale-110 transition-transform active:scale-100 dark:invert"
          />
        </Link>
      </div>
      <main className="flex-grid wrapper">{children}</main>
    </div>
  );
}

export default Layout;
