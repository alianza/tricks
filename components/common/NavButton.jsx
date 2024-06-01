import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavButton = ({ label, href = '#', onClick, exact, className, as }) => {
  const router = useRouter();

  const condition = exact ? router.pathname === href : router.pathname.startsWith(href);

  let Tag = Link;

  if (as) {
    Tag = as;
  }

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 rounded p-2 drop-shadow-2xl transition-colors hover:font-semibold ${condition ? 'bg-neutral-500 font-semibold text-neutral-50' : 'bg-transparent'} ${className}`}
    >
      {label}
    </Tag>
  );
};

export default NavButton;
