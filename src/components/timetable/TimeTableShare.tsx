import { components } from "src/types/api";
import AlarmIcon from "src/assets/icons/common/AlarmIcon.svg";
import { formatSemesterLabel } from "src/utils/timetable/formatSemesterLabel";
import registerTimeTable from "@api/time-table/registerTimeTable";
import useAccessToken from "src/hooks/useAcessToken";
import { render } from "@headlessui/react/dist/utils/render";
import { gcd, GRID_MINUTES, parseHM, snapDown5, snapUp5, toMinutes, toMinutesRounded5 } from "src/utils/timetable/timetableGrid";
import { observer } from "mobx-react";
import TimeTable from "./TimeTable";

type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableRegisterDto = components['schemas']['TimeTableRegisterDto'];

interface TimeTableProps {
    selectedTimeTableEntity?: TimeTableEntityView;
    selectedSemester?: TimeTableTemplate;
    isMobile: boolean;
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

function TimeTableShare({
    selectedTimeTableEntity,
    selectedSemester,
    isMobile
}: TimeTableProps) {
    // 데이터 없으면 빈 UI
    if (!selectedTimeTableEntity?.uuid) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#E8EAEC] rounded-[20px]">
                <AlarmIcon className="w-[40px] h-[40px] mb-[12px]" />
                <div className="text-center mb-[12px]">
                    <h2 className="text-semibold-22 text-gray-90 mb-[4px]">
                        {formatSemesterLabel({
                            semester: selectedSemester?.semester,
                            year: selectedSemester?.year,
                        })}{" "}
                        시간표가 존재하지 않습니다.
                    </h2>
                </div>
            </div>
        );
    }
    const customCourses = selectedTimeTableEntity.customCourses ?? [];
    const schoolCourses = selectedTimeTableEntity.schoolCourses ?? [];
    // 시간 없는 수업들
    const noTimeCourses = [
        ...customCourses.filter(c => (c.dayAndTimeRanges?.length ?? 0) === 0),
        ...schoolCourses.filter(c => (c.dayAndTimeRanges?.length ?? 0) === 0),
    ];
    const colorCodes = selectedTimeTableEntity.colorCodes ?? [];

    // 모든 과목을 dayAndTimeRanges 기준으로 전개
    const allCoursesRaw = [
        ...customCourses.flatMap((c) =>
            (c.dayAndTimeRanges ?? []).map((range) => ({
                uuid: c.uuid ?? "",
                name: c.subjectName ?? "",
                room: c.roomName ?? "",
                day: range?.dayOfWeek ? dayMap[range.dayOfWeek] : "",
                startTime: range?.timeRange?.fromTime ?? "",
                endTime: range?.timeRange?.toTime ?? "",
            }))
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
        <div id="timetable" className="relative flex flex-col flex-grow w-full">
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
                                <div
                                    key={`${course.uuid}-${idx}`}
                                    className={`flex absolute text-left text-white ${isMobile ? 'text-semibold-10' : 'text-semibold-14'} overflow-hidden`}
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
                                </div>
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
                                return (
                                    <div
                                        key={course.uuid ?? `no-time-${index}`}
                                        className={`relative ${index === noTimeCourses.length - 1 ? "rounded-b-[12px]" : ''}`}
                                    >
                                        <div
                                            className={`${isMobile ? 'text-semibold-10 px-3 py-2' : 'text-semibold-16 px-5 py-3'} w-full text-left text-gray-90 bg-gray-20`}
                                        >
                                            {course.subjectName ?? "이름 없음"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default observer(TimeTableShare)