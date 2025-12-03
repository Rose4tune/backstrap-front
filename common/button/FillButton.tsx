import React, { Children, forwardRef } from 'react';
import LoadingSpinner from '@common/loader/LoadingSpinner';
import clsx from 'clsx';

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';
type Size = 'XLarge' | 'Large';

interface FillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStatus: ButtonStatusType;
  size: Size;
  text?: string;
}

const FillButton = forwardRef<HTMLButtonElement, FillButtonProps>(
  ({ buttonStatus, size, text, className, ...props }, ref) => {
    const baseClasses =
      'flex flex-1 justify-center items-center rounded-[16px] font-bold';

    const sizeClasses = {
      XLarge: 'h-[62px] py-[17px]',
      Large: 'h-[52px] py-[16px]'
    }[size];

    const statusClasses = {
      active: 'bg-normal text-white',
      click: 'bg-click text-white',
      disable: 'bg-gray-40 text-gray-50 cursor-not-allowed',
      hover: 'bg-hover text-white',
      loading: 'bg-normal text-white',
      empty: 'bg-gray-20 text-gray-90'
    }[buttonStatus];

    const isDisabled = buttonStatus === 'disable' || buttonStatus === 'loading';

    return (
      <button
        ref={ref}
        className={clsx(baseClasses, sizeClasses, statusClasses, className)}
        disabled={isDisabled}
        {...props}
      >
        {text ? buttonStatus === 'loading' ? <LoadingSpinner /> : text : props.children}
      </button>
    );
  }
);

FillButton.displayName = 'FillButton';

export default FillButton;
