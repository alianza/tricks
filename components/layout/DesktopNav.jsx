import { signIn, signOut, useSession } from 'next-auth/react';
import { MinusIcon } from '@heroicons/react/20/solid';
import NavButton from '../common/NavButton';
import { useState } from 'react';
import { navItems } from '../../lib/clientUtils';

function DesktopNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const { home, dashboard, profile, new: newNav, signIn: signInNav, signOut: signOutNav, stats } = navItems;

  return (
    <nav className="sticky left-0 top-[theme(spacing.header)] hidden max-h-[calc(100vh-theme(spacing.header))] min-w-desktopNav flex-col gap-2 overflow-auto bg-neutral-200 p-4 text-2xl xl:flex dark:bg-neutral-800">
      <h2 className="p-2 text-4xl font-bold">Menu</h2>
      <NavButton label={<Icon icon={home.icon} label={home.label} />} href={home.href} exact />
      {session ? (
        <>
          <NavButton label={<Icon icon={dashboard.icon} label={dashboard.label} />} href={dashboard.href} />
          <details
            onToggle={() => setOpen((wasOpen) => !wasOpen)}
            open={open}
            className="flex items-center gap-2 p-2 marker:content-none"
          >
            <summary className="flex cursor-pointer items-center gap-2 hover:font-semibold">
              {open ? <MinusIcon className="h-6 w-6" /> : newNav.icon} {newNav.label}
            </summary>
            <div className="flex flex-col gap-2 py-2 indent-8">
              {newNav.children.map((item) => (
                <NavButton key={item.label} label={item.label} href={item.href} />
              ))}
            </div>
          </details>
          <NavButton label={<Icon icon={stats.icon} label={stats.label} />} href={stats.href} />
          <NavButton label={<Icon icon={profile.icon} label={profile.label} />} href={profile.href} />
          <NavButton
            className="mt-auto"
            onClick={() => signOut({ callbackUrl: '/' })}
            label={<Icon icon={signOutNav.icon} label={signOutNav.label} />}
          />
        </>
      ) : (
        <NavButton
          className="mt-auto"
          onClick={() => signIn()}
          label={<Icon icon={signInNav.icon} label={signInNav.label} />}
        />
      )}
    </nav>
  );
}

export const Icon = ({ icon, label, boldFix }) => (
  <div className="flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2 hover:font-semibold">
    {icon}
    <span
      data-text={label}
      className={
        boldFix
          ? 'before:pointer-events-none before:invisible before:z-[-1] before:block before:h-0 before:text-left before:font-semibold before:opacity-0 before:content-[attr(data-text)]'
          : ''
      }
    >
      {label}
    </span>
  </div>
);

export default DesktopNav;
