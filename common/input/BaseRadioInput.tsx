import clsx from "clsx";
import React from "react";

import RadioEmptyIcon from "@public/icons/[input]radio-empty.svg";
import RadioFilledIcon from "@public/icons/[input]radio-filled.svg";

export interface BaseRadioInputProps
  extends BaseInputProps,
    Pick<React.HTMLProps<HTMLInputElement>, "checked"> {
  readonly label?: React.ReactNode;

  readonly labelProps?: BaseProps;

  readonly inputProps?: BaseProps;

  readonly iconSet?: {
    readonly checked: React.ReactNode;
    readonly unchecked: React.ReactNode;
  };
}

const BaseRadioInput = (props: BaseRadioInputProps): JSX.Element => {
  const {
    id,
    style,
    className,

    name,
    value,
    onChange,
    onBlur,
    readOnly,
    disabled,
    placeholder,

    checked,

    label,
    labelProps,

    inputProps,

    iconSet = {
      checked: <RadioFilledIcon />,
      unchecked: <RadioEmptyIcon />,
    },
  } = props;

  return (
    <div
      style={style}
      className={clsx("flex items-center gap-1 md:gap-1.5", className)}
    >
      <span
        className={clsx(
          "relative inline-flex items-center justify-center",
          "align-middle"
        )}
      >
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          checked={checked}
          className={clsx(
            "absolute inset-0 opacity-0 w-full h-full z-[1] cursor-pointer",
            !disabled && !readOnly && "!cursor-pointer",
            inputProps?.className
          )}
        />
        <div className={clsx("flex-center cursor-pointer")}>
          {checked ? iconSet.checked : iconSet.unchecked}
        </div>
      </span>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "input !p-0 !leading-normal",
            !disabled && !readOnly && "cursor-pointer",
            checked ? "font-medium" : "opacity-75",
            labelProps?.className
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default BaseRadioInput;
