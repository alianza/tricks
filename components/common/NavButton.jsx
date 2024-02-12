import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavButton = ({ label, href = '#', onClick, exact, className }) => {
  const router = useRouter();

  const condition = exact ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`drop-shadow-2xl transition-colors flex items-center gap-2 p-2 hover:font-semibold rounded ${condition ? 'bg-neutral-500 font-semibold text-neutral-50' : 'bg-transparent'} ${className}`}
    >
      {label}
    </Link>
  );
};

export default NavButton;
