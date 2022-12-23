import NavLink from "../navLink/navLink";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-10 flex h-20 w-full justify-between bg-neutral-100 p-4 text-right dark:bg-neutral-900">
      <Link href="/">
        <img
          src="/logo.webp"
          alt="Trick logo"
          className="h-full transition-transform hover:scale-110 active:scale-100"
        />
      </Link>

      <div className="flex items-center gap-4 text-xl dark:decoration-neutral-100">
        <NavLink label="Home" href="/" exact />
        <NavLink label="New Flatground Trick" href="/new-flatground-trick" />
      </div>
    </nav>
  );
}
