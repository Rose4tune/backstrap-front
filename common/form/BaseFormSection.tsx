import React, { ReactNode } from 'react';

import clsx from 'clsx';

export interface FormSectionProps
  extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
  readonly children: ReactNode;
  readonly label?: string;
  readonly collapsible?: boolean;
}

const BaseFormSection: React.FC<FormSectionProps> = props => {
  const { label, collapsible, children, className, ...restProps } = props;

  return (
    <div className={clsx(className)} {...restProps}>
      {children}
    </div>
  );
};

export default BaseFormSection;
