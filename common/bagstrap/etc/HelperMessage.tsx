import clsx from "clsx";

import CautionInfoIcon from "@public/icons/caution-info.svg";
import CautionErrorIcon from "@public/icons/caution-error.svg";
import CautionPassIcon from "@public/icons/caution-pass.svg";

export interface HelperMessageProps extends BaseProps {
  type: "info" | "error" | "pass";

  text: string;

  color?: string;

  icon?: React.ReactNode;

  size?: "sm" | "md" | "lg";

  responsive?: boolean;
}

const getCautionColor = (
  type: "info" | "error" | "pass"
): string | undefined => {
  if (type === "info") {
    return "#157974";
  }

  if (type === "error") {
    return "#EF6969";
  }

  if (type === "pass") {
    return "#00CBBC";
  }
};

const getCautionIcon = (
  type: "info" | "error" | "pass",
  size: "sm" | "md" | "lg"
): React.ReactNode | undefined => {
  const className = clsx(
    size === "sm" && "w-3.5 h-3.5",
    size === "md" && "w-[18px] h-[18px]"
  );

  if (type === "info") {
    return <CautionInfoIcon className={className} />;
  }

  if (type === "error") {
    return <CautionErrorIcon className={className} />;
  }

  if (type === "pass") {
    return <CautionPassIcon className={className} />;
  }
};

const HelperMessage = (props: HelperMessageProps): JSX.Element => {
  const { type, text, className, size = "sm", responsive } = props;

  const color = props.color || getCautionColor(type);

  const icon = props.icon || getCautionIcon(type, size);

  return (
    <div
      style={{
        color,
      }}
      className={clsx(
        "flex items-center",
        size === "sm" && "gap-1.5",
        size === "md" && "gap-2",
        size === "lg" && "gap-2.5",
        className
      )}
    >
      {icon}
      <p
        className={clsx(
          "font-medium leading-none",
          size === "sm" && "typo-body8",
          size === "sm" && responsive && "",
          size === "md" && "typo-body7",
          size === "md" && responsive && "md:typo-body5 md:font-bold",
          size === "lg" && "typo-body6",
          size === "sm" && responsive && ""
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default HelperMessage;
