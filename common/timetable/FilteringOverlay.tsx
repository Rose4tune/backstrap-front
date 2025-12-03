import clsx from "clsx"

import { FilterLabels, SemesterToKR } from "@constants/timetable.constant"
import Overlay, { OverlayPosition } from "elements/Overlay"
import TimeTableListItem from "./TimeTableListItem"
import useTimeTableContext from "@hooks/context/useTimeTableContext.hook"
import CloseIcon from 'public/icons/close-black.svg'
import TimeTableIcon from 'public/icons/timetable.svg'
import { CategoryRefViewDto } from "@generated/graphql"
import FilteringOverlayListItem from "./FilteringOverlayListItem"

interface FilteringOverlayProps {
  show: boolean
  placement: typeof OverlayPosition[keyof typeof OverlayPosition]
  onHide: () => void
  categories: CategoryRefViewDto[]
  onClickCategory: (category: CategoryRefViewDto, label: FilterLabels) => void
  label: FilterLabels
}

function FilteringOverlay({
  show,
  placement,
  onHide,
  categories,
  onClickCategory,
  label,
}: FilteringOverlayProps) {
  const { timeTablesAction, timeTableTemplates, optionOverlayTarget } = useTimeTableContext()

  return (
    <Overlay
      show={show}
      target={optionOverlayTarget}
      placement={placement}
      onHide={onHide}
      marginY={5}
    >
      <div
        className={clsx(
          "box-border p-4 shadow-[0px_-5px_5px_0px_rgba(0,0,0,.1)]",
          "w-[350px] h-[calc(100vh-300px)] bg-white overflow-y-scroll",
          "animate-[fade-in-up_0.3s_ease-in-out]",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div
            className={clsx(
              "flex items-center gap-2",
              "text-[20px] font-bold",
            )}
          >
            <TimeTableIcon className="w-[18px] h-[18px]" />
            { label }
          </div>

          <div
            onClick={onHide}
          >
            <CloseIcon className="[&>path]:fill-[#A9A9A9] cursor-pointer"/>
          </div>
        </div>

        { categories.map(category => (
          <FilteringOverlayListItem
            key={category.uuid}
            category={category}
            label={label}
            onClick={onClickCategory}
          />
        ))}
      </div>
    </Overlay>
  )
}

export default FilteringOverlay
