import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/layout/DesktopNav';

const NavLink = ({ label, icon, href, onClick, exact, boldFix }) => {
  const router = useRouter();

  const condition = exact ? router.pathname === href : router.pathname.startsWith(href);

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
