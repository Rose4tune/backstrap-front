import { useCallback, useMemo } from "react"
import clsx from "clsx"

import { CategoryRefViewDto } from "@generated/graphql"
import { FilterLabels } from "@constants/timetable.constant"
import Star from 'public/icons/star.svg'

interface FilteringOverlayListItemProps {
  onClick: (category: CategoryRefViewDto, label: FilterLabels) => void
  category: CategoryRefViewDto
  label: FilterLabels
}

function FilteringOverlayListItem({
  onClick,
  category,
  label,
}: FilteringOverlayListItemProps) {

  const handleClickItem = useCallback(() => {
    onClick(category, label)
  }, [category, label, onClick])

  const StarIcon = useMemo(() => (
    <Star
      className={clsx(
        "[&>path]:stroke-none",
        "w-[14px] h-[14px]",
        "transition-all duration-200 ease-in-out",
        category.isScraped ? "fill-[#FFD30C]" : "fill-[#ffffff]",
      )}
    />
  ), [category.isScraped])

  return (
    <div
      className={clsx(
        "flex items-center gap-2",
        "box-border px-3 py-1 my-3",
        "cursor-pointer",
        "rounded-[8px] hover:bg-[#EFF6F6]",
        "transition-all duration-200 ease-in-out",
      )}
      onClick={handleClickItem}
    >
      <div className={clsx(
        "w-[16px] h-[16px]",
        "flex justify-center items-center",
        "rounded-full bg-[#D7D7D7]",
        "transition-all duration-200 ease-in-out",
        category.isScraped && "bg-black"
      )}>
        { StarIcon }
      </div>
      <div className={clsx(
        "leading-5",
        "transition-all duration-200 ease-in-out",
        "hover:font-bold hover:text-[#00CBBC]",
      )}>
        { category.name }
      </div>
    </div>
  )
}

export default FilteringOverlayListItem
