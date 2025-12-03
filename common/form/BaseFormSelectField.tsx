import React from 'react';
import clsx from 'clsx';

import { useField } from 'formik';

import DropdownSelectInput from '@common/input/DropdownSelectInput';
import ChipSelectInput, { ChipSelectInputProps } from '@common/input/ChipSelectInput';

export interface BaseFormSelectFieldProps
  extends BaseFormFieldProps,
    Pick<ChipSelectInputProps, 'options' | 'optionProps' | 'variant' | 'multiSelect'> {
  readonly type?: 'dropdown' | 'chip';
  readonly inputClassName?: string;
}

const BaseFormSelectField = (props: BaseFormSelectFieldProps, ref: any) => {
  const {
    name,
    type = 'dropdown',
    required,
    className,
    disabled,
    inputClassName,
    ...selectInputProps
  } = props;

  const [field] = useField({ name });

  const { value, onChange, onBlur } = field;

  return (
    <div className={clsx('w-full', className)}>
      {type === 'dropdown' && (
        <DropdownSelectInput
          className={inputClassName}
          name={name}
          value={value == null ? undefined : String(value)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...selectInputProps}
        />
      )}
      {type === 'chip' && (
        <ChipSelectInput
          className={inputClassName}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...selectInputProps}
        />
      )}
    </div>
  );
};

export default React.forwardRef(BaseFormSelectField);
