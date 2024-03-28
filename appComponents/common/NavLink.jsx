import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../layout/DesktopNav';

const NavLink = ({ label, icon, href, onClick, exact, boldFix }) => {
  const pathname = usePathname();

  const condition = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-start drop-shadow-2xl hover:font-semibold ${condition ? 'underline' : 'no-underline'}`}
    >
      <Icon boldFix={boldFix} icon={icon} label={label} />
    </Link>
  );
};

export default NavLink;
