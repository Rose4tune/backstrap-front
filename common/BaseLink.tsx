import { ReactNode } from 'react';

import clsx from 'clsx';

import Link, { LinkProps } from 'next/link';

export interface BaseLinkProps
  extends BaseProps,
    Pick<React.AllHTMLAttributes<HTMLAnchorElement>, 'target' | 'onClick'>,
    PartialOn<LinkProps, 'href'> {
  children: ReactNode;
}

const BaseLink: React.FC<BaseLinkProps> = props => {
  const { id, style, className, children, target, onClick, href, ...linkProps } = props;

  return href ? (
    <Link
      href={href}
      id={id}
      style={style}
      className={clsx('', className)}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      onClick={onClick}
      {...linkProps}
    >
      {children}
    </Link>
  ) : (
    <a
      id={id}
      style={style}
      className={clsx('', className)}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default BaseLink;
