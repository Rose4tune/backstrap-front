import Box from '@mui/material/Box';
import message from '@pages/my/alarm/message';
import clsx from 'clsx';
import React, { KeyboardEventHandler } from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

export interface BaseMultilineTextInputProps
  extends BaseInputProps<HTMLTextAreaElement>,
    Pick<TextareaAutosizeProps, 'minRows' | 'maxRows' | 'maxLength' | 'autoComplete'> {
  readonly prefix?: React.ReactNode;

  readonly suffix?: React.ReactNode;

  readonly formatter?: (
    value?: BaseInputProps<HTMLTextAreaElement>['value']
  ) => typeof value;

  readonly onEnterPress?: (value: string) => void;

  readonly onBackspacePress?: (value: string) => void;

  readonly onClick?: () => void;

  readonly onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;

  readonly inputProps?: BaseProps;

  readonly borderNone?: boolean;
}

const BaseMultilineTextInput = (
  props: BaseMultilineTextInputProps,
  ref?: React.Ref<HTMLTextAreaElement>
): JSX.Element => {
  const {
    id,
    className,
    name,
    value = '',
    onChange,
    onBlur,
    onEnterPress,
    onBackspacePress,
    onClick,
    onKeyUp,
    placeholder,
    autoComplete,
    maxLength,
    disabled,
    readOnly,
    formatter = v => v,
    prefix,
    suffix,
    minRows,
    maxRows,
    inputProps,
    borderNone,
    ...rest
  } = props;

  return (
    <>
      <div
        className={clsx('relative flex items-end', className)}
        onClick={() => {
          onClick?.call(null);
        }}
      >
        {prefix && (
          <div className="absolute top-0.5 left-0.5 right-0.5 bg-white rounded-t-[18px] flex items-center">
            {prefix}
          </div>
        )}
        <TextareaAutosize
          style={
            borderNone
              ? {
                  border: 'none',
                  padding: 0,
                  borderRadius: 0,
                  fontSize: '16px'
                }
              : { fontSize: '16px' }
          }
          id={id}
          ref={ref}
          className={clsx(
            'input w-full no-scrollbar',
            readOnly && 'readonly',
            inputProps?.className
          )}
          name={name}
          value={formatter?.call(null, value) ?? value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          onKeyDown={evt => {
            if (evt.key === 'Enter') {
              onEnterPress?.call(null, String(value));
            }

            if (evt.key === 'Backspace') {
              onBackspacePress?.call(null, String(value));
            }
          }}
          minRows={minRows}
          maxRows={maxRows}
        />
        {suffix && (
          <div className="absolute top-0 bottom-0 right-0 flex-center">{suffix}</div>
        )}
      </div>
      {typeof value == 'string' && maxLength && (
        <div className={clsx('bg-white', 'px-5', 'pb-2')} style={{ color: '#A6A6A6' }}>
          {value.length <= maxLength ? value.length : maxLength} / {maxLength}
        </div>
      )}
    </>
  );
};

export default React.forwardRef(BaseMultilineTextInput);
