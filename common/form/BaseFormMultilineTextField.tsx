import clsx from 'clsx';
import React from 'react';

import { useField } from 'formik';

import BaseMultilineTextInput, {
  BaseMultilineTextInputProps
} from '@common/input/BaseMultilineTextInput';

export interface BaseFormMultilineTextFieldProps
  extends BaseFormFieldProps,
    Pick<
      BaseMultilineTextInputProps,
      'maxLength' | 'maxRows' | 'formatter' | 'onChange' | 'inputProps'
    > {}

const BaseFormMultilineTextField = (props: BaseFormMultilineTextFieldProps) => {
  const {
    id,
    style,
    className,
    name,
    required,
    onChange: _onChange,
    disabled,
    ...textInputProps
  } = props;

  const [field] = useField({ name });

  const { value, onChange, onBlur } = field;

  return (
    <BaseMultilineTextInput
      id={id}
      style={style}
      className={clsx('resize-none w-full !leading-relaxed', className)}
      name={name}
      value={value}
      onChange={evt => {
        _onChange?.call(null, evt);

        onChange(evt);
      }}
      formatter={value => {
        return typeof value !== 'string'
          ? value
          : value.split('\n').slice(0, 2).join('\n');
      }}
      maxLength={50}
      disabled={disabled}
      onBlur={onBlur}
      autoComplete="off"
      {...textInputProps}
    />
  );
};

export default BaseFormMultilineTextField;
