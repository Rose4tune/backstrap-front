import clsx from "clsx";
import React from "react";

import CheckboxEmptyIcon from "@public/icons/[input]checkbox-empty.svg";
import CheckboxFilledIcon from "@public/icons/[input]checkbox-filled.svg";

export interface BaseCheckInputProps
  extends BaseInputProps,
    Pick<React.HTMLProps<HTMLInputElement>, "checked"> {
  readonly label?: React.ReactNode;

  readonly labelProps?: BaseProps;

  readonly inputProps?: BaseProps;

  readonly size?: "xs" | "sm" | "md" | "lg" | "xl";

  readonly iconSet?: {
    readonly checked: React.ReactNode;
    readonly unchecked: React.ReactNode;
  };
}

const BaseCheckInput = (props: BaseCheckInputProps): JSX.Element => {
  const {
    id,
    style,
    className,

    name,
    value,
    checked,
    onBlur,
    onChange,
    placeholder,
    disabled,
    readOnly,

    label,
    labelProps,

    inputProps,

    size = "md",
    iconSet = {
      checked: <CheckboxFilledIcon />,
      unchecked: <CheckboxEmptyIcon />,
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
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={clsx(
            "absolute inset-0 opacity-0 w-full h-full z-[1] cursor-pointer",
            !disabled && !readOnly && "cursor-pointer",
            inputProps?.className
          )}
        />
        <div className={clsx("flex-center cursor-pointer")}>
          {checked ? iconSet.checked : iconSet.unchecked}
        </div>
      </span>
      <label
        htmlFor={id}
        className={clsx(
          "input !p-0 !leading-normal",
          !disabled && !readOnly && "cursor-pointer",
          checked ? "font-medium" : "opacity-75",
          size === "xs" && "xs",
          size === "sm" && "sm",
          size === "md" && "md",
          size === "lg" && "lg",
          size === "xl" && "xl",
          labelProps?.className
        )}
      >
        {label}
      </label>
    </div>
  );
};

export default BaseCheckInput;
