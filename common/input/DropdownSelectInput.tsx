import React from "react";
import clsx from "clsx";

import Select, { MultiValue, SingleValue } from "react-select";

import styles from "./DropdownSelectInput.module.scss";

export interface DropdownSelectInputProps extends BaseInputProps {
  readonly variant?: "filled" | "outlined";

  readonly options?: SelectOption[];

  readonly controlProps?: BaseProps;

  readonly multiSelect?: boolean;
}

const DropdownSelectInput = (props: DropdownSelectInputProps): JSX.Element => {
  const {
    // base props
    id,
    style,
    className,

    // base input props
    name,
    value,
    placeholder,
    disabled,
    onChange,

    // rest props
    variant,
    options,
    multiSelect,

    controlProps,
  } = props;

  return (
    <Select
      id={id}
      name={name}
      value={options?.find((option) => option.value === value)}
      onChange={(newValue) => {
        const value = multiSelect
          ? (newValue as MultiValue<SelectOption>)?.map(
              (option) => option.value
            )
          : (newValue as SingleValue<SelectOption>)?.value;

        onChange?.call(null, {
          target: {
            name,
            value,
          },
        } as any);
      }}
      isSearchable={false}
      isMulti={multiSelect}
      options={options}
      placeholder={placeholder}
      components={{
        IndicatorSeparator: () => null,
      }}
      isOptionDisabled={(option) => option.isDisabled ?? false}
      className={clsx(
        styles["select-input"],
        variant === "outlined" && "outlined",
        variant === "filled" && "filled",
        className
      )}
      isDisabled={disabled}
      classNamePrefix="dropdown-select"
      styles={{
        container: (base) =>
          Object.assign(base, {
            flex: 1,
            ...style,
          }),
        control: (base) =>
          Object.assign(base, {
            boxShadow: "none !important",
            ...controlProps?.style,
          }),
        placeholder: (base) =>
          Object.assign(base, {
            color: "#727272",
            fontWeight: 300,
            fontSize: 16,
          }),
        valueContainer: (base) =>
          Object.assign(base, {
            padding: 0,
          }),
        singleValue: (base) =>
          Object.assign(base, {
            color: "#000000",
            fontSize: 16,
            fontWeight: 500,
          }),
        indicatorsContainer: (base) =>
          Object.assign(base, {
            padding: 0,
            '& > [class$="indicatorContainer"]': {
              cursor: "pointer",
            },
          }),
        menu: (base) =>
          Object.assign(base, {
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
          }),
        menuList: (base) => Object.assign(base, { padding: "6px 0 6px 0" }),
        option: (base, props) =>
          Object.assign(base, {
            color: props.isDisabled ? "#D7D7D7" : "#000000",
            cursor: props.isDisabled ? "not-allowed" : "pointer",
            fontSize: 16,
            fontWeight: props.isSelected ? 700 : 500,
            paddingLeft: 12,
            paddingRight: 12,
            height: 42,
            background: "transparent",
          }),
        clearIndicator: (base) =>
          Object.assign(base, {
            margin: "0 8px",
          }),
      }}
    />
  );
};

export default DropdownSelectInput;
