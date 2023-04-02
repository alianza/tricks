import NavLink from '../common/navLink';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const openMobileMenuStyle = {
    visibility: 'visible',
    opacity: 1,
  };

  useEffect(() => {
    const html = document.documentElement;
    open ? html.classList.add('no-scroll') : html.classList.remove('no-scroll');
  }, [open]);

  return (
    <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-blue-600 p-4 text-right text-neutral-50 shadow-xl">
      <Link href="/" className="h-[120%] shrink-0">
        <img
          src="/logo.webp"
          alt="Skateboard Trick Tracker Logo"
          className="white h-full w-full drop-shadow-lg transition-transform hover:scale-110 active:scale-100"
        />
      </Link>

      <div className="ml-auto mr-4 flex items-center gap-2">
        {session ? (
          <>
            <span>
              Signed in as: <b>{session.user.name}</b>
            </span>
            <Image
              src={session.user.image}
              className="rounded-full"
              alt="User profile picture"
              width={32}
              height={32}
            />
          </>
        ) : (
          <a className="cursor-pointer text-lg hover:font-bold" href="#" onClick={() => signIn()}>
            Sign in
          </a>
        )}
      </div>

      <nav
        className={`invisible absolute top-0 bottom-0 left-0 flex h-screen w-full flex-col flex-wrap items-center justify-center gap-4 whitespace-nowrap bg-neutral-900/80 text-3xl opacity-0 transition-[opacity,visibility] duration-500 dark:decoration-neutral-100`}
        style={open ? openMobileMenuStyle : {}}
        onClick={() => setOpen(false)}
      >
        <NavLink label="Home" href="/" exact />
        <NavLink label="Dashboard" href="/dashboard" />
        <NavLink label="New Flatground Trick" href="/new-flatground-trick" />
        <NavLink label="New Grind" href="/new-grind" />
        <NavLink label="New Manual" href="/new-manual" />
        <NavLink label="New Combo" href="/new-combo" />
        {session && (
          <a className="cursor-pointer hover:font-bold" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </a>
        )}
      </nav>

      {open ? (
        <XMarkIcon onClick={() => setOpen(false)} className="z-10 h-8 w-8 cursor-pointer" />
      ) : (
        <Bars3Icon onClick={() => setOpen(true)} className="z-10 h-8 w-8 cursor-pointer" />
      )}
    </header>
  );
}
