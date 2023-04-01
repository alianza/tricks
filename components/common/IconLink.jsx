import React from 'react';
import Link from 'next/link';

const IconLink = ({ href = '', onClick, Icon, title, label }) => {
  return (
    <Link className="group flex h-6 hover:underline" href={href} onClick={onClick} title={title ? title : 'New'}>
      {label && <span>{label}</span>}
      <Icon className="h-6 w-6 transition-transform duration-300 active:scale-95  group-hover:scale-125 group-hover:duration-75" />
    </Link>
  );
};

export default IconLink;
