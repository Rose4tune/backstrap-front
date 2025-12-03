import getFavoriteTimeTables from "@api/time-table/getFavoriteTimeTables";
import { useStore } from "@stores/useStore.hook";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import CancelIcon from "src/assets/icons/common/[renewal]DeleteIcon.svg";
import { components } from "src/types/api";
import { formatSemesterLabel } from "src/utils/timetable/formatSemesterLabel";
import EditIcon from "src/assets/icons/common/EditIcon.svg"
import SettingIcon from "src/assets/icons/common/SettingIcon.svg"
import PlusIcon from "src/assets/icons/common/PlusIcon.svg"
import DropdownSelection from "../common/DropdownSelection";
import GradeCalculatorPopup from "./GradeTotalPopup";
import { editUser } from "@apis/onboarding/editUser";
import ErrorPopup from "@common/ErrorPopup";
import GradeTypePopup from "./GradeTypePopup";
import { observer } from "mobx-react";
import { GradeCode, gradeCodeToLabel, GradeLabel, gradeLabelOptions, gradeLabelToCode } from "src/types/timetable";
import registerTimeTableCourseGrades from "@api/time-table-course-grade/registerTimeTableCourseGrades";
import DeleteIcon from "@assets/icons/common/DeleteIcon.svg"
import deleteTimeTableCourseGrade from "@api/time-table-course-grade/deleteTimeTableCourseGrade";
import editTimeTableCourseGrade from "@api/time-table-course-grade/editTimeTableCourseGrade";
import registerTimeTableCourseGrade from "@api/time-table-course-grade/registerTimeTableCourseGrade";
import LoadingGif from "@public/assets/loading.gif"
import Image from "next/image"
import getAllByTimeTable from "@api/time-table-course-grade/getAllByTimeTable";
import useDebounce from "src/hooks/useDebounce";
import GradeLineChart, { SemesterPoint } from "src/components/timetable/GrideLineChart";
type TimeTableTemplate = components['schemas']['TimeTableTemplate'];
type TimeTableEntityView = components['schemas']['TimeTableEntityView'];
type TimeTableCourseGradeViewDto = components['schemas']['TimeTableCourseGradeViewDto']

interface GradeCalculatorProps {
    averageGrade: number;
    setAverageGrade: Dispatch<SetStateAction<number>>
    gradeTotalTypeNumber: number;
    setGradeTotalTypeNumber: Dispatch<SetStateAction<number>>;
    acquiredGrade: number;
    setAcquiredGrade: Dispatch<SetStateAction<number>>
    totalGrade: string | number;
    setTotalGrade: Dispatch<SetStateAction<string | number>>;
    setIsCalculatorOpen: Dispatch<SetStateAction<boolean>>;
    refreshUserGradeInfo: () => Promise<{
        averageGrade: number | undefined;
        acquiredGrade: number | undefined;
    } | undefined>
}


function GradeCalculatorModal(props: GradeCalculatorProps) {
    const { averageGrade, setAverageGrade, gradeTotalTypeNumber, setGradeTotalTypeNumber, acquiredGrade, setAcquiredGrade, totalGrade, setTotalGrade, setIsCalculatorOpen, refreshUserGradeInfo } = props;
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessTokenFromCookies();
    const userUuid = UserStore.getUserId();
    //eixstedList를 알아내기 위한 List
    const [favoriteList, setFavoriteList] = useState<TimeTableEntityView[]>([]);
    //시간표가 있는 학기 모음
    const [existedList, setExistedList] = useState<TimeTableTemplate[]>([]);

    //현재 선택된 학기
    const [selectedSemester, setSelectedSemester] = useState<TimeTableTemplate>();

    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [courseList, setCourseList] = useState<TimeTableCourseGradeViewDto[]>()

    //팝업 오픈 상태 관리
    const [isGradeTypePopupOpen, setIsGradeTypePopupOpen] = useState<boolean>(false)
    const [isGradeTotalPopupOpen, setIsGradeTotalPopupOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false); //로딩 상태 관리

    //직접 추가하기 버튼 누르면 상태로만 row 생성
    const [pendingCourses, setPendingCourses] = useState<Array<{
        tempId: string;
        subjectName: string;
        courseGrade: string;           // 입력 박스 string 유지
        courseGradeLabel?: string;     // Dropdown에서 선택한 라벨 (예: "A", "B+")
        courseGradeType?: GradeCode;   // 서버 전송용 코드 (필요시)
    }>>([]);

    /**server에 저장된 savedRows와 현재 상태로 관리되는 pendingRows(add 이후 입력 전) 합침*/
    const mergedCourses = useMemo(() => {
        const savedRows = (courseList ?? []).map((c) => ({ ...c, __kind: "saved" as const }));
        const pendingRows = pendingCourses.map((c) => ({ ...c, __kind: "pending" as const }));
        return [...savedRows, ...pendingRows];
    }, [courseList, pendingCourses]);

    //값 변화 deboucne 적용
    type EditBuffer = Record<string, { subjectName?: string; courseGrade?: string; courseGradeType?: GradeCode; courseGradeLabel?: string }>;
    const [editBuffer, setEditBuffer] = useState<EditBuffer>({});
    const debouncedEditBuffer = useDebounce(editBuffer, 500);

    /**useDebounce 적용시 빈값이 아닐때만 호출 */
    async function flushDebouncedEdit(uuid: string) {
        const buf = debouncedEditBuffer[uuid];
        if (!buf) return;

        // 빈값이면 API 호출 X
        const payload: {
            uuid: string;
            courseGrade?: number;
            courseGradeType?: GradeCode;
            subjectName?: string;
        } = { uuid };

        if (buf.subjectName !== undefined && buf.subjectName.trim() !== "") {
            payload.subjectName = buf.subjectName.trim();
        }
        if (buf.courseGrade !== undefined && buf.courseGrade.trim() !== "" && /^\d+$/.test(buf.courseGrade)) {
            payload.courseGrade = Number(buf.courseGrade);
        }
        if (buf.courseGradeType) {
            payload.courseGradeType = buf.courseGradeType;
        }

        // 변경할 게 없으면 return
        const hasAny =
            payload.subjectName !== undefined ||
            payload.courseGrade !== undefined ||
            payload.courseGradeType !== undefined;

        if (!hasAny) return;

        try {
            const res = await editTimeTableCourseGrade(payload, accessToken);
            if (res.success && res.data) {
                const updated = Array.isArray(res.data) ? res.data[0] : res.data;
                setCourseList((prev) => (prev ?? []).map((c) => (c.uuid === uuid ? { ...c, ...updated } : c)));
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";
            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);
            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }


    /**상태로 row 추가 */
    function addPendingCourse() {
        setPendingCourses((prev) => [
            ...prev,
            { tempId: crypto.randomUUID(), subjectName: "", courseGrade: "", courseGradeLabel: undefined }
        ]);
    }

    /**현재 선택된 timetable */
    const selectedTimeTable = useMemo(() => {
        return favoriteList.find(
            (f) => f.year === selectedSemester?.year && f.semester === selectedSemester?.semester
        );
    }, [favoriteList, selectedSemester]);

    //초기 렌더링 시 등록된 timeTableCourse 불러오기
    useEffect(() => {
        /** 시간표 불러오기 버튼 클릭시 실행 */
        async function loadTimeTableCourse() {
            setIsLoading(true);
            try {
                const result = await getAllByTimeTable(selectedTimeTable?.uuid as string, accessToken)
                if (result.success && result.data) {
                    setCourseList(result.data)
                    return result.data
                }
            } catch (e: unknown) {
                let msg = "네트워크 오류가 발생했습니다.";

                if (e instanceof Error) msg = e.message;
                else if (typeof e === "string") msg = e;
                else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

                setErrorMessage(msg);
                setIsErrorPopupOpen(true);
            } finally {
                setIsLoading(false)
            }
        }
        loadTimeTableCourse()
    }, [selectedTimeTable, accessToken])

    useEffect(() => {
        //undefined인 초기에만 이렇게 지정, existedList를 불러오고 난 후 호출해야하기에 이렇게 지정.
        if (selectedSemester == undefined) {
            setSelectedSemester(existedList[0])
        }
    }, [existedList])

    async function getFavoriteList() {
        try {
            const response = await getFavoriteTimeTables(accessToken);
            if (response.success && response.data) {
                // year가 '20XX' 형태인 항목만 필터링 : 임시로 25년도로 입력된거 막기
                const filteredList = response.data.filter(timeTable => {
                    return timeTable.year && timeTable.year.toString().startsWith('20');
                });

                // 필터링된 리스트를 상태에 저장
                setFavoriteList(filteredList);
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    //대표 시간표들만 불러오기: 초기 렌더링
    useEffect(() => {
        if (!accessToken) return;
        getFavoriteList()
    }, [accessToken]); //점수가 달라질 때나 기준 학점 바꿀 때 재렌더링(추후 모듈화 필요)

    //favoriteList 중복 제거
    useEffect(() => {
        if (!favoriteList || favoriteList.length === 0) return;

        const list = favoriteList.map((t) => ({
            semester: t.semester,
            year: t.year,
        }));

        // 중복 제거 + 정렬 (과거 → 최신 순)
        const uniqueSortedList = Array.from(
            new Set(
                list.map((l) => {
                    let year = l.year ?? 0;
                    if (year < 100) {
                        year += 2000; // 25 → 2025: fallback 방지 
                    }
                    return `${year}-${l.semester}`;
                })
            )
        )
            .map((key) => {
                const [yearSuffix, semester] = key.split("-");


                return {
                    year: Number(yearSuffix),
                    semester: semester as TimeTableTemplate["semester"],
                };
            })
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                const semesterOrder = { SPRING: 0, SUMMER: 1, FALL: 2, WINTER: 3 };
                return semesterOrder[a.semester!] - semesterOrder[b.semester!];
            });

        setExistedList(uniqueSortedList);
    }, [favoriteList]);

    /**직접 추가하기 이후 값이 채워지면 api 호출 */
    async function tryRegisterLocalRow(row: {
        tempId: string;
        subjectName: string;
        courseGrade: string;
        courseGradeLabel?: string;
        courseGradeType?: GradeCode;
    }) {
        const hasSubject = row.subjectName.trim().length > 0;
        const hasCredit = /^\d+$/.test(row.courseGrade.trim()); // 숫자만
        const hasGrade = !!row.courseGradeType;                // Dropdown에서 설정

        if (!(hasSubject && hasCredit && hasGrade)) return; // 모두 채워질 때까지 대기

        // 모두 채워졌다면 서버 등록
        try {
            const payload = {
                subjectName: row.subjectName.trim(),
                courseGrade: Number(row.courseGrade),
                courseGradeType: row.courseGradeType,
            };
            const res = await registerTimeTableCourseGrade(selectedTimeTable?.uuid as string, payload, accessToken);
            if (res.success && res.data) {
                const created = Array.isArray(res.data) ? res.data[0] : res.data;
                // 로컬에서 제거하고 서버 리스트에 추가
                setPendingCourses((prev) => prev.filter(p => p.tempId !== row.tempId));
                setCourseList((prev) => [...(prev ?? []), created]);
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";
            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);
            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    // 가장 단순: 서버가 "단일 객체"를 돌려준다는 가정
    async function editCourse(courseUuid: string, courseGrade?: string, courseGradeType?: GradeCode, subjectName?: string) {
        try {
            const payload = {
                uuid: courseUuid,
                ...(courseGrade !== undefined && courseGrade !== "" ? { courseGrade: Number(courseGrade) } : {}),
                ...(courseGradeType ? { courseGradeType } : {}),
                ...(subjectName !== undefined && subjectName !== "" ? { subjectName } : {}),
            };

            const res = await editTimeTableCourseGrade(payload, accessToken);
            if (res.success && res.data) {
                const updated = Array.isArray(res.data) ? res.data[0] : res.data; // 둘 다 커버
                if (!updated) return;

                setCourseList((prev) =>
                    (prev ?? []).map((c) => (c.uuid === courseUuid ? { ...c, ...updated } : c))
                );
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }

        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";
            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);
            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**course 삭제 */
    async function deleteCourse(courseUuid: string) {
        try {
            const res = await deleteTimeTableCourseGrade(courseUuid, accessToken)
            if (res.success && res.data) {
                setCourseList((prev) => prev?.filter((course) => course.uuid != courseUuid))
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**GradeTotal 수정시 작동 */
    async function editGradeTotal() {
        try {
            const res = await editUser({ totalGrade: Number(totalGrade) }, accessToken, userUuid)
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**User의 GradeType 수정시 작동 */
    async function editGradeType() {
        const reverseGradeTotalEnumMap = {
            4.0: "FOUR",
            4.3: "FOURTHREE",
            4.5: "FOURFIVE"
        }
        try {
            const res = await editUser({ gradeTotalType: reverseGradeTotalEnumMap[gradeTotalTypeNumber] }, accessToken, userUuid)
            if (res.data && res.success) {
                await refreshUserGradeInfo();
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**시간 순대로 정렬한 현재 선택된 학기 대표 시간표의 courselist */
    const selectedSemesterCourseList = useMemo(() => {
        const schoolCoursesDto =
            selectedTimeTable?.schoolCourses?.map((sc) => ({
                courseGrade: sc.grade,
                courseGradeType: sc.courseGradeType,
                subjectName: sc.subjectName,
                dayAndTimeRanges: sc.dayAndTimeRanges,
            })) || [];

        const customCoursesDto =
            selectedTimeTable?.customCourses?.map((cc) => ({
                courseGrade: cc.courseGrade,
                courseGradeType: cc.courseGradeType,
                subjectName: cc.subjectName,
                dayAndTimeRanges: cc.dayAndTimeRanges,
            })) || [];

        const dto = [...schoolCoursesDto, ...customCoursesDto].sort((a, b) => {
            // 요일 순서를 숫자로 매핑
            const dayOrder: Record<string, number> = {
                MONDAY: 1,
                TUESDAY: 2,
                WEDNESDAY: 3,
                THURSDAY: 4,
                FRIDAY: 5,
                SATURDAY: 6,
                SUNDAY: 7,
            };

            // 각 과목의 제일 빠른 요일과 fromTime 찾기
            const getEarliest = (ranges?: typeof a.dayAndTimeRanges) => {
                if (!ranges || ranges.length === 0) return { day: 99, time: "99:99" };

                return ranges.reduce(
                    (earliest, curr) => {
                        const currDay = curr.dayOfWeek ? dayOrder[curr.dayOfWeek] : 99;
                        const currTime = curr.timeRange?.fromTime || "99:99";

                        if (
                            currDay < earliest.day ||
                            (currDay === earliest.day && currTime < earliest.time)
                        ) {
                            return { day: currDay, time: currTime };
                        }
                        return earliest;
                    },
                    { day: 99, time: "99:99" }
                );
            };

            const aEarliest = getEarliest(a.dayAndTimeRanges);
            const bEarliest = getEarliest(b.dayAndTimeRanges);

            if (aEarliest.day !== bEarliest.day) {
                return aEarliest.day - bEarliest.day;
            }
            return aEarliest.time.localeCompare(bEarliest.time);
        });

        return dto;
    }, [selectedSemester, selectedTimeTable]);

    /** 시간표 불러오기 버튼 클릭시 실행 */
    async function registerLoadedTimeTableCourse() {
        try {
            const result = await registerTimeTableCourseGrades(selectedTimeTable?.uuid as string, selectedSemesterCourseList, accessToken)
            if (result.success && result.data) {
                setCourseList(prev => ([...(prev ?? []), ...result.data || []])); // 배열 이어붙이기
                const gradeinfo = await refreshUserGradeInfo();
                setAcquiredGrade(gradeinfo?.acquiredGrade as number)
                setAverageGrade(gradeinfo?.averageGrade as number)
                await getFavoriteList();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**학기 데이터(gradelinechart 전달용) */
    const chartData: SemesterPoint[] = existedList.map((tpl) => ({
        label: `${String((tpl.year ?? 0) % 100).padStart(2, "0")}년 ${tpl.semester === "SPRING" ? "1학기" : tpl.semester === "FALL" ? "2학기" : tpl.semester === "SUMMER" ? "여름" : "겨울"}`,
        value:
            favoriteList.find(f => f.year === tpl.year && f.semester === tpl.semester)?.averageGrade
            ?? 0
    }));



    return (
        <>
            <>
                {isLoading && (
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] bg-black/10 p-2 rounded-[6px]">
                        <Image
                            src={LoadingGif}
                            alt="불러오는 중"
                            className="w-8 h-8"
                        />
                    </div>
                )}
            </>
            {/* 배경 Dim */}
            <div
                onClick={() => setIsCalculatorOpen(false)}
                className="fixed inset-0 bg-dim z-[1000]"
            />

            {/* 모달 */}
            <div className="max-h-[552px] overflow-y-auto scroll-custom rounded-[20px] bg-white w-[calc(100%-24px)] p-5 z-[1001] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[423px]">
                {favoriteList.length === 0 &&
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[1002]">
                        <p className="text-gray-90 text-bold-14">시간표가 있는 학기가 없습니다.</p>
                        <p className="text-reg-12 text-gray-70"> 새로운 시간표를 추가해보세요.</p>
                    </div>}
                {/* 모달 헤더 */}
                <div className="flex justify-between pb-3">
                    <span className="text-semibold-16 text-gray-90">학점 계산기</span>
                    <button onClick={() => setIsCalculatorOpen(false)}>
                        <CancelIcon className="w-5 h-5 text-gray-70" />
                    </button>
                </div>

                {/* 학기 이동 부분 */}
                <div className="flex gap-5 pt-5 flex-wrap">
                    {existedList.map((timeTemplate, index) => {
                        const isSelected =
                            selectedSemester?.year === timeTemplate.year &&
                            selectedSemester?.semester === timeTemplate.semester;

                        return (
                            <span
                                key={`${timeTemplate.year}-${timeTemplate.semester}-${index}`}
                                onClick={() => {
                                    setSelectedSemester(timeTemplate)
                                }}
                                className={`cursor-pointer ${isSelected
                                    ? "text-gray-90 text-bold-14 border-b-[2px] border-gray-90 pb-[4px]"
                                    : "text-semibold-14 text-gray-50 pb-[6px]"
                                    }`}
                            >
                                {formatSemesterLabel({ semester: timeTemplate.semester, year: (timeTemplate.year || 0) % 100 })}
                            </span>
                        );
                    })}
                </div>
                {/* 학점 Info 부분 */}
                <div className="flex pt-5 justify-between items-center w-full">
                    <div className="flex flex-col">
                        <span className="flex gap-1 items-center">
                            <span className="text-med-12 text-gray-60">전체 평점</span>
                            <button className="flex" onClick={() => setIsGradeTypePopupOpen(true)}>
                                <EditIcon className="w-3 h-3 text-gray-50" />
                            </button>
                        </span>
                        <span className="flex gap-1 items-end">
                            <span className="text-bold-20 text-black">{averageGrade}</span>
                            <span className="text-reg-12 text-gray-60 mb-1">/</span>
                            <span className="text-reg-12 text-gray-60 mb-1">{gradeTotalTypeNumber}</span>
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="flex gap-1 items-center">
                            <span className="text-med-12 text-gray-60">이번 학기 평균</span>
                            <div className="w-3 h-3 flex" />
                        </span>
                        <span className="flex gap-1 items-end">
                            <span className="text-bold-20 text-black">{selectedTimeTable?.averageGrade}</span>
                            <span className="text-reg-12 text-gray-60 mb-1">/</span>
                            <span className="text-reg-12 text-gray-60 mb-1">{gradeTotalTypeNumber}</span>
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="flex gap-1 items-center">
                            <span className="text-med-12 text-gray-60">취득 학점</span>
                            <button onClick={() => setIsGradeTotalPopupOpen(true)} className="flex">
                                <SettingIcon className="w-3 h-3 text-gray-50" />
                            </button>
                        </span>
                        <span className="flex gap-1 items-end">
                            <span className="text-bold-20 text-black">{acquiredGrade}</span>
                            <span className="text-reg-12 text-gray-60 mb-1">/</span>
                            <span className="text-reg-12 text-gray-60 mb-1">{totalGrade}</span>
                        </span>
                    </div>
                </div>
                {/* 그래프 부분 */}
                <div className="flex py-5">
                    <GradeLineChart
                        data={chartData}
                        scale={gradeTotalTypeNumber as 4.0 | 4.3 | 4.5}
                        className="w-full min-h-[124px]"
                    />
                </div>                {/* 학점 입력 부분 */}
                <div className="flex flex-col pt-4 gap-5">
                    {/* 학기 정보 + 시간표 불러오기 버튼 */}
                    <div className="flex w-full justify-between items-center px-2">
                        <div className="flex text-bold-16 text-gray-90">{formatSemesterLabel({ semester: selectedSemester?.semester, year: (selectedSemester?.year || 0) % 100 } as TimeTableEntityView)}</div>
                        <button onClick={() => {
                            registerLoadedTimeTableCourse()
                        }} className="rounded-full text-white text-bold-12 px-3 py-2 bg-normal hover:bg-hover">시간표 불러오기</button>
                    </div>
                    {/* 학점 정보 표시 및 입력 부분 */}
                    <div className="w-full flex flex-col items-start">
                        {/* 헤더 */}
                        <div className="w-full flex justify-between text-reg-14 text-gray-50">
                            <div className="flex flex-1 w-full gap-5 mb-3">
                                <div className="px-1 w-1/2">과목명</div>
                                <div className="w-1/5">학점</div>
                                <div className="w-1/5">성적</div>
                            </div>
                            <div className="w-8" />
                        </div>

                        {/* 데이터 행 */}
                        <div className="w-full flex flex-col gap-1">
                            {mergedCourses?.map((course: any) => {
                                const isLocal = course.__kind === "pending";
                                const rowId = isLocal ? course.tempId : course.uuid;
                                const currentLabelFromCourse =
                                    course.courseGradeType
                                        ? gradeCodeToLabel[course.courseGradeType as Exclude<GradeCode, undefined>]
                                        : undefined;

                                const buffered = !isLocal ? editBuffer[course.uuid as string] : undefined;
                                const dropdownValue = isLocal
                                    ? course.courseGradeLabel // pending row는 로컬 상태
                                    : (buffered?.courseGradeLabel ?? currentLabelFromCourse); // 저장된 행은 버퍼 우선
                                return (

                                    <div
                                        key={rowId}
                                        className="w-full flex text-med-14 text-gray-90 items-center gap-2"
                                    >
                                        <div className="flex flex-1 w-full items-center gap-5">
                                            <div className="px-1 w-1/2 truncate">
                                                {!isLocal ? (
                                                    course.subjectName
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="w-full text-center border border-gray-30 rounded-[8px] bg-gray-20 py-[8px]"
                                                        placeholder="과목명 입력"
                                                        onChange={(e) => {
                                                            const v = e.currentTarget.value;
                                                            if (isLocal) {
                                                                setPendingCourses((prev) => prev.map(p => p.tempId === course.tempId ? { ...p, subjectName: v } : p));
                                                            } else {
                                                                setEditBuffer((prev) => ({ ...prev, [course.uuid as string]: { ...(prev[course.uuid as string] ?? {}), subjectName: v } }));
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (isLocal) {
                                                                const row = pendingCourses.find(p => p.tempId === course.tempId);
                                                                if (row) void tryRegisterLocalRow(row);
                                                            } else {
                                                                void flushDebouncedEdit(course.uuid as string);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                className="w-1/5 text-center border border-gray-30 rounded-[8px] bg-gray-20 py-[8px]"
                                                defaultValue={course.courseGrade}
                                                maxLength={1} // 최대 1글자
                                                inputMode="numeric" // 모바일 키패드 숫자 전용
                                                pattern="[0-9]*" // 숫자만 허용
                                                onChange={(e) => {
                                                    const onlyNum = e.currentTarget.value.replace(/[^0-9]/g, "");
                                                    e.currentTarget.value = onlyNum;
                                                    if (isLocal) {
                                                        setPendingCourses((prev) => prev.map(p => p.tempId === course.tempId ? { ...p, courseGrade: onlyNum } : p));
                                                    } else {
                                                        setEditBuffer((prev) => ({ ...prev, [course.uuid as string]: { ...(prev[course.uuid as string] ?? {}), courseGrade: onlyNum } }));
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (isLocal) {
                                                        const row = pendingCourses.find(p => p.tempId === course.tempId);
                                                        if (row) void tryRegisterLocalRow(row);
                                                    } else {
                                                        void flushDebouncedEdit(course.uuid as string);
                                                    }
                                                }}
                                            />
                                            <div className="w-1/5">
                                                <DropdownSelection
                                                    title=""
                                                    onChange={(label) => {
                                                        const code = gradeLabelToCode[label as keyof typeof gradeLabelToCode];
                                                        if (isLocal) {
                                                            setPendingCourses((prev) =>
                                                                prev.map((p) =>
                                                                    p.tempId === course.tempId
                                                                        ? { ...p, courseGradeLabel: label, courseGradeType: code }
                                                                        : p
                                                                )
                                                            );
                                                            const row = pendingCourses.find((p) => p.tempId === course.tempId);
                                                            if (row) void tryRegisterLocalRow({ ...row, courseGradeLabel: label, courseGradeType: code });
                                                        } else {
                                                            setEditBuffer((prev) => ({
                                                                ...prev,
                                                                [course.uuid as string]: {
                                                                    ...(prev[course.uuid as string] ?? {}),
                                                                    courseGradeType: code,
                                                                    courseGradeLabel: label,
                                                                },
                                                            }));
                                                            void editCourse(course.uuid as string, undefined, code);
                                                        }
                                                    }}
                                                    value={dropdownValue}
                                                    options={gradeLabelOptions}
                                                    optionTextStyle="text-med-14"
                                                    iconSize={18}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (isLocal) {
                                                    setPendingCourses((prev) => prev.filter(p => p.tempId !== course.tempId));
                                                } else {
                                                    void deleteCourse(course.uuid as string);
                                                }
                                            }} className="w-8 text-right">
                                            <DeleteIcon width={20} height={20} className="text-red" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* 직접 추가하기 버튼 */}
                        <button
                            className="pl-2 pr-1 py-[6px] flex gap-1 items-center"
                            onClick={addPendingCourse}
                        >
                            <PlusIcon className="w-4 h-4 text-gray-70" />
                            <span className="text-semibold-14 text-gray-70">직접 추가하기</span>
                        </button>
                    </div>

                </div>
            </div >
            {
                isGradeTotalPopupOpen &&
                <GradeCalculatorPopup title={"취득 학점"} value={totalGrade} setValue={setTotalGrade} buttonName={"저장"}
                    onAction={editGradeTotal} setIsOpen={setIsGradeTotalPopupOpen} />
            }
            {
                isGradeTypePopupOpen &&
                <GradeTypePopup title={"총점 평점"} gradeTotalTypeNumber={gradeTotalTypeNumber} setGradeTotalTypeNumber={setGradeTotalTypeNumber} buttonName={"저장"}
                    onAction={editGradeType} setIsOpen={setIsGradeTypePopupOpen} />
            }
            {/* {isLoadedTimePopupOpen && <GradeCalculatorPopup title={"불러올 시간표"} value={ } } */}
            <ErrorPopup
                isOpen={isErrorPopupOpen}
                setIsOpen={setIsErrorPopupOpen}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default observer(GradeCalculatorModal)