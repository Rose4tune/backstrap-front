import clsx from "clsx"
import { ForwardedRef, forwardRef, MouseEvent, useMemo } from "react"

export const ButtonStyle = {
  Normal: 'Normal',
  NormalBlue: 'NormalBlue',
  Disabled: 'Disabled',
  Activate: 'Activate',
  Dark: 'Dark',
  DarkHighlight: 'DarkHighlight',
  Warning: 'Warning',
} as const

interface ButtonProps {
  buttonStyle: typeof ButtonStyle[keyof typeof ButtonStyle]
  LeftIcon?: any
  RightIcon?: any
  text: string | React.ReactNode
  onClick: (e: MouseEvent) => void
  className?: string
}

function Button({
  buttonStyle = ButtonStyle.Normal,
  LeftIcon,
  RightIcon,
  text,
  onClick,
  className,
}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const buttonClassNames = useMemo(() => {
    switch (buttonStyle) {
      case ButtonStyle.Normal:
        return clsx(
          "border border-[#000000] round-[12px]",
          "cursor-pointer",
        )
      case ButtonStyle.NormalBlue:
        return clsx(
          "border border-[#6990EF] round-[12px]",
          "text-[#6990EF]",
          "cursor-pointer",
        )
      case ButtonStyle.Disabled:
        return clsx(
          "border border-[#BFBFBF] round-[12px]",
          "bg-[#F6F6F6] text-[#BFBFBF]",
          "cursor-not-allowed",
        )
      case ButtonStyle.Activate:
        return clsx(
          "border-[2px] border-[#5AC7BB] round-[12px] px-2",
          "text-[#5AC7BB] font-bold",
          "cursor-pointer",
          "hover:bg-[#5AC7BB] hover:text-white"
        )
      case ButtonStyle.Dark:
        return clsx(
          "round-[12px] px-2",
          "bg-black text-[#ffffff]",
          "cursor-pointer",
        )
      case ButtonStyle.DarkHighlight:
        return clsx(
          "round-[12px] px-2",
          "bg-black text-[#FFD30C]",
          "cursor-pointer",
        )
      case ButtonStyle.Warning:
        return clsx(
          "round-[12px] px-2",
          "border-[#EF6969] text-[#EF6969] font-bold",
          "cursor-pointer",
          "hover:bg-[#EF6969] hover:text-white"
        )
      default:
        return ''
    }
  }, [buttonStyle])

  return (
    <button
      ref={ref}
      className={clsx(
        "flex justify-center items-center box-border",
        buttonClassNames,
        "box-border p-1 rounded-[8px]",
        "text-ellipsis overflow-hidden",
        "transition-all duration-200 ease-in-out",
        !!LeftIcon && "justify-evenly",
        !!RightIcon && "justify-between",
        className,
      )}
      onClick={onClick}
      disabled={buttonStyle === ButtonStyle.Disabled}
    >
      { LeftIcon }
      { text }
      { RightIcon }
    </button>
  )
}

export default forwardRef(Button)
