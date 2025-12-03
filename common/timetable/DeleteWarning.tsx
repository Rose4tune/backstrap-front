
import { useDeleteTimeTableMutation } from "@generated/graphql"
import useTimeTableContext from "@hooks/context/useTimeTableContext.hook"
import clsx from "clsx"
import Button, { ButtonStyle } from "elements/Button"
import { useCallback } from "react"

interface DeleteWarningProps {
  onHide: () => void
}

function DeleteWarning({ onHide }: DeleteWarningProps) {
  const {
    currentTimeTable,
    setCurrentTimeTable,
    timeTables,
    timeTablesAction,
    currentTimeTableTemplate,
  } = useTimeTableContext()

  const [deleteTimeTable] = useDeleteTimeTableMutation()

  const handleDeleteTimeTable = useCallback(() => {
    if (currentTimeTable) {
      deleteTimeTable({
        variables: {
          uuid: currentTimeTable.uuid
        },
        onCompleted: () => {
          timeTablesAction?.remove(currentTimeTable.uuid)
          onHide()

          const newCurrentTimeTable = timeTablesAction?.toValueArray().filter(timetable => (
              timetable.uuid!=currentTimeTable.uuid &&
            timetable.year === currentTimeTableTemplate?.year &&
            timetable.semester === currentTimeTableTemplate?.semester
          ))


          if (newCurrentTimeTable?.at(0)) setCurrentTimeTable(newCurrentTimeTable[0])
          else setCurrentTimeTable(undefined)
        }
      })
    }
  }, [
    currentTimeTable,
    currentTimeTableTemplate?.semester,
    currentTimeTableTemplate?.year,
    deleteTimeTable,
    onHide,
    setCurrentTimeTable,
    timeTablesAction,
  ])

  return (
    <div className="w-full animate-[fade-in_0.2s_ease-in-out] mt-[30px]">
      <div className="text-[14px] text-[#454545] my-1">
        정말로 삭제하시겠습니까?
      </div>
      <div
        className={clsx(
          "font-bold text-[18px]",
          "flex items-center align-middle"
        )}
      >
        [&nbsp;
        <div className="line-clamp-1 text-ellipsis overflow-hidden break-all">
          { currentTimeTable?.name ?? '현재 시간표' }
        </div>
        &nbsp;]
      </div>

      <div className="flex justify-end mt-2">
        <Button
          className="text-[14px] py-1.5 border-[2px] px-2.5 py-1 tracking-wide"
          buttonStyle={ButtonStyle.Warning}
          text='시간표 삭제'
          onClick={handleDeleteTimeTable}
        />
      </div>
    </div>
  )
}

export default DeleteWarning
