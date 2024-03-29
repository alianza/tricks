import React from 'react';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.scss';

const IconLink = ({ href = '', onClick, Icon, title, label, ...props }) => {
  return (
    <Link className={`${utilStyles.link} group flex`} href={href} onClick={onClick} title={title ? title : 'New'} {...props}>
      {label && <span>{label}</span>}
      <Icon className="h-6 w-6 transition-transform duration-300 active:scale-95 group-hover:scale-[120%] group-hover:duration-75" />
    </Link>
  );
};

export default IconLink;
