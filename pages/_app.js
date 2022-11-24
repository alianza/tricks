import '../styles/style.scss'
import '../styles/form.scss'
import "../styles/globals.scss"
import Head from 'next/head'
import NavLink from "../components/navLink/navLink"
import Link from "next/link"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pet Care App</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <NavLink label="Home" href="/" exact/>
          <NavLink label="New Pet" href="/new"/>
        </div>

        <Link href="/">
        <img
          id="title"
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
          className="hover:scale-110 transition-transform active:scale-100"
        />
        </Link>
      </div>
      <div className="flex-grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
