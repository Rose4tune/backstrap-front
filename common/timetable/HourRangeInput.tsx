import clsx from "clsx"
import { useCallback, useEffect, useRef, useState } from "react"

import useTimeTableContext from "@hooks/context/useTimeTableContext.hook"
import { HourRange } from "@contexts/timetable.context"

import styles from './HourRangeInput.module.scss'

interface HourRangeInputProps {
  onChange: (hourRange: HourRange) => void
}

function HourRangeInput({
  onChange,
}: HourRangeInputProps) {
  const { hourRange } = useTimeTableContext()

  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)
  const rangeRef = useRef<HTMLDivElement>(null)
  const [min, setMin] = useState(hourRange.from)
  const [max, setMax] = useState(hourRange.to)

  const getPercent = useCallback((value: number) => Math.round((value / 24) * 100), [])

  useEffect(() => {
    if (maxInputRef.current) {
      const minPercent = getPercent(min)
      const maxPercent = getPercent(+maxInputRef.current.value)

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [min, getPercent])

  useEffect(() => {
    if (minInputRef.current) {
      const minPercent = getPercent(+minInputRef.current.value)
      const maxPercent = getPercent(max)

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [max, getPercent])

  useEffect(() => {
    onChange({
      from: min,
      to: max,
    })
  }, [min, max, onChange])

  return (
    <>
      <div className="box-border p-1 mt-10 text-[14px] text-[#BFBFBF] select-none">
        시간표 시간
      </div>
      <div className="relative w-[300px]">
        <input
          ref={minInputRef}
          className={clsx(
            styles.rangeInput,
            "pointer-events-none absolute",
            "z-[3] w-full opacity-0"
          )}
          type="range"
          min="0"
          max="24"
          value={min}
          onChange={(event) => {
            const value = Math.min(+event.target.value, max - 1)
            setMin(value)
            event.target.value = value.toString()
          }}
        />
        <input
          ref={maxInputRef}
          className={clsx(
            styles.rangeInput,
            "pointer-events-none absolute",
            "z-[3] w-full opacity-0",
          )}
          type="range"
          min="0"
          max="24"
          value={max}
          onChange={(event) => {
            const value = Math.max(+event.target.value, min + 1)
            setMax(value)
            event.target.value = value.toString()
          }}
        />

        <div className="absolute inset-0 h-[10px] top-[5px]">
          <div className="absolute inset-0 rounded bg-[#CDCDCD]" />
          <div
            ref={rangeRef}
            className="absolute inset-y-0 rounded bg-[#5AC7BB]"
          />
          <div
            className={clsx(
              "absolute inset-y-0 left-[5%] translate-x-[-5px] translate-y-[15px]",
              "cursor-default"
            )}
          >
            { min }
          </div>
          <div
            className={clsx(
              "absolute inset-y-0 right-[5%] translate-x-[8px] translate-y-[15px]",
              "cursor-default"
            )}
          >
            { max }
          </div>
        </div>
      </div>
    </>
  )
}

export default HourRangeInput
