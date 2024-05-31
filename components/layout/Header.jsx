import NavLink from '../common/NavLink';
import Link from 'next/link';
import { Bars3Icon, MinusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import logo from '../../public/logo.webp';
import { navItems } from '../../lib/clientUtils';
import { Icon } from './DesktopNav';

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  const { home, dashboard, profile, new: newNav, signIn: signInNav, signOut: signOutNav, stats } = navItems;

  useEffect(() => {
    const html = document.documentElement;
    let timeout;
    if (open) {
      html.classList.add('no-scroll');
      setMenuStyle({ display: 'flex' });
      setTimeout(() => setMenuStyle((prev) => ({ ...prev, visibility: 'visible', opacity: 1 })), 0);
    } else {
      html.classList.remove('no-scroll');
      setMenuStyle((prev) => ({ ...prev, visibility: 'hidden', opacity: 0 }));
      timeout = setTimeout(() => setMenuStyle({}), 500);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <header className="sticky top-0 z-10 flex h-header w-full items-center justify-between bg-blue-600 p-4 text-right text-neutral-50 shadow-xl">
      <Link href={`/${session ? 'dashboard' : ''}`} className="flex shrink-0 items-center gap-3 ">
        <Image
          src={logo}
          priority={true}
          alt="Skateboard Trick Tracker Logo"
          title="Skateboard Trick Tracker Logo"
          className="h-12 w-12 drop-shadow-lg transition-transform hover:scale-110 active:scale-100 sm:h-16 sm:w-16"
        />
        <span className="underline-hover hidden whitespace-nowrap text-4xl font-semibold sm:block">Trick Tracker</span>
      </Link>

      <div className="ml-auto">
        {session ? (
          <>
            <span className="hidden md:inline">Signed in as: </span>
            <Link className="underline-hover xs:inline-flex inline items-center gap-2" href="/profile">
              <b className="xs:inline hidden">{session.user?.name}</b>
              <Image
                src={session.user?.image}
                className="rounded-full drop-shadow transition-transform hover:scale-110 active:scale-100"
                alt="User profile picture"
                title={`Go to profile`}
                width={32}
                height={32}
              />
            </Link>
          </>
        ) : (
          <a className="underline-hover font-bold" href="#" onClick={() => signIn()}>
            Sign in
          </a>
        )}
      </div>

      <nav
        className={`invisible absolute bottom-0 left-0 top-0 hidden h-screen w-full flex-col flex-wrap items-center justify-center gap-4 whitespace-nowrap bg-neutral-900/80 text-3xl opacity-0 transition-[opacity,visibility] duration-500 dark:decoration-neutral-100`}
        style={menuStyle}
        onClick={() => setOpen(false)}
      >
        <NavLink label={home.label} icon={home.icon} href={home.href} exact />

        {session ? (
          <>
            <NavLink label={dashboard.label} icon={dashboard.icon} href={dashboard.href} />
            <details
              onToggle={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
                setDetailsOpen((wasOpen) => !wasOpen);
              }}
              open={detailsOpen}
              className="flex items-center gap-2 marker:content-none"
            >
              <summary className="flex cursor-pointer items-center justify-center gap-2 hover:font-semibold">
                {detailsOpen ? <MinusIcon className="size-6" /> : newNav.icon} {newNav.label}
              </summary>
              <div className="flex flex-col items-start gap-2 py-2">
                {newNav.children.map((item) => (
                  <NavLink boldFix key={item.label} icon={newNav.icon} label={item.label} href={item.href} />
                ))}
              </div>
            </details>

            <NavLink label={stats.label} icon={stats.icon} href={stats.href} />
            <NavLink label={profile.label} icon={profile.icon} href={profile.href} />
            <a className="cursor-pointer hover:font-bold" href="#" onClick={signOutNav.onClick}>
              <Icon icon={signOutNav.icon} label={signOutNav.label} />
            </a>
          </>
        ) : (
          <a className="cursor-pointer hover:font-bold" href="#" onClick={signInNav.onClick}>
            <Icon icon={signInNav.icon} label={signInNav.label} />
          </a>
        )}
      </nav>

      {open ? (
        <XMarkIcon
          onClick={() => setOpen(false)}
          className="scale-hover-xl z-10 -m-2 ml-2 h-12 w-12 shrink-0 cursor-pointer p-2 xl:hidden"
        />
      ) : (
        <Bars3Icon
          onClick={() => setOpen(true)}
          className="scale-hover-xl z-10 -m-2 ml-2 h-12 w-12 shrink-0 cursor-pointer p-2 xl:hidden"
        />
      )}
    </header>
  );
}
