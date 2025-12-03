import { ReactNode } from 'react';

import clsx from 'clsx';

export interface BaseFormRowProps extends BaseProps {
  children: ReactNode;
}

const BaseFormRow: React.FC<BaseFormRowProps> = props => {
  const { children, className } = props;

  return <div className={clsx('flex justify-start w-full', className)}>{children}</div>;
};

export default BaseFormRow;
