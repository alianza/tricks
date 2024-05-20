import React from 'react';
import Link from 'next/link';

const LinkWithArrow = ({ label, href = '', onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="underline-hover group relative mx-auto mb-6 flex items-center text-4xl"
    >
      <h1 className="text-4xl">{label}</h1>
      <span className="absolute w-[calc(100%+2rem)] text-right text-3xl transition-[width] group-hover:w-[calc(100%+2.5rem)]">
        →
      </span>
    </Link>
  );
};

export default LinkWithArrow;
