import React from 'react';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.scss';

const IconLink = ({ href = '', onClick, Icon, title, label, ...props }) => {
  return (
    <Link
      className="underline-hover group flex items-center"
      href={href}
      onClick={onClick}
      title={title ? title : 'New'}
      {...props}
    >
      {label && <span className="text-nowrap">{label}</span>}
      <Icon className="size-6 transition-transform duration-300 active:scale-95 group-hover:scale-[120%] group-hover:duration-75" />
    </Link>
  );
};

export default IconLink;
