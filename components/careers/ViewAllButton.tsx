import { forwardRef } from 'react';
import Link from 'next/link';

import { ViewAllButtonContainer } from './ViewAllButton.style';

export interface ViewAllButton extends BaseProps {
  text: string;
  size?: 'lg' | 'sm';
  href?: string;
  onClick?: () => void;
}

const ViewAllButton = (
  props: ViewAllButton,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const { text, href, className, onClick } = props;

  return href ? (
    <Link href={href} passHref legacyBehavior>
      <ViewAllButtonContainer as="a" className={className}>
        {text}
      </ViewAllButtonContainer>
    </Link>
  ) : (
    <ViewAllButtonContainer
      type="button"
      ref={ref}
      className={className}
      onClick={onClick}
    >
      {text}
    </ViewAllButtonContainer>
  );
};

export default forwardRef(ViewAllButton);
