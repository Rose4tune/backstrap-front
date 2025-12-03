import getSchoolCoursesByPaging from "@api/school-course/getSchoolCoursesByPaging";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import useAccessToken from "src/hooks/useAcessToken";
import { components } from "src/types/api";
import DropdownInput from "@common/input/DropdownInput";
import useDebounce from "src/hooks/useDebounce";
import { useStore } from "@stores/useStore.hook";
import { SchoolCourseType } from "src/types/timetable";
import { buildSchoolStructure } from "src/utils/timetable/structureBuilder";
import editTimeTable from "@api/time-table/editTimeTable";
import ErrorPopup from "@common/ErrorPopup";
import { useTimeTableRefetch } from "src/hooks/timetable/useTimeTableRefetch";
import SearchInput from "src/components/common/SearchInput";
import Loader from "src/components/common/Loader";
import PlusIcon from "src/assets/icons/common/PlusIcon.svg"
import { observer } from "mobx-react";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type SchoolCourseEntityView = components["schemas"]["SchoolCourseEntityView"];
type TimeTableEntityView = components['schemas']['TimeTableEntityView']
type TimeTableEditDto = components['schemas']['TimeTableEditDto']
const courseGradeTypeEnum = [
    "A", "AM", "AP", "B", "BM", "BP", "C", "CM", "CP", "D", "DM", "DP", "F",
] as const;

type CourseGradeType = typeof courseGradeTypeEnum[number];
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


interface ClassListProps {
    setIsClassListModalOpen: Dispatch<SetStateAction<boolean>>;
    selectedSemester: TimeTableTemplate;
    setSelectedTimeTableEntity: Dispatch<SetStateAction<TimeTableEntityView | undefined>>
    selectedTimeTableEntity: TimeTableEntityView
}
// '전체' 옵션을 위한 고유하고 일관된 식별자
const ALL_OPTION_ID = "전체";

function AddClassListModalMobile({
    setIsClassListModalOpen,
    selectedSemester,
    selectedTimeTableEntity,
    setSelectedTimeTableEntity
}: ClassListProps) {
    const [loading, setLoading] = useState(true);
    const [scrollLoading, setScrollLoading] = useState(false);
    const [courses, setCourses] = useState<SchoolCourseEntityView[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [schoolData, setSchoolData] = useState<SchoolCourseType | null>(null);
    const [selectedCampus, setSelectedCampus] = useState(ALL_OPTION_ID);
    const [selectedCollege, setSelectedCollege] = useState(ALL_OPTION_ID);
    const [selectedMajor, setSelectedMajor] = useState(ALL_OPTION_ID);    // =================================================================
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId();
    const accessToken = UserStore.getAccessTokenFromCookies();
    const observerRef = useRef<HTMLDivElement | null>(null);
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

    // 1. 계층적 카테고리 데이터 로드 (최초 1회)
    // =================================================================
    useEffect(() => {
        const loadStructureData = async () => {
            try {
                const schoolUuid = UserStore.getUserSchool().uuid;
                const schoolName = UserStore.getUserSchool().name;
                const accessToken = UserStore.getAccessTokenFromCookies()
                if (!schoolUuid || !accessToken) {
                    return;
                }
                const data = await buildSchoolStructure(schoolUuid, schoolName, accessToken);
                setSchoolData(data);
            } catch (err) {
                console.error("학교 구조 데이터를 불러오는 데 실패했습니다:", err);
            }
        };
        loadStructureData();
    }, []);

    // =================================================================
    // 2. 드롭다운 옵션 동적 생성 (상태가 바뀔 때마다 재계산)
    // =================================================================

    // '전체' 옵션 객체
    const allOption = { label: "전체", value: ALL_OPTION_ID };

    // 캠퍼스 드롭다운 옵션
    const campusOptions = useMemo(() => {
        if (!schoolData) return [allOption];
        const campuses = schoolData.campus.map(c => ({ label: c.name, value: c.uuid }));
        return [allOption, ...campuses];
    }, [schoolData]);

    // 단과대 드롭다운 옵션
    const collegeOptions = useMemo(() => {
        if (selectedCampus === ALL_OPTION_ID || !schoolData) return [allOption];
        const foundCampus = schoolData.campus.find(c => c.uuid === selectedCampus);
        if (!foundCampus) return [allOption];
        const colleges = foundCampus.college.map(c => ({ label: c.name, value: c.uuid }));
        return [allOption, ...colleges];
    }, [schoolData, selectedCampus]);

    // 전공 드롭다운 옵션
    const majorOptions = useMemo(() => {
        if (selectedCollege === ALL_OPTION_ID || !schoolData) return [allOption];
        const foundCampus = schoolData.campus.find(c => c.uuid === selectedCampus);
        const foundCollege = foundCampus?.college.find(c => c.uuid === selectedCollege);
        if (!foundCollege) return [allOption];
        const majors = foundCollege.major.map(m => ({ label: m.name, value: m.uuid }));
        return [allOption, ...majors];
    }, [schoolData, selectedCampus, selectedCollege]);

    // =================================================================
    // 3. 드롭다운 선택 변경 핸들러 (하위 선택 초기화)
    // =================================================================
    const handleCampusChange = (campusId: string) => {
        setSelectedCampus(campusId);
        // 하위 드롭다운 선택을 '전체'로 리셋
        setSelectedCollege(ALL_OPTION_ID);
        setSelectedMajor(ALL_OPTION_ID);
    };

    const handleCollegeChange = (collegeId: string) => {
        setSelectedCollege(collegeId);
        // 하위 드롭다운 선택을 '전체'로 리셋
        setSelectedMajor(ALL_OPTION_ID);
    };

    const handleMajorChange = (majorId: string) => {
        setSelectedMajor(majorId);
    };

    useEffect(() => {
        // accessToken이 없으면 API 호출을 막습니다.
        if (!accessToken) return;

        // 새 검색 조건으로 첫 페이지부터 다시 로드하는 함수
        const fetchNewCourseList = async () => {
            setLoading(true);

            const categoryRefUuid = selectedMajor !== ALL_OPTION_ID ? selectedMajor
                : selectedCollege !== ALL_OPTION_ID ? selectedCollege
                    : selectedCampus !== ALL_OPTION_ID ? selectedCampus
                        : undefined;

            const res = await getSchoolCoursesByPaging({
                paginationRequestDto: { count: 20 }, // 항상 첫 페이지
                year: selectedSemester.year,
                semesterType: selectedSemester.semester,
                searchKeyword: debouncedSearchTerm ? { keyword: debouncedSearchTerm, searchKeywordType: 'SUBJECT_NAME' } : undefined,
                categoryRefUuid
            }, accessToken);

            if (res.success && res.data) {
                // 새로운 검색 결과로 courses 상태를 완전히 교체합니다.
                setCourses(res.data.data ?? []);
                const nextCursor = res.data.cursor ?? null;
                setCursor(nextCursor);
                setHasMore(!!nextCursor);
            } else {
                // 실패 시 모든 목록을 비웁니다.
                setCourses([]);
                setCursor(null);
                setHasMore(false);
            }
            setLoading(false);
        };

        fetchNewCourseList();
        // 의존성 배열: 이 값들 중 하나라도 바뀌면, 목록을 처음부터 다시 불러옵니다.
    }, [accessToken, debouncedSearchTerm, selectedSemester, selectedCampus, selectedCollege, selectedMajor]);


    useEffect(() => {
        // scrollLoading이 true이거나, 더 이상 불러올 페이지가 없으면 아무것도 하지 않음.
        // 이것이 중복 호출을 막는 핵심 가드(guard) 역할을 합니다.
        if (!hasMore || scrollLoading || courses.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // isIntersecting이 true이고, 로딩 중이 아닐 때만 loadMore를 호출
                if (entry.isIntersecting && !scrollLoading) {
                    loadMore();
                }
            },
            { rootMargin: "20px" }
        );

        const currentObserverRef = observerRef.current;
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        // cleanup 함수: 컴포넌트가 언마운트되거나, 의존성이 변경될 때 실행
        // 기존 observer의 연결을 끊어 메모리 누수를 방지합니다.
        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
        // hasMore 또는 scrollLoading 상태가 변경될 때마다 이 effect를 다시 실행하여
        // observer를 재설정하거나 연결을 해제합니다.
    }, [hasMore, scrollLoading]);

    const loadMore = async () => {
        if (!accessToken || !cursor) return;
        setScrollLoading(true);

        // API에 보낼 최종 categoryRefUuid 결정 (가장 구체적인 것 하나만)
        const categoryRefUuid = selectedMajor !== ALL_OPTION_ID ? selectedMajor
            : selectedCollege !== ALL_OPTION_ID ? selectedCollege
                : selectedCampus !== ALL_OPTION_ID ? selectedCampus
                    : undefined;
        const res = await getSchoolCoursesByPaging(
            {
                paginationRequestDto: { count: 20, cursor },
                year: selectedSemester.year,
                semesterType: selectedSemester.semester,
                searchKeyword: debouncedSearchTerm
                    ? { keyword: debouncedSearchTerm, searchKeywordType: 'SUBJECT_NAME' }
                    : undefined,
                categoryRefUuid
            }, accessToken
        );

        if (res.success && res.data) {
            setCourses((prev) => [...prev, ...(res.data!.data ?? [])]);
            const nextCursor = res.data.cursor || null;
            setCursor(nextCursor);
            setHasMore(!!nextCursor);
        } else {
            // 실패 시에는 hasMore 상태를 건드리지 않습니다.
            // 다음 스크롤 시도 시 동일한 cursor로 재시도할 수 있도록 합니다.
            console.error("Failed to load more courses.");
        }

        setScrollLoading(false);
    };

    async function handleAdd() {
        // 1. 기본 유효성 검사
        const selectedCourse = courses.find(c => c.uuid === selectedUuid);
        if (!selectedCourse || !accessToken || !selectedTimeTableEntity?.uuid) {
            console.error("추가할 수업 정보 또는 시간표 정보가 없습니다.");
            return;
        }

        // --- 2. 시간 충돌 검사 로직 (UX 개선용) ---
        const toMinutes = (time: string) => {
            const [h, m] = time.split(':');
            return parseInt(h, 10) * 60 + parseInt(m, 10);
        };

        // 새로 추가할 수업의 유효한 시간 정보만 필터링
        const newRanges = (selectedCourse.dayAndTimeRanges ?? [])
            .filter((range): range is DayAndTimeRange & { timeRange: { fromTime: string; toTime: string } } => {
                return !!(range.dayOfWeek && range.timeRange && range.timeRange.fromTime && range.timeRange.toTime);
            });

        // 현재 시간표의 모든 수업 시간 정보 통합
        const allExistingRanges = [
            ...(selectedTimeTableEntity.schoolCourses ?? []).flatMap(c => c.dayAndTimeRanges ?? []),
            ...(selectedTimeTableEntity.customCourses ?? []).flatMap(c => c.dayAndTimeRanges ?? [])
        ];

        for (const newRange of newRanges) {
            const newStart = toMinutes(newRange.timeRange.fromTime);
            const newEnd = toMinutes(newRange.timeRange.toTime);

            for (const existing of allExistingRanges) {
                if (existing.dayOfWeek !== newRange.dayOfWeek || !existing.timeRange?.fromTime || !existing.timeRange?.toTime) continue;

                const existingStart = toMinutes(existing.timeRange.fromTime);
                const existingEnd = toMinutes(existing.timeRange.toTime);

                if (newStart < existingEnd && newEnd > existingStart) {
                    setErrorMessage(
                        `${reverseWeekdayMap[newRange.dayOfWeek]} ${existing.timeRange.fromTime}~${existing.timeRange.toTime} 시간대에 이미 수업이 있습니다.`
                    );
                    setIsErrorPopupOpen(true);
                    return; // 충돌 시 API 호출 없이 함수 종료
                }
            }
        }

        // --- 3. API 페이로드(Payload) 생성 ---

        // 기존 schoolCourses를 API DTO 형태로 변환
        const existingSchoolCoursesDto = (selectedTimeTableEntity.schoolCourses ?? []).map((course, i) => ({
            schoolCourseUuid: course.uuid,
            timeTableUuid: selectedTimeTableEntity.uuid
        }));

        // 새로 추가할 schoolCourse를 API DTO 형태로 생성
        const newSchoolCourseDto = {
            schoolCourseUuid: selectedCourse.uuid,
            timeTableUuid: selectedTimeTableEntity.uuid
        };

        const customCoursesDto = (selectedTimeTableEntity.customCourses ?? [])
            .filter(c => c.dayAndTimeRanges !== undefined)
            .map(c => ({
                courseGrade: c.courseGrade,
                courseGradeType: "A" as CourseGradeType, // 또는 아래 참고
                dayAndTimeRanges: c.dayAndTimeRanges!,
                roomName: c.roomName || '',
                subjectName: c.subjectName || '',
                professors: c.professors || '',
                timeTableUuid: selectedTimeTableEntity.uuid!,
            }));


        const payload: TimeTableEditDto = {
            uuid: selectedTimeTableEntity.uuid,
            customCourses: customCoursesDto,
            timeTableSchoolCourses: [...existingSchoolCoursesDto, newSchoolCourseDto],
        };

        // --- 4. API 호출 및 상태 업데이트 ---
        try {
            const res = await editTimeTable(payload, accessToken);

            // handleAdd 성공 시
            if (res.success) {
                await refetch();
                setIsClassListModalOpen(false);
            } else {
                setErrorMessage(res.messages ?? '시간표 추가에 실패했습니다.');
                setIsErrorPopupOpen(true);
            }
        } catch (error) {
            console.error("시간표 추가 API 호출 중 에러 발생:", error);
            setErrorMessage('네트워크 오류가 발생했습니다.');
            setIsErrorPopupOpen(true);
        }
    }


    return (
        <>
            {/* 딤 */}
            <div
                className="fixed inset-0 bg-dim z-[1000]"
                onClick={() => setIsClassListModalOpen(false)}
            />

            {/* 모달 카드 */}
            <div className="fixed pt-5 px-5 z-[1001] left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[550px] bg-white rounded-t-[24px] overflow-hidden h-[424px]">

                {/* 툴바(검색/필터) */}
                <div className="pb-2 bg-white no-scrollbar">

                    <div className="flex items-center gap-2 overflow-x-auto">
                        <div className="w-[34px] h-[34px] bg-gray-40 flex items-center justify-center rounded-[8px]">
                            <PlusIcon className="w-4 h-4 text-gray-70" />
                        </div>
                        {/* 검색 */}
                        <div className="w-[80px]">
                            <SearchInput
                                placeholder="검색"
                                value={searchTerm}
                                thin
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* 캠퍼스 */}
                        <div className="w-[76px]">
                            <DropdownInput
                                title=""
                                placeholder="캠퍼스"
                                onChange={handleCampusChange}
                                value={selectedCampus}
                                options={campusOptions}
                                thin
                            />
                        </div>

                        {/* 단과대 */}
                        <div className="w-[76px]">
                            <DropdownInput
                                title=""
                                placeholder="단과대"
                                onChange={handleCollegeChange}
                                value={selectedCollege}
                                options={collegeOptions}
                                disabled={selectedCampus === ALL_OPTION_ID}
                                thin
                            />
                        </div>

                        {/* 전공/영역 */}
                        <div className="w-[96px]">
                            <DropdownInput
                                title=""
                                placeholder="전공 / 영역"
                                onChange={handleMajorChange}
                                value={selectedMajor}
                                options={majorOptions}
                                disabled={selectedCollege === ALL_OPTION_ID}
                                thin
                            />
                        </div>
                    </div>
                </div>

                {/* 리스트 */}
                <div className="h-[362px] overflow-y-auto no-scrollbar">
                    {loading && !scrollLoading ? (
                        <Loader />
                    ) : searchTerm && searchTerm.length > 0 && courses.length === 0 ? (
                        <div className="flex flex-col w-full h-[320px] justify-center items-center">
                            <p className="text-bold-14 text-gray-90">검색 결과가 없습니다</p>
                            <p className="text-reg-12 text-gray-70">검색어를 다시 한번 확인해주세요</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {courses?.map((course) => {
                                const isSelected = selectedUuid === course.uuid;
                                return (
                                    <li
                                        key={course.uuid}
                                        className={`flex flex-col gap-2 justify-between items-center rounded-lg px-5 py-4 cursor-pointer ${isSelected ? "bg-bagstrap-10" : "hover:bg-bagstrap-10"}`}
                                        onClick={() =>
                                            setSelectedUuid((prev) => {
                                                if (!course.uuid) return null;
                                                return prev === course.uuid ? null : course.uuid;
                                            })
                                        }
                                    >
                                        <div className="w-full flex justify-between gap-2">
                                            <div className="flex flex-col">
                                                <p className="text-bold-14 text-gray-90">{course.subjectName}</p>
                                                <p className="text-semibold-12 text-gray-70">{course.professors}</p>
                                            </div>
                                            <div className="flex flex-col text-right text-reg-12 text-gray-60">
                                                <p className="whitespace-nowrap">담은끈 {course.numBooking ?? 0}</p>
                                                {/*<p className="whitespace-nowrap">정원 {(!course.extras || course.extras.length === 0) ? '미정' : course.extras}</p>*/}
                                            </div>
                                        </div>
                                        <div className="w-full flex text-reg-12 text-gray-70 gap-2">
                                            <p>{course.time?.split(",").join("")}</p>
                                            <p>{course.roomName}</p>
                                            <p>{course.studentYear}학년</p>
                                            <p>{course.kindsName}</p>
                                        </div>
                                        {isSelected && (
                                            <div className="flex w-full justify-end">
                                                <button
                                                    onClick={handleAdd}
                                                    className="mt-3 px-3 py-2 rounded-full text-white text-bold-12 bg-normal">
                                                    시간표에 추가
                                                </button>
                                            </div>
                                        )}

                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* 인피니트 스크롤 센티넬/로더 */}
                    {hasMore && courses.length > 0 && <div ref={observerRef} className="h-6" />}
                    {scrollLoading && (
                        <div className="mb-4">
                            <Loader heightFit />
                        </div>
                    )}
                </div>
            </div>

            <ErrorPopup
                isOpen={isErrorPopupOpen}
                setIsOpen={setIsErrorPopupOpen}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default observer(AddClassListModalMobile)