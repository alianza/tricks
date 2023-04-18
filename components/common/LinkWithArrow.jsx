import React from 'react';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.scss';

const LinkWithArrow = ({ label, href = '', onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${utilStyles.link} group relative mx-auto mb-6 flex items-center text-4xl`}
    >
      <h1 className="text-4xl">{label}</h1>
      <span className="absolute left-full w-6 text-right text-2xl transition-[width] group-hover:w-8">→</span>
    </Link>
  );
};

export default LinkWithArrow;
