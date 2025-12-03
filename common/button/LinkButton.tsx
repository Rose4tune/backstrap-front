import { forwardRef } from 'react';

import { LinkButtonContainer } from './LinkButton.style';

export interface LinkButtonProps
  extends BaseProps,
    Pick<
      React.AllHTMLAttributes<HTMLAnchorElement>,
      'disabled' | 'autoFocus' | 'onClick'
    > {
  text: string;

  size: 'lg' | 'md' | 'sm' | 'xs';

  isDestructive?: boolean;

  href?: string;
}

const LinkButton = (
  props: LinkButtonProps,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const {
    text,
    size,
    isDestructive = false,
    href,
    disabled = false,
    className,
    onClick
  } = props;

  return (
    <LinkButtonContainer
      href={disabled ? undefined : href}
      size={size}
      isDestructive={isDestructive}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {text}
    </LinkButtonContainer>
  );
};

export default forwardRef(LinkButton);
