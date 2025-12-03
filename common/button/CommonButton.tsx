import { forwardRef, type ReactNode } from 'react';
import { CommonButtonContainer, CommonButtonText } from './CommonButton.style';

export interface CommonButtonProps
  extends BaseProps,
    Pick<
      React.AllHTMLAttributes<HTMLButtonElement>,
      'disabled' | 'autoFocus' | 'onClick'
    >,
    Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  text: string;

  size: 'full' | 'lg' | 'md' | 'sm' | 'xs';

  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary';

  leftImage?: ReactNode;

  rightImage?: ReactNode;

  isDestructive?: boolean;
}

const CommonButton = (
  props: CommonButtonProps,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const {
    text,
    size,
    emphasis,
    leftImage,
    rightImage,
    isDestructive = false,
    type = 'button',
    disabled,
    autoFocus,
    className,
    onClick
  } = props;

  return (
    <CommonButtonContainer
      size={size}
      emphasis={emphasis}
      isDestructive={isDestructive}
      type={type}
      disabled={disabled}
      autoFocus={autoFocus}
      onClick={onClick}
      className={className}
    >
      {leftImage}
      <CommonButtonText
        size={size}
        emphasis={emphasis}
        isDestructive={isDestructive}
        disabled={disabled}
      >
        {text}
      </CommonButtonText>
      {rightImage}
    </CommonButtonContainer>
  );
};

export default forwardRef(CommonButton);
