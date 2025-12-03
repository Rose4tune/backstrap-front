import { forwardRef } from 'react';

import PolygonIcon from '@public/icons/[board]polygon.svg';

import {
  CareerFilterButtonContainer,
  CareerFilterButtonPolygonIconContainer
} from './CareerFilterButton.style';

export interface CareerFilterButtonProps
  extends BaseProps,
    Pick<React.AllHTMLAttributes<HTMLButtonElement>, 'disabled' | 'autoFocus'>,
    Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  text: string;
  selected?: boolean;
  value?: string;
  isArrow?: boolean;
  onClick?: () => void;
}

const CareerFilterButton = (
  props: CareerFilterButtonProps,
  ref?: React.Ref<HTMLButtonElement>
): JSX.Element => {
  const { text, selected, value, isArrow, onClick, disabled, autoFocus, className } =
    props;

  return (
    <>
      <CareerFilterButtonContainer
        ref={ref}
        type="button"
        selected={selected}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onClick={onClick}
        className={className}
      >
        {text}
        {isArrow && (
          <CareerFilterButtonPolygonIconContainer selected={selected} disabled={disabled}>
            <PolygonIcon />
          </CareerFilterButtonPolygonIconContainer>
        )}
      </CareerFilterButtonContainer>
    </>
  );
};

export default forwardRef(CareerFilterButton);
