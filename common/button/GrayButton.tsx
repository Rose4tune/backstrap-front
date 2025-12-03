import { forwardRef } from 'react';
import Link from 'next/link';

import { GrayButtonContainer } from './GrayButton.style';

export interface GrayButtonProps extends BaseProps {
  text: string;
  size?: 'lg' | 'sm';
  href?: string;
  onClick?: () => void;
}

const GrayButton = (
  props: GrayButtonProps,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const { text, size, href, className, onClick } = props;

  return href ? (
    <Link href={href} passHref legacyBehavior>
      <GrayButtonContainer as="a" size={size} className={className}>
        {text}
      </GrayButtonContainer>
    </Link>
  ) : (
    <GrayButtonContainer
      size={size}
      type="button"
      ref={ref}
      className={className}
      onClick={onClick}
    >
      {text}
    </GrayButtonContainer>
  );
};

export default forwardRef(GrayButton);
