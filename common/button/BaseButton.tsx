import clsx from 'clsx';
import React from 'react';

import useLock from '@hooks/useLock.hook';
import Spinner from '@public/icons/spinner.svg';

export interface BaseButtonProps
  extends BaseProps,
    Pick<
      React.AllHTMLAttributes<HTMLButtonElement>,
      'disabled' | 'autoFocus' | 'onClick'
    >,
    Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: React.ReactNode;

  loading?: boolean;

  inline?: boolean;

  center?: boolean;

  fullWidth?: boolean;

  loaderColor?: string;
}

const BaseButton = (
  props: BaseButtonProps,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const {
    children,
    type = 'button',
    disabled,
    autoFocus,
    className,
    onClick,
    loading,
    inline,
    center = true,
    fullWidth,
    loaderColor
  } = props;

  const [lock, protectHandler] = useLock();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();

    if (lock || disabled || loading) {
      return;
    }

    protectHandler(() => {
      onClick?.call(null, event);
    });
  };

  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        center && 'flex-center text-center',
        inline && 'inline',
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || disabled}
      autoFocus={autoFocus}
      onClick={handleClick}
    >
      {loading ? (
        <Spinner
          className="w-[16px] h-[16px] animate-spin"
          style={{ color: loaderColor }}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default React.forwardRef(BaseButton);
