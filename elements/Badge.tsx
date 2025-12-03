import clsx from "clsx"

interface BadgeProps {
  content: string
  color?: string
  className?: string
  contentClassName?: string
}

function Badge({
  content,
  color,
  className,
  contentClassName,
}: BadgeProps) {
  return (
    <div className={clsx(
      "h-[22px] p-1",
      "box-border border border-primary-dark-light rounded-[4px]",
      "flex items-center justify-center",
      "select-none",
      className,
    )}>
      <div className={clsx("text-[10px] font-bold", contentClassName)} style={{ color }}>
        { content }
      </div>
    </div>
  )
}

export default Badge
