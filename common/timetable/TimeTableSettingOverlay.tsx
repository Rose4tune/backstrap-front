import { useCallback, useMemo, useState } from "react"
import clsx from "clsx"

import useTimeTableContext from "@hooks/context/useTimeTableContext.hook"
import Overlay, { OverlayPosition } from "elements/Overlay"
import Button, { ButtonStyle } from "elements/Button"
import { DayOfWeek } from "@generated/graphql"
import { HourRange } from "@contexts/timetable.context"
import HourRangeInput from "./HourRangeInput"
import DayPicker from "./DayPicker"
import NewTimeTableInputField from "./NewTimeTableInputField"
import DeleteWarning from "./DeleteWarning"

import Close from 'public/icons/close-black.svg'
import Plus from 'public/icons/plus.svg'
import Delete from 'public/icons/trash.svg'
import SettingIcon from 'public/icons/setting.svg'

interface TimeTableSettingOverlayProps {
  show: boolean
  placement: typeof OverlayPosition[keyof typeof OverlayPosition]
  onHide: () => void
}

function TimeTableSettingOverlay({
  show,
  placement,
  onHide
}: TimeTableSettingOverlayProps) {
  const {
    timeTables,
    timeTableTemplates,
    optionOverlayTarget,
    hourRange,
    setHourRange,
    daysOfWeek,
    setDaysOfWeek,
  } = useTimeTableContext()

  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const [tempHourRange, setTempHourRange] = useState<HourRange>(hourRange)
  const [tempDaysOfWeek, setTempDaysOfWeek] = useState<DayOfWeek[]>(daysOfWeek)

  const PlusIcon = useMemo(() => (
    <Plus className="[&>g>path]:fill-white"/>
  ), [])

  const DeleteIcon = useMemo(() => (
    <Delete className="fill-white"/>
  ), [])

  const handleCloseOverlay = useCallback(() => {
    onHide()
    setShowRegisterForm(false)
    setShowDeleteWarning(false)
  }, [onHide])

  const clickCreateNewTable = useCallback(() => {
    setShowDeleteWarning(false)
    setShowRegisterForm(true)
  }, [])

  const clickDeleteTable = useCallback(() => {
    setShowDeleteWarning(true)
    setShowRegisterForm(false)
  }, [])

  const onChangeTempHourRange = useCallback((range: HourRange) => {
    setTempHourRange(range)
  }, [])

  const onChangeTempDaysOfWeek = useCallback((day: DayOfWeek) => {
    if (tempDaysOfWeek.includes(day)) {
      const index = tempDaysOfWeek.findIndex(d => d === day)
      if (index > -1) {
        const newTempDaysOfWeek = [...tempDaysOfWeek]
        newTempDaysOfWeek.splice(index, 1)
        setTempDaysOfWeek(newTempDaysOfWeek)
      }
    } else {
      setTempDaysOfWeek([...tempDaysOfWeek, day])
    }
  }, [tempDaysOfWeek])

  const isDirty = useMemo(() => (
    JSON.stringify(tempDaysOfWeek) !== JSON.stringify(daysOfWeek) ||
    JSON.stringify(tempHourRange) !== JSON.stringify(hourRange)
  ), [daysOfWeek, hourRange, tempDaysOfWeek, tempHourRange])

  const handleConfirmOptionChanges = useCallback(() => {
    setHourRange(tempHourRange)
    setDaysOfWeek(tempDaysOfWeek)
  }, [setDaysOfWeek, setHourRange, tempDaysOfWeek, tempHourRange])

  const resetOptionChanges = useCallback(() => {
    setTempHourRange(hourRange)
    setTempDaysOfWeek(daysOfWeek)
  }, [daysOfWeek, hourRange])

  return (
    <Overlay
      show={show}
      target={optionOverlayTarget}
      placement={placement}
      onHide={handleCloseOverlay}
      marginY={5}
    >
      <div
        className={clsx(
          "box-border p-4 shadow-[0px_-5px_5px_0px_rgba(0,0,0,.1)]",
          "w-[350px] h-[calc(100vh-300px)] bg-white overflow-y-scroll",
          "animate-[fade-in-up_0.3s_ease-in-out]",
        )}
      >
        <div className="flex items-center justify-between">
          <div
            className={clsx(
              "flex items-center gap-2",
              "text-[20px] font-bold",
            )}
          >
            <SettingIcon className="fill-black"/>
            설정
          </div>
          <div onClick={handleCloseOverlay}>
            <Close className="[&>path]:fill-[#A9A9A9] cursor-pointer"/>
          </div>
        </div>

        <div
          className={clsx(
            "flex gap-2",
            "box-border mt-10 mb-5",
            (!showRegisterForm && !showDeleteWarning) && "pb-24"
          )}
        >
          <Button
            className="flex-[1_1_50%] text-[14px] hover:bg-[#000000]/75 py-1.5"
            buttonStyle={ButtonStyle.Dark}
            LeftIcon={PlusIcon}
            text='새 시간표 추가'
            onClick={clickCreateNewTable}
          />
          <Button
            className="flex-[1_1_50%] text-[14px] hover:bg-[#000000]/75 py-1.5"
            buttonStyle={ButtonStyle.Dark}
            LeftIcon={DeleteIcon}
            text='이 시간표 삭제'
            onClick={clickDeleteTable}
          />
        </div>

        { showRegisterForm && <NewTimeTableInputField onHide={onHide} /> }
        { showDeleteWarning && <DeleteWarning onHide={onHide} /> }

        {/* bar input */}
        <HourRangeInput onChange={onChangeTempHourRange} />

        {/* day selector */}
        <DayPicker
          onChange={onChangeTempDaysOfWeek}
        />

        <div
          className={clsx(
            "flex justify-end items-center gap-2",
            "mt-8"
          )}
        >
          <Button
            className="flex-[0_1_20%] text-[14px] border-[2px] border-[#CDCDCD] py-1.5 px-2"
            buttonStyle={ButtonStyle.Normal}
            text='취소'
            onClick={resetOptionChanges}
          />
          <Button
            className="flex-[0_1_20%] text-[14px] py-1.5 border-[2px] font-bold"
            buttonStyle={isDirty ? ButtonStyle.Activate : ButtonStyle.Disabled}
            text='저장'
            onClick={handleConfirmOptionChanges}
          />
        </div>
      </div>
    </Overlay>
  )
}

export default TimeTableSettingOverlay
