import clsx from "clsx";
import React from "react";

export interface BaseTextInputProps
  extends BaseInputProps,
    Pick<
      React.HTMLProps<HTMLInputElement>,
      "type" | "maxLength" | "autoComplete" | "autoFocus"
    > {
  readonly prefix?: React.ReactNode;

  readonly suffix?: React.ReactNode;

  readonly formatter?: (value: BaseInputProps["value"]) => typeof value;

  readonly onEnterPress?: (value: string) => void;

  readonly onBackspacePress?: (value: string) => void;

  readonly inputProps?: BaseProps;
}

const BaseTextInput = (
  props: BaseTextInputProps,
  ref?: React.Ref<HTMLInputElement>
): JSX.Element => {
  const {
    id,
    style,
    className,
    name,
    value = "",
    type,
    prefix,
    suffix,
    onChange,
    onBlur,
    onEnterPress,
    onBackspacePress,
    placeholder,
    autoFocus,
    autoComplete,
    maxLength,
    disabled,
    readOnly,
    formatter = (v) => v,
    inputProps,
  } = props;

  return (
    <div className={clsx("relative flex items-center", className)}>
      {prefix && <div className="absolute left-0">{prefix}</div>}
      <input
        id={id}
        style={style}
        ref={ref}
        className={clsx(
          "input w-full",
          "typo-body5 font-light",
          readOnly && "readonly",
          inputProps?.className
        )}
        name={name}
        value={formatter?.call(null, value)}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            onEnterPress?.call(null, String(value));
          }

          if (evt.key === "Backspace") {
            onBackspacePress?.call(null, String(value));
          }
        }}
      />
      {suffix && (
        <div className="absolute top-0 bottom-0 right-0 flex-center">
          {suffix}
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(BaseTextInput);
