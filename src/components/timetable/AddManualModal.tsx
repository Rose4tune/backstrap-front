import DropdownInput from "@common/input/DropdownInput";
import TextField from "@common/input/TextField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LeftArrowIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg"
import PlusIcon from "src/assets/icons/common/PlusIcon.svg"
import DeleteIcon from "src/assets/icons/common/DeleteIcon.svg"
import TimeRangeInput from "./TimeRangeInput";
import FillButton from "@common/button/FillButton";
import { components } from "src/types/api";
import editTimeTable from "@api/time-table/editTimeTable";
import useAccessToken from "src/hooks/useAcessToken";
import { formatTime } from "src/utils/timetable/formatTime";
import ErrorPopup from "@common/ErrorPopup";
import { useStore } from "@stores/useStore.hook";
import { useTimeTableRefetch } from "src/hooks/timetable/useTimeTableRefetch";
import { observer } from "mobx-react";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];


interface ManualModalProps {
    setIsManualModalOpen: Dispatch<SetStateAction<boolean>>;
    timeTableUuid?: string;
    setSelectedTimeTableEntity: Dispatch<SetStateAction<TimeTableEntityView | undefined>>
    selectedTimeTableEntity: TimeTableEntityView
    selectedSemester: TimeTableTemplate
}

type TimeTableEntityView = components['schemas']['TimeTableEntityView']
type TimeTableEditDto = components['schemas']['TimeTableEditDto']
type DayAndTimeRange = {
    dayOfWeek: WeekdayEnum;
    timeRange: {
        fromTime: string;
        toTime: string;
    };
};
type WeekdayEnum = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

const weekdayMap: Record<string, WeekdayEnum> = {
    월요일: 'MONDAY',
    화요일: 'TUESDAY',
    수요일: 'WEDNESDAY',
    목요일: 'THURSDAY',
    금요일: 'FRIDAY',
    토요일: 'SATURDAY',
    일요일: 'SUNDAY',
};

const reverseWeekdayMap: Record<WeekdayEnum, string> = Object.entries(weekdayMap)
    .reduce((acc, [kor, eng]) => ({ ...acc, [eng]: kor }), {} as Record<WeekdayEnum, string>);

function AddManualModal(props: ManualModalProps) {
    const { setIsManualModalOpen, timeTableUuid, setSelectedTimeTableEntity, selectedTimeTableEntity, selectedSemester } = props
    const [className, setClassName] = useState<string>("")
    const [professorName, setProfessorName] = useState<string>("")
    const [placeName, setPlaceName] = useState<string>("")
    const [grade, setGrade] = useState<number>()
    const [dayAndTimeRanges, setDayAndTimeRanges] = useState<DayAndTimeRange[]>([
        {
            dayOfWeek: 'MONDAY',
            timeRange: {
                fromTime: '',
                toTime: '',
            },
        },
    ]);
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId()
    const accessToken = UserStore.getAccessToken()

    const { refetch } = useTimeTableRefetch({
        selectedSemester,
        userUuid: userUuid,
        accessToken,
        setSelectedTimeTableEntity,
        selectedTimeTableEntity,
        onError: (m) => { setErrorMessage(m); setIsErrorPopupOpen(true); },
    });


    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const isFormValid =
        className.trim() !== "" &&
        professorName.trim() !== "" &&
        placeName.trim() !== ""


    async function handleAddClass() {
        if (!isFormValid || !timeTableUuid) return;

        const toMinutes = (time: string) => {
            const [h, m] = [time.slice(0, 2), time.slice(2)];
            return parseInt(h) * 60 + parseInt(m);
        };

        const existingRanges = (selectedTimeTableEntity?.customCourses ?? [])
            .flatMap(c => c.dayAndTimeRanges ?? []);

        for (const newRange of dayAndTimeRanges) {
            const newStart = toMinutes(newRange.timeRange.fromTime);
            const newEnd = toMinutes(newRange.timeRange.toTime);

            for (const existing of existingRanges) {
                if (existing.dayOfWeek !== newRange.dayOfWeek) continue;
                if (!existing.timeRange?.fromTime || !existing.timeRange?.toTime) continue;

                const existingStart = toMinutes(existing.timeRange.fromTime.replace(/:/g, ""));
                const existingEnd = toMinutes(existing.timeRange.toTime.replace(/:/g, ""));

                if (newStart < existingEnd && newEnd > existingStart) {
                    setErrorMessage(
                        `${reverseWeekdayMap[newRange.dayOfWeek]} ${existing.timeRange.fromTime}~${existing.timeRange.toTime} 시간대에 이미 수업이 있습니다.`
                    );
                    setIsErrorPopupOpen(true);
                    return;
                }
            }
        }

        // 기존 course 변환
        const existingCourses = (selectedTimeTableEntity?.customCourses ?? []).map(c => ({
            courseGrade: c.courseGrade,
            dayAndTimeRanges: c.dayAndTimeRanges ?? [],
            entityStatus: c.entityStatus,
            professors: c.professors ?? "",
            roomName: c.roomName ?? "",
            subjectName: c.subjectName ?? "",
            timeTableUuid: timeTableUuid,
        }));

        // 새 course
        const newCourse = {
            courseGrade: grade ?? 3,
            dayAndTimeRanges: dayAndTimeRanges.map(range => ({
                dayOfWeek: range.dayOfWeek,
                timeRange: {
                    fromTime: formatTime(range.timeRange.fromTime),
                    toTime: formatTime(range.timeRange.toTime),
                },
            })),
            professors: professorName,
            roomName: placeName,
            subjectName: className,
            timeTableUuid: timeTableUuid,
        };

        const updatedCustomCourses = [...existingCourses, newCourse];

        const existingSchoolCourses = (selectedTimeTableEntity?.schoolCourses ?? []).map((c) => ({
            schoolCourseUuid: c.uuid!,
            timeTableUuid: timeTableUuid,
        }));

        const payload: TimeTableEditDto = {
            uuid: timeTableUuid,
            customCourses: updatedCustomCourses,
            timeTableSchoolCourses: existingSchoolCourses,
        };
        try {
            const res = await editTimeTable(payload, accessToken);
            if (res.success) {
                await refetch();
                setIsManualModalOpen(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message); // 일반 에러 객체라면 message 사용
            } else if (typeof error === "object" && error !== null && "messages" in error) {
                setErrorMessage((error as any).messages); // API 응답 형태로 예상되면 messages 사용
            } else {
                setErrorMessage("시간표가 추가되지 않았습니다.");
            }
            setIsErrorPopupOpen(true);
        }
    }



    return (
        <>
            <div className="fixed inset-0 bg-dim z-[1000]" />
            <div className="max-h-[500px] overflow-y-auto scroll-custom flex flex-col gap-5 fixed left-1/2 -translate-x-1/2 top-1/4 -translate-y-1/4 w-[400px] px-[20px] pt-[28px] pb-[36px] bg-white rounded-[8px] z-[1001]">
                <div className="flex justify-between">
                    <button onClick={() => setIsManualModalOpen(false)}>
                        <LeftArrowIcon className="w-[20px] h-[20px] text-gray-50" />

                    </button>
                    <span className="text-semibold-16 text-gray-90">수업 추가</span>
                    <div className="w-[20px] h-[20px]" />
                </div>
                <TextField title="수업명" device="mobile" value={className} onChange={setClassName} placeholder="수업명을 입력해주세요" />
                <TextField title="교수명" device="mobile" value={professorName} onChange={setProfessorName} placeholder="교수님의 성함을 입력해주세요" />
                <TextField title="강의실" device="mobile" value={placeName} onChange={setPlaceName} placeholder="강의실을 입력해주세요  " />
                <TextField
                    title="학점"
                    device="mobile"
                    value={grade !== undefined ? String(grade) : ""}
                    onChange={(val) => {
                        if (/^\d?$/.test(val)) {
                            setGrade(val ? Number(val) : undefined);
                        }
                    }}
                    placeholder="학점을 입력해주세요"
                />

                <div className="space-y-[8px]">
                    <div className="flex justify-between items-center">
                        <span className="text-med-14 text-gray-90">수업 시간</span>
                        <button
                            onClick={() =>
                                setDayAndTimeRanges(prev => [
                                    ...prev,
                                    {
                                        dayOfWeek: 'MONDAY',
                                        timeRange: { fromTime: '', toTime: '' },
                                    },
                                ])
                            }
                            className="w-[32px] h-[32px] flex justify-center items-center bg-gray-20 rounded-[8px]"
                        >
                            <PlusIcon className="w-[16px] h-[16px] text-gray-60" />
                        </button>
                    </div>
                    {dayAndTimeRanges.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                            <div className="w-[95px]">
                                <DropdownInput
                                    placeholder="요일"
                                    options={Object.keys(weekdayMap)}
                                    value={reverseWeekdayMap[item.dayOfWeek]}
                                    onChange={(val: string) => {
                                        const updated = [...dayAndTimeRanges];
                                        updated[idx].dayOfWeek = weekdayMap[val];
                                        setDayAndTimeRanges(updated);
                                    }}
                                />
                            </div>
                            <TimeRangeInput
                                startTime={item.timeRange.fromTime}
                                endTime={item.timeRange.toTime}
                                setStartTime={(val: string) => {
                                    const updated = [...dayAndTimeRanges];
                                    updated[idx].timeRange.fromTime = val;
                                    setDayAndTimeRanges(updated);
                                }}
                                setEndTime={(val: string) => {
                                    const updated = [...dayAndTimeRanges];
                                    updated[idx].timeRange.toTime = val;
                                    setDayAndTimeRanges(updated);
                                }}
                            />
                            <button
                                onClick={() => {
                                    const updated = [...dayAndTimeRanges];
                                    updated.splice(idx, 1);
                                    setDayAndTimeRanges(updated);
                                }}
                            >
                                <DeleteIcon className={`w-[20px] h-[20px] text-red`} />
                            </button>
                        </div>
                    ))}
                </div>
                <FillButton
                    text="추가하기"
                    size="Large"
                    buttonStatus={isFormValid ? "active" : "disable"}
                    onClick={handleAddClass}
                />
            </div>
            <ErrorPopup
                isOpen={isErrorPopupOpen}
                setIsOpen={setIsErrorPopupOpen}
                errorMessage={errorMessage}
            />
        </>

    )
}

export default observer(AddManualModal)