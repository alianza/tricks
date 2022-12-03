import NavLink from "../navLink/navLink";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-10 flex h-20 w-full justify-between bg-neutral-100 px-4 text-right dark:bg-neutral-900">
      <Link href="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
          className="h-full transition-transform hover:scale-110 active:scale-100 dark:invert"
        />
      </Link>

      <div className="flex items-center gap-4 text-xl dark:decoration-neutral-100">
        <NavLink label="Home" href="/" exact />
        <NavLink label="New Pet" href="/new-pet" />
        <NavLink label="New Flatground Trick" href="/new-flatground-trick" />
      </div>
    </nav>
  );
}
