import { components } from "src/types/api";
import AlarmIcon from "src/assets/icons/common/AlarmIcon.svg";
import { formatSemesterLabel } from "src/utils/timetable/formatSemesterLabel";
import registerTimeTable from "@api/time-table/registerTimeTable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteIcon from "src/assets/icons/common/DeleteIcon.svg"
import ErrorPopup from "@common/ErrorPopup";
import editTimeTable from "@api/time-table/editTimeTable";
import { gcd, GRID_MINUTES, parseHM, snapDown5, snapUp5, toMinutes, toMinutesRounded5 } from "src/utils/timetable/timetableGrid";
import { useStore } from "@stores/useStore.hook";
import getTimeTables from "@api/time-table/getTimeTables";
import toast from "react-hot-toast";
import { useTimeTableRefetch } from "src/hooks/timetable/useTimeTableRefetch";
import { observer } from "mobx-react";

type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEditDto = components["schemas"]["TimeTableEditDto"]

interface TimeTableProps {
    selectedTimeTableEntity: TimeTableEntityView;
    setSelectedTimeTableEntity: Dispatch<SetStateAction<TimeTableEntityView | undefined>>
    selectedSemester?: TimeTableTemplate;
    timeTableEntityList: TimeTableEntityView[]
    setTimeTableEntityList: Dispatch<SetStateAction<TimeTableEntityView[]>>
    isMobile?: boolean;
}

const defaultDays = ["월", "화", "수", "목", "금"];
const dayMap: Record<string, string> = {
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
    SUNDAY: "일",
};

function TimeTable({
    selectedTimeTableEntity,
    setSelectedTimeTableEntity,
    selectedSemester,
    timeTableEntityList,
    setTimeTableEntityList,
    isMobile
}: TimeTableProps) {
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies();
    const userUuid = UserStore.getUserId();

    //refetch 관련 로직
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

    const [selectedCourseInfo, setSelectedCourseInfo] = useState<{
        uuid: string;
        position: { top: number; left: number; };
    } | null>(null);
    // 시간표 재조회 함수
    async function fetchTimeTables() {
        if (!userUuid || !accessToken || !selectedSemester) return;

        try {
            const response = await getTimeTables(
                { semesterType: selectedSemester.semester, userUuid, year: selectedSemester.year },
                accessToken
            );
            if (response.success && response.data) {
                setTimeTableEntityList(response.data);
            }
        } catch (error) {
            toast.error("시간표를 가져오는 데 실패했습니다.");
        }
    }
    /**시간표 추가하기 버튼 눌렀을 때 */
    async function handleAddTimeTable() {
        if (!selectedSemester) return;
        try {
            const res = await registerTimeTable(
                {
                    name: "시간표",
                    semester: selectedSemester.semester!,
                    year: Number(String(selectedSemester.year)),
                    representativeColorType: "RED",
                    entityStatus: "ACTIVE"
                },
                accessToken
            );
            if (res.success && res.data) {
                await fetchTimeTables()
                setSelectedTimeTableEntity(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(courseToDelete: { uuid: string }) {
        if (!courseToDelete?.uuid || !accessToken || !selectedTimeTableEntity?.uuid) {
            console.error("삭제할 수업의 UUID 또는 시간표 정보가 없습니다.");
            return;
        }

        const updatedSchoolCourses = (selectedTimeTableEntity.schoolCourses ?? [])
            .filter(c => c.uuid !== courseToDelete.uuid)
            .map(c => ({
                schoolCourseUuid: c.uuid,
                timeTableUuid: selectedTimeTableEntity.uuid
            }));

        const updatedCustomCourses = (selectedTimeTableEntity.customCourses ?? [])
            .filter(c => c.uuid !== courseToDelete.uuid)
            .map(c => ({
                subjectName: c.subjectName ?? "이름 없음",
                professors: c.professors ?? "미지정",
                dayAndTimeRanges: c.dayAndTimeRanges ?? [],
                timeTableUuid: selectedTimeTableEntity.uuid!,
                roomName: c.roomName,
                courseGrade: c.courseGrade,
            }));

        const payload: TimeTableEditDto = {
            uuid: selectedTimeTableEntity.uuid,
            timeTableSchoolCourses: updatedSchoolCourses,
            customCourses: updatedCustomCourses,
        };

        try {
            const response = await editTimeTable(payload, accessToken);

            if (response.success) {
                await refetch();
                // 삭제 팝업 닫기
                setSelectedCourseInfo?.(null as any);
                return;
            } else {
                // 실패 처리
                console.error("수업 삭제 실패:", response.messages);
                setErrorMessage(response.messages ?? '수업 삭제에 실패했습니다. 다시 시도해주세요.');
                setIsErrorPopupOpen(true);
            }
        } catch (error: any) {
            console.error("수업 삭제 API 호출 중 에러 발생:", error);
            setErrorMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setIsErrorPopupOpen(true);
        }
    }

    // 데이터 없으면 빈 UI
    if (timeTableEntityList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] w-full bg-[#E8EAEC] rounded-[20px]">
                <AlarmIcon className="w-[40px] h-[40px] mb-[12px]" />
                <div className="text-center mb-[12px]">
                    <h2 className="text-semibold-22 text-gray-90 mb-[4px]">
                        {formatSemesterLabel({
                            semester: selectedSemester?.semester,
                            year: selectedSemester?.year,
                        })}{" "}
                        시간표
                    </h2>
                    <p className="text-med-1 text-gray-60">
                        새 시간표를 만들어 강의를 추가해보세요
                    </p>
                </div>
                <button
                    className="px-6 py-4 bg-normal text-white rounded-[16px] text-semibold-16 hover:bg-hover"
                    onClick={handleAddTimeTable}
                >
                    새 시간표 만들기
                </button>
            </div>
        );
    }

    const customCourses = selectedTimeTableEntity.customCourses ?? [];
    const schoolCourses = selectedTimeTableEntity.schoolCourses ?? [];
    // 시간 없는 수업들
    const noTimeCourses = [
        ...customCourses.filter(c => (c.dayAndTimeRanges?.length ?? 0) === 0 || c.dayAndTimeRanges?.some((dayandTime) => dayandTime.timeRange?.fromTime == null || dayandTime.timeRange?.toTime == null)),
        ...schoolCourses.filter(c => (c.dayAndTimeRanges?.length ?? 0) === 0),
    ];
    const colorCodes = selectedTimeTableEntity.colorCodes ?? [];

    // 모든 과목을 dayAndTimeRanges 기준으로 전개
    const allCoursesRaw = [
        ...customCourses.flatMap((c) =>
            (c.dayAndTimeRanges ?? []).filter((range) =>
                range.timeRange?.fromTime != null && range.timeRange?.toTime != null)
                .map((range) => ({
                    uuid: c.uuid ?? "",
                    name: c.subjectName ?? "",
                    room: c.roomName ?? "",
                    day: range?.dayOfWeek ? dayMap[range.dayOfWeek] : "",
                    startTime: range?.timeRange?.fromTime ?? "",
                    endTime: range?.timeRange?.toTime ?? "",
                }
                )
                )
        ),
        ...schoolCourses.flatMap((c) =>
            (c.dayAndTimeRanges ?? []).map((range) => ({
                uuid: c.uuid ?? "",
                name: c.subjectName ?? "",
                room: c.roomName ?? "",
                day: range?.dayOfWeek ? dayMap[range.dayOfWeek] : "",
                startTime: range?.timeRange?.fromTime ?? "",
                endTime: range?.timeRange?.toTime ?? "",
            }))
        ),
    ];

    // 같은 과목은 같은 색상, 다른 과목은 colorCodes 순서대로
    const courseColorMap = new Map<string, string>();
    let colorIndex = 0;

    const allCourses = allCoursesRaw
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map((course) => {
            const courseKey = `${course.name}-${course.room}`;
            if (!courseColorMap.has(courseKey)) {
                courseColorMap.set(
                    courseKey,
                    colorCodes[colorIndex % colorCodes.length] || "#000000"
                );
                colorIndex++;
            }
            return {
                ...course,
                color: courseColorMap.get(courseKey)!,
            };
        });

    // 모든 코스의 분(minute) 값 모으기 (시각의 '분' 성분)
    const minuteValues = allCoursesRaw.flatMap(c => {
        const s = parseHM(c.startTime).m;
        const e = parseHM(c.endTime).m;
        return [s, e].filter(v => Number.isFinite(v));
    });

    // 기본 단위(분) 계산: 60과 모든 분 값의 GCD
    let minUnit = minuteValues.reduce((acc, m) => gcd(acc, m), 60);
    // 혹시 비정상(0) 떨어지면 안전하게 1로
    if (!minUnit || !Number.isFinite(minUnit)) minUnit = 1;

    const allStartsRounded = allCoursesRaw.map(c => toMinutesRounded5(c.startTime));
    const allEndsRounded = allCoursesRaw.map(c => toMinutesRounded5(c.endTime));

    // 안전 기본값 09:00~18:00 고려
    const minStartAbsRaw = Math.min(...allStartsRounded, 9 * 60);
    const maxEndAbsRaw = Math.max(...allEndsRounded, 18 * 60);

    // 그리드를 ‘정시’로 정렬
    const gridStartAbs = Math.floor(minStartAbsRaw / 60) * 60; // 이전 정시
    const gridEndAbs = Math.ceil(maxEndAbsRaw / 60) * 60;    // 다음 정시
    const totalSlots = Math.ceil((gridEndAbs - gridStartAbs) / GRID_MINUTES);

    const slotsPerHour = Math.round(60 / GRID_MINUTES);

    // 요일 계산
    const usedDays = Array.from(new Set(allCourses.map((c) => c.day).filter(Boolean)));
    const days = [...defaultDays];
    if (usedDays.includes("토") && !days.includes("토")) {
        days.push("토");
    }
    if (usedDays.includes("일")) {
        days.push("토")
        days.push("일")
    };
    const renderDays = [...new Set(days)]

    const pctFromAbsMin = (absMin: number) =>
        ((absMin - gridStartAbs) / (gridEndAbs - gridStartAbs)) * 100;

    return (
        <div id="timetable" onClick={() => setSelectedCourseInfo(null)} className="relative flex flex-col flex-grow w-full">
            <div
                className="relative grid flex-grow w-full min-h-[calc(100vh-250px)]"
                style={{
                    gridTemplateColumns: `auto repeat(${renderDays.length}, 1fr)`,
                    gridTemplateRows: `auto repeat(${totalSlots}, minmax(0,1fr)`,
                }}
            >
                {/* 좌측 상단 헤더 */}
                <div className={`${isMobile ? 'text-semibold-10' : 'text-semibold-14'} text-gray-40 col-start-1 row-start-1`}>시간</div>

                {/* 요일 헤더 */}
                {renderDays.map((day, index) => (
                    <div
                        key={day}
                        className={`pb-3 text-center ${isMobile ? 'text-semibold-10' : 'text-semibold-14'} text-gray-60 row-start-1`}
                        style={{ gridColumn: index + 2 }}
                    >
                        {day}
                    </div>
                ))}

                {/* 정시 가로선: 헤더(row 1) 제외한 영역에 상대 배치 */}
                <div
                    className="relative col-start-2 col-span-full row-start-2 row-span-full pointer-events-none -z-10"
                >
                    <div className="absolute inset-0">
                        {Array.from({ length: (gridEndAbs - gridStartAbs) / 60 + 1 }).map((_, i) => {
                            const hourAbs = gridStartAbs + i * 60;
                            const topPct = ((hourAbs - gridStartAbs) / (gridEndAbs - gridStartAbs)) * 100;
                            return (
                                <div
                                    key={`hourline-bg-${i}`}
                                    className="absolute left-0 right-0 border-t border-gray-200"
                                    style={{ top: `${topPct}%` }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* 시간 라벨: '정확히 한 시간'을 정수 슬롯만큼 span */}
                {Array.from({ length: Math.ceil((gridEndAbs - gridStartAbs) / 60) }).map((_, i) => {
                    const hourAbs = gridStartAbs + i * 60;
                    const rowStart = Math.floor((hourAbs - gridStartAbs) / GRID_MINUTES) + 2;
                    const rowEnd = Math.min(rowStart + slotsPerHour, totalSlots + 2); // ← 정수 span

                    const hourLabel = Math.floor(hourAbs / 60);
                    const hour12 = (hourLabel % 12 === 0 ? 12 : hourLabel % 12);

                    return (
                        <div
                            key={`hourlabel-${i}`}
                            className={`flex items-center justify-center ${isMobile ? 'text-semibold-10' : 'text-semibold-12'} text-gray-60 w-[28px]`}
                            style={{ gridColumn: 1, gridRow: `${rowStart} / ${rowEnd}` }}
                        >
                            {hour12}
                        </div>
                    );
                })}


                {/* 세로 라인 (요일 경계) */}
                {Array.from({ length: renderDays.length }).map((_, index) => (
                    <div
                        key={`vline-${index}`}
                        className="border-[1px] border-gray-30 row-start-2 row-span-full"
                        style={{ gridColumn: index + 2 }}
                    />
                ))}

                {/* 수업 블록: 헤더 제외 영역에 절대 배치 (요일 영역 전체를 캔버스로) */}
                <div className="relative col-start-2 col-span-full row-start-2 row-span-full">
                    <div className="absolute inset-0">
                        {allCourses.map((course, idx) => {
                            // 요일 → 열 인덱스
                            const colIdx = renderDays.indexOf(course.day);
                            if (colIdx < 0) return null;

                            // 열 위치/폭(요일 n개를 동일 분할)
                            const dayWidthPct = 100 / renderDays.length;
                            const leftPct = colIdx * dayWidthPct;

                            // 시간 → 세로 위치/높이 (퍼센트)
                            const startAbs = snapDown5(toMinutes(course.startTime));
                            const endAbs = snapUp5(toMinutes(course.endTime));
                            const topPct = pctFromAbsMin(startAbs);
                            const heightPct = pctFromAbsMin(endAbs) - pctFromAbsMin(startAbs);

                            return (
                                <button
                                    key={`${course.uuid}-${idx}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCourseInfo({
                                            uuid: course.uuid ?? "",
                                            position: { top: e.clientY, left: e.clientX },
                                        });
                                    }}
                                    className={`flex absolute text-left text-white ${isMobile ? 'text-semibold-10' : 'text-semibold-16'} overflow-hidden`}
                                    style={{
                                        left: `${leftPct}%`,
                                        width: `${dayWidthPct}%`, // 좌우 여백 조금
                                        top: `${topPct}%`,
                                        height: `${heightPct}%`,
                                        backgroundColor: course.color,
                                        zIndex: 10,
                                    }}
                                >
                                    <div className={`${isMobile ? 'p-1' : 'p-3'} flex flex-col gap-1`}>
                                        <span>{course.name}</span>
                                        <span>{course.room}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {
                noTimeCourses.length > 0 && (
                    <div className="w-full bg-gray-10 pl-[28px]">
                        <div className="flex flex-col">
                            {noTimeCourses.map((course, index) => {
                                const isSelected = selectedCourseInfo?.uuid === course.uuid;

                                return (
                                    <div
                                        key={course.uuid ?? `no-time-${index}`}
                                        className={`relative ${index === noTimeCourses.length - 1 ? "rounded-b-[12px]" : ''}`}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCourseInfo({
                                                    uuid: course.uuid ?? "",
                                                    position: { top: e.clientY, left: e.clientX },
                                                });
                                            }}
                                            className={`${isMobile ? 'text-semibold-10 px-3 py-2' : 'text-semibold-16 px-5 py-3'} w-full text-left text-gray-90 bg-gray-20`}
                                        >
                                            {course.subjectName ?? "이름 없음"}
                                        </button>
                                        {isSelected && (
                                            <div
                                                className="fixed z-[10002]"
                                                style={{
                                                    top: `${selectedCourseInfo?.position.top}px`,
                                                    left: `${selectedCourseInfo?.position.left}px`,
                                                }}
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (course.uuid) {
                                                            handleDelete({ uuid: course.uuid });
                                                        }
                                                    }}
                                                    className={`${isMobile ? 'text-med-12 p-3' : 'text-med-16 p-4'} bg-white shadow-lg rounded-[12px] text-red flex gap-2 cursor-pointer`}
                                                >
                                                    <DeleteIcon className="w-[20px] h-[20px]" />
                                                    <p>삭제하기</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* 공용 삭제 팝업: timed/no-time 공통 */}
            {
                selectedCourseInfo && (
                    <div
                        className="fixed z-[10002]"
                        style={{
                            top: `${selectedCourseInfo.position.top}px`,
                            left: `${selectedCourseInfo.position.left}px`,
                        }}
                        onClick={(e) => e.stopPropagation()} // 팝업 클릭 시 닫힘 방지
                    >
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (selectedCourseInfo.uuid) {
                                    await handleDelete({ uuid: selectedCourseInfo.uuid });
                                    setSelectedCourseInfo(null);
                                }
                            }}
                            className={`${isMobile ? 'text-med-12 p-3' : 'text-med-16 p-4'} bg-white shadow-lg rounded-[12px] text-red flex gap-2 cursor-pointer`}
                        >
                            <DeleteIcon className="w-[20px] h-[20px]" />
                            <p>삭제하기</p>
                        </button>
                    </div>
                )
            }
            <ErrorPopup
                isOpen={isErrorPopupOpen}
                setIsOpen={setIsErrorPopupOpen}
                errorMessage={errorMessage}
            />
        </div >
    );
}

export default observer(TimeTable)