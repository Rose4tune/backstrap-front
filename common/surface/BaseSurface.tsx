import { ReactNode } from 'react';

import clsx from 'clsx';

export interface BaseSurfaceProps
  extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
  readonly children?: ReactNode;
  readonly withDarken?: boolean;
  readonly global?: boolean;
}

const BaseSurface: React.FC<BaseSurfaceProps> = props => {
  const { children, withDarken, global, className } = props;

  return (
    <div
      className={clsx(
        'absolute inset-0 flex-center z-[1500]',
        withDarken && 'bg-[rgba(0, 0, 0, 0.5)]',
        global && '!fixed inset-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export default BaseSurface;
