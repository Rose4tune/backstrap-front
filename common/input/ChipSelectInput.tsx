import clsx from "clsx";
import React from "react";

import { useFormikContext } from "formik";

import BaseChip, { BaseChipProps } from "../chip/BaseChip";

export interface ChipSelectInputProps extends BaseInputProps {
  readonly variant?: "filled" | "outlined";

  readonly options?: SelectOption[];

  readonly optionProps?: Partial<BaseChipProps>;

  readonly multiSelect?: boolean;
}

const ChipSelectInput = (props: ChipSelectInputProps): JSX.Element => {
  const {
    className,
    id,
    style,
    name = "",
    value: _value = [],
    onChange,
    onBlur,
    placeholder,
    disabled,
    readOnly,
    checked,
    options,
    optionProps,
    multiSelect,
  } = props;

  const formik = useFormikContext();

  const value = Array.isArray(_value) ? _value : [_value];

  return (
    <div
      id={id}
      style={style}
      className={clsx("grid grid-cols-2 gap-1.5", className)}
    >
      {options?.map((option) => (
        <BaseChip
          key={option.label}
          className={clsx(
            "border-2 rounded-2xl flex-center h-[42px]",
            "typo-body7 font-medium",
            "md:h-12 md:typo-body5",
            "transition-all duration-200 ease-in-out",
            value.includes(option.value)
              ? "border-primary text-primary underline"
              : "text-grey5 border-grey5",
            disabled && "disabled",
            optionProps?.className
          )}
          label={option.label}
          size={optionProps?.size}
          shape={optionProps?.shape}
          onSelected={() => {
            if (!disabled && !readOnly) {
              if (multiSelect) {
                const newValues = [...value];

                const index = newValues.indexOf(option.value);

                if (index < 0) {
                  newValues.push(option.value);
                } else {
                  newValues.splice(index, 1);
                }

                formik.setFieldValue(name, newValues);
              } else {
                formik.setFieldValue(name, option.value);
              }
            }
          }}
          selected={value.includes(option.value)}
        />
      ))}
    </div>
  );
};

export default ChipSelectInput;
