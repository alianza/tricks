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
    <nav className="dark:bg-neutral-800 bg-neutral-200 sticky top-[theme(spacing.header)] min-h-[calc(100vh-theme(spacing.header)-theme(spacing.footer))] min-w-desktopNav hidden left-0 gap-2 xl:flex flex-col text-2xl p-4">
      <h2 className="text-3xl my-4 font-bold p-2">Menu</h2>
      <NavButton label={<Icon icon={home.icon} label={home.label} />} href={home.href} exact />
      {session ? (
        <>
          <NavButton label={<Icon icon={dashboard.icon} label={dashboard.label} />} href={dashboard.href} />
          <details
            onToggle={() => setOpen((wasOpen) => !wasOpen)}
            open={open}
            className="flex items-center gap-2 marker:content-none p-2"
          >
            <summary className="flex items-center gap-2 cursor-pointer hover:font-semibold">
              {open ? <MinusIcon className="h-6 w-6" /> : newNav.icon} {newNav.label}
            </summary>
            <div className="indent-8 py-2 flex flex-col gap-2">
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
  <div className="flex items-center gap-2 cursor-pointer hover:font-semibold w-[calc(100%+1rem)]">
    {icon}
    <span
      data-text={label}
      className={
        boldFix
          ? 'before:content-[attr(data-text)] before:invisible before:font-semibold before:block before:h-0 before:text-left before:z-[-1] before:opacity-0 before:pointer-events-none'
          : ''
      }
    >
      {label}
    </span>
  </div>
);

export default DesktopNav;
