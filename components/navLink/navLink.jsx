import React from "react"
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavLink = ({ label, href, onClick, exact }) => {
  const router = useRouter()

  const condition = exact ? router.pathname === href : router.pathname.startsWith(href)

  return (
    <Link href={href} onClick={onClick}
        className={`hover:font-bold decoration-black ${condition ? 'underline' : "no-underline"}`}>
        {label}
    </Link>
  )
}

export default NavLink
