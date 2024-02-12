import NavLink from '../common/NavLink';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import utilStyles from '../../styles/utils.module.scss';
import logo from '../../public/logo.webp';
import { navItems } from '../../lib/clientUtils';

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  const { home, dashboard, profile, new: newNav, signIn: signInNav, signOut: signOutNav } = navItems;

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
        <span className={`${utilStyles.link} hidden whitespace-nowrap text-3xl sm:block`}>Trick Tracker</span>
      </Link>

      <div className="ml-auto">
        {session ? (
          <>
            <span className="hidden md:inline">Signed in as: </span>
            <Link className={`${utilStyles.link} inline items-center gap-2 xsm:inline-flex`} href="/profile">
              <b className="hidden xsm:inline">{session.user?.name}</b>
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
          <a className={`${utilStyles.link} font-bold`} href="#" onClick={() => signIn()}>
            Sign in
          </a>
        )}
      </div>

      <nav
        className={`hidden invisible absolute bottom-0 left-0 top-0 h-screen w-full flex-col flex-wrap items-center justify-center gap-4 whitespace-nowrap bg-neutral-900/80 text-3xl opacity-0 transition-[opacity,visibility] duration-500 dark:decoration-neutral-100`}
        style={menuStyle}
        onClick={() => setOpen(false)}
      >
        <NavLink label={home.label} href={home.href} exact />

        {session ? (
          <>
            <NavLink label={dashboard.label} href={dashboard.href} />
            {newNav.children.map((item) => (
              <NavLink key={item.label} label={`New ${item.label}`} href={item.href} />
            ))}
            <NavLink label={profile.label} href={profile.href} />
            <a className="cursor-pointer hover:font-bold" href="#" onClick={signOutNav.onClick}>
              {signOutNav.label}
            </a>
          </>
        ) : (
          <a className="cursor-pointer hover:font-bold" href="#" onClick={signInNav.onClick}>
            {signInNav.label}
          </a>
        )}
      </nav>

      {open ? (
        <XMarkIcon
          onClick={() => setOpen(false)}
          className="hoverStrong z-10 h-8 w-8 shrink-0 ml-4 cursor-pointer xl:hidden"
        />
      ) : (
        <Bars3Icon
          onClick={() => setOpen(true)}
          className="hoverStrong z-10 h-8 w-8 shrink-0 ml-4 cursor-pointer xl:hidden"
        />
      )}
    </header>
  );
}
