import { useCallback } from "react"

import { DayOfWeek } from "@generated/graphql"
import Day from "./Day"

interface DayPickerProps {
  onChange: (day: DayOfWeek) => void
}

function DayPicker({
  onChange,
}: DayPickerProps) {

  return (
    <div className="mt-16">
      <div className="box-border p-1 mt-5 mb-3 text-[14px] text-[#BFBFBF] select-none">
        시간표 요일
      </div>
      <div className="flex gap-2 items-center">
        <Day day={DayOfWeek.Monday} onClick={onChange} />
        <Day day={DayOfWeek.Tuesday} onClick={onChange} />
        <Day day={DayOfWeek.Wednesday} onClick={onChange} />
        <Day day={DayOfWeek.Thursday} onClick={onChange} />
        <Day day={DayOfWeek.Friday} onClick={onChange} />
        <Day day={DayOfWeek.Saturday} onClick={onChange} />
        <Day day={DayOfWeek.Sunday} onClick={onChange} />
      </div>
    </div>
  )
}

export default DayPicker
