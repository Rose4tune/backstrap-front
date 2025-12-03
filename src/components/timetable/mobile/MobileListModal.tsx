import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import getTimeTables from "@api/time-table/getTimeTables";
import { useStore } from "@stores/useStore.hook";
import ArrowLeftIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg";
import PlusIcon from "src/assets/icons/common/PlusIcon.svg";
import { components } from "src/types/api";
import Loader from "src/components/common/Loader";
import TimeTableAddModalMobile from "./TimeTableAddModalMobile";
import { observer } from "mobx-react";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];

interface MobileListProps {
    setIsMobileListModalOpen: Dispatch<SetStateAction<boolean>>;
    templateList: TimeTableTemplate[];
    setSelectedTimeTableEntity: Dispatch<SetStateAction<TimeTableEntityView>>
    selectedTimeTableEntity: TimeTableEntityView
    setTimeTableEntityList: Dispatch<SetStateAction<TimeTableEntityView[]>>
}

type SemesterCode = "FALL" | "SPRING" | "WINTER" | "SUMMER";
const semesterLabel: Record<SemesterCode, string> = {
    SPRING: "1학기",
    SUMMER: "여름학기",
    FALL: "2학기",
    WINTER: "겨울학기",
};
const semesterRank: Record<SemesterCode, number> = {
    WINTER: 4,
    FALL: 3,
    SUMMER: 2,
    SPRING: 1,
};

type Grouped = {
    year: number;
    semester: SemesterCode;
    list: TimeTableEntityView[];
};

function MobileListModal({ templateList, setIsMobileListModalOpen, selectedTimeTableEntity, setTimeTableEntityList, setSelectedTimeTableEntity }: MobileListProps) {
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId();
    const accessToken = UserStore.getAccessTokenFromCookies();

    const [groups, setGroups] = useState<Grouped[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTTAddModal, setIsTTAddModal] = useState<boolean>(false)
    const [refreshKey, setRefreshKey] = useState(0); // register시 갱신할 refreshKey

    const uniqTemplates = useMemo(() => {
        const seen = new Set<string>();
        return templateList.filter((t) => {
            const k = `${t.year}-${t.semester}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });
    }, [templateList]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!userUuid || !accessToken || uniqTemplates.length === 0) {
                setGroups([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const results = await Promise.all(
                    uniqTemplates.map(async (tpl) => {
                        const res = await getTimeTables(
                            { semesterType: tpl.semester as SemesterCode, year: tpl.year, userUuid },
                            accessToken
                        );
                        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                            return {
                                year: tpl.year,
                                semester: tpl.semester as SemesterCode,
                                list: res.data as TimeTableEntityView[],
                            } as Grouped;
                        }
                        return null;
                    })
                );
                const filtered = (results.filter(Boolean) as Grouped[])
                    .sort((a, b) => (a.year !== b.year ? b.year - a.year : semesterRank[b.semester] - semesterRank[a.semester]));
                if (mounted) setGroups(filtered);
            } catch (e) {
                console.error(e);
                if (mounted) setGroups([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [userUuid, accessToken, uniqTemplates, refreshKey]);

    return (
        <div className="fixed inset-0 max-w-[550px] mx-auto bg-white z-[10001]">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white/95 backdrop-blur px-5">
                <div className="flex w-full items-center justify-between pt-[53px] pb-[14px]">
                    <button onClick={() => setIsMobileListModalOpen(false)}>
                        <ArrowLeftIcon className="w-5 h-5 text-gray-50" />
                    </button>
                    <div className="text-bold-16 text-gray-90">시간표 목록</div>
                    <button
                        onClick={() => {
                            setIsTTAddModal(true)
                        }}
                    >
                        <PlusIcon className="w-6 h-6 text-gray-50" />
                    </button>
                </div>
            </div>

            {/* 본문 */}
            <main className="px-5 pb-6 space-y-3 overflow-y-auto h-[calc(100vh-100px)]">
                {loading ? (
                    <div className="w-full py-16 text-center text-gray-60 text-reg-14"><Loader heightFit /></div>
                ) : groups.length === 0 ? (
                    <div className="w-full py-16 text-center text-gray-60 text-reg-14">표시할 시간표가 없습니다.</div>
                ) : (
                    groups.map((g) => (
                        <section
                            key={`${g.year}-${g.semester}`}
                            className="rounded-[16px] bg-gray-20 px-4 py-4"
                        >
                            {/* 카드 타이틀: 2024년 1학기 */}
                            <div className="text-semibold-14 text-gray-90 mb-3">
                                {g.year}년 {semesterLabel[g.semester]}
                            </div>

                            {/* 시간표 이름 리스트 */}
                            <ul className="flex flex-col">
                                {g.list
                                    .slice() // 원본 배열 변경 방지
                                    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)) // isFavorite=true 먼저
                                    .map((tt) => (
                                        <li key={tt.uuid}>
                                            <button
                                                onClick={() => {
                                                    setSelectedTimeTableEntity(tt);
                                                    setIsMobileListModalOpen(false);
                                                }}
                                                className="gap-1 flex items-end py-1 hover:bg-bagstrap-10 px-2 rounded-[8px]"
                                            >
                                                <div className="text-semibold-14 text-gray-90">{tt.name}</div>
                                                {/* 대표 표시 */}
                                                {tt.isFavorite ? (
                                                    <button className="text-semibold-12 text-click">
                                                        기본
                                                    </button>
                                                ) : null}
                                            </button>
                                        </li>
                                    ))}
                            </ul>

                        </section>
                    ))
                )}
            </main>
            {isTTAddModal && <TimeTableAddModalMobile setRefreshKey={setRefreshKey} selectedTimeTableEntity={selectedTimeTableEntity} setTimeTableEntityList={setTimeTableEntityList} setIsTTAddModal={setIsTTAddModal} templateList={templateList} />}
        </div >
    );
}

export default observer(MobileListModal)