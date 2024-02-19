import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '../layout/DesktopNav';

const NavLink = ({ label, icon, href, onClick, exact, boldFix }) => {
  const router = useRouter();

  const condition = exact ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`drop-shadow-2xl hover:font-semibold text-start ${condition ? 'underline' : 'no-underline'}`}
    >
      <Icon boldFix={boldFix} icon={icon} label={label} />
    </Link>
  );
};

export default NavLink;
