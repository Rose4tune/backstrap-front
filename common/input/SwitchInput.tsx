import { Switch } from "@headlessui/react";
import clsx from "clsx";

export interface SwitchInputProps extends BaseProps {
  checked?: boolean;

  disabled?: boolean;

  onChange?: (checked: boolean) => void;

  size?: "sm" | "md";
}

const SwitchInput = (props: SwitchInputProps): JSX.Element => {
  const { checked = false, disabled, onChange = () => {}, size = "sm" } = props;

  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className={clsx(
        "relative inline-flex items-center rounded-full",
        size === "sm" && "w-5 h-3",
        size === "md" && "w-8 h-4",
        checked ? "bg-primary" : "bg-[#BFBFBF]"
      )}
    >
      <span
        className={clsx(
          "inline-block bg-white rounded-full box-shadow",
          "transform transition-transform",
          checked
            ? (size === "sm" && "translate-x-2") ||
                (size === "md" && "translate-x-4")
            : "translate-x-[1px]",
          size === "sm" && "w-[10px] h-[10px]",
          size === "md" && "w-[14px] h-[14px]"
        )}
      />
    </Switch>
  );
};

export default SwitchInput;
