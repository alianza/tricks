import React from 'react';
import Link from 'next/link';

const IconLink = ({ href = '', onClick, Icon, title }) => {
  return (
    <Link
      className="block h-6 w-6 transition-transform duration-300 hover:scale-125 hover:duration-75 active:scale-95"
      href={href}
      inClick={onClick}
      title={title ? title : 'New'}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default IconLink;
