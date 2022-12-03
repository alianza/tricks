import NavLink from "../navLink/navLink";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="top-bar">
      <div className="nav text-neutral-900 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100">
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
  );
}
