import clsx from 'clsx';
import React from 'react';

import { useField } from 'formik';

import BaseTextInput, { BaseTextInputProps } from '@common/input/BaseTextInput';
import MuiOutlinedTextInput, {
  MuiOutlinedTextInputProps
} from '@common/input/mui/MuiTextInput';
import { InputType } from 'types/inputTypes';

export interface BaseFormTextFieldProps
  extends BaseFormFieldProps,
    Pick<BaseTextInputProps, 'type' | 'maxLength' | 'formatter' | 'onChange'>,
    Pick<
      MuiOutlinedTextInputProps,
      'label' | 'size' | 'color' | 'labelColor' | 'borderColor' | 'error'
    > {
  readonly inputProps?: BaseProps;

  readonly inputType?: InputType;
}

const BaseFormTextField = (props: BaseFormTextFieldProps) => {
  const {
    id,
    style,
    inputType = InputType.Basic,
    required,
    name,
    className,
    inputProps,
    value: _value,
    onChange: _onChange,
    disabled,
    error: _error,
    maxLength = 255,
    ...textInputProps
  } = props;

  const [field, meta, helper] = useField({ name });

  const { value, onChange, onBlur } = field;

  const { touched, error } = meta;

  const { setValue } = helper;

  React.useEffect(() => {
    if (_value != null) {
      setValue(_value);
    }
  }, [_value]);

  switch (inputType) {
    case InputType.FullBorder:
      return (
        <MuiOutlinedTextInput
          id={id}
          style={style}
          className={clsx('w-full', className)}
          name={name}
          value={value}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            onChange(evt);

            _onChange?.call(null, evt);
          }}
          onBlur={onBlur}
          autoComplete="off"
          disabled={disabled}
          inputProps={Object.assign({ maxLength }, inputProps)}
          error={(touched && !!error) || _error}
          {...textInputProps}
        />
      );
    case InputType.Underline:
      const _inputProps = {
        ...inputProps,
        className: clsx(
          'border-b border-[#E5E5EB] focus:border-[#000000] focus:placeholder:text-[#a9a9a9]',
          'placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out',
          'transition-all duration-300 ease-in-out',
          'p-2',
          'text-[16px]',
          ((touched && !!error) || _error) &&
            'border-[#EF6969] placeholder:text-[#EF6969]'
        )
      };
      return (
        <div className="w-full">
          <div className="text-[14px]">{textInputProps.label}</div>
          <BaseTextInput
            id={id}
            style={style}
            className={clsx('w-full', className)}
            name={name}
            value={value}
            onChange={evt => {
              onChange(evt);
              _onChange?.call(null, evt);
            }}
            onBlur={onBlur}
            autoComplete="off"
            maxLength={maxLength}
            disabled={disabled}
            inputProps={_inputProps}
            {...textInputProps}
          />
        </div>
      );
    case InputType.Basic:
      return (
        <BaseTextInput
          id={id}
          style={style}
          className={clsx('w-full', className)}
          name={name}
          value={value}
          onChange={evt => {
            onChange(evt);

            _onChange?.call(null, evt);
          }}
          onBlur={onBlur}
          autoComplete="off"
          maxLength={maxLength}
          disabled={disabled}
          inputProps={inputProps}
          {...textInputProps}
        />
      );
    default:
      return null;
  }
};

export default BaseFormTextField;
