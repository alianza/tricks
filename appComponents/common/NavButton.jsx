import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavButton = ({ label, href = '#', onClick, exact, className }) => {
  const pathname = usePathname();

  const condition = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 rounded p-2 drop-shadow-2xl transition-colors hover:font-semibold ${condition ? 'bg-neutral-500 font-semibold text-neutral-50' : 'bg-transparent'} ${className}`}
    >
      {label}
    </Link>
  );
};

export default NavButton;
