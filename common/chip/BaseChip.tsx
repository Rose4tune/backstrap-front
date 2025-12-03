import clsx from "clsx";
import React from "react";

export interface BaseChipProps extends BaseProps {
  readonly label: React.ReactNode;

  readonly readOnly?: boolean;

  readonly selected?: boolean;

  readonly onSelected?: () => void;

  readonly size?: "xs" | "sm" | "md" | "lg" | "xl";

  readonly shape?: "round" | "circle" | "rect";
}

const BaseChip = (props: BaseChipProps): JSX.Element => {
  const {
    className,
    id,
    style,
    readOnly,
    selected,
    onSelected,
    size = "md",
    shape = "circle",
    label,
  } = props;

  return (
    <div
      id={id}
      style={style}
      className={clsx(
        "flex-center inline cursor-pointer",
        readOnly && "cursor-default",
        selected && "selected",
        size === "xs" && "xs",
        size === "sm" && "sm",
        size === "md" && "md",
        size === "lg" && "lg",
        size === "xl" && "xl",
        shape === "circle" && "circle",
        shape === "rect" && "rect",
        shape === "round" && "round",
        className
      )}
      onClick={() => {
        onSelected?.call(null);
      }}
    >
      {label}
    </div>
  );
};

export default BaseChip;
