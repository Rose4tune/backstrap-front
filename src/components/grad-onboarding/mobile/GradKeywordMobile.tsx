import { observer } from "mobx-react";
import NewIcon from "src/assets/icons/grad-onboarding/NewIcon.svg";
import { useRouter } from "next/router";
import ArrowUpIcon from "src/assets/icons/common/ArrowUpIcon.svg";
import ArrowDownIcon from "src/assets/icons/common/ArrowDownIcon.svg"; import { useEffect, useState } from "react";
import { components } from "src/types/api";
interface Props {
    keywordList: TagEntityViewDto[] | null
}

type TagEntityViewDto = components['schemas']['TagEntityViewDto']

function GradKeywordMobile({ keywordList }: Props) {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [isKeywordOpen, setIsKeywordOpen] = useState(false);

    // 닫혀 있을 때만 3초마다 다음 키워드로 이동
    useEffect(() => {
        if (isKeywordOpen || !keywordList || keywordList.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) =>
                prev === keywordList.length - 1 ? 0 : prev + 1
            );
        }, 3000);
        return () => clearInterval(timer);
    }, [keywordList, isKeywordOpen]);

    // 키워드 정렬
    const sortedKeywords = keywordList?.sort(
        (a, b) => (a?.topDisplayOrder || 0) - (b?.topDisplayOrder || 0)
    ) ?? [];

    return (
        <div className={`flex justify-between ${isKeywordOpen ? 'items-start' : 'items-center'} px-5 py-3 w-full bg-gray-30`}>
            <div className={`flex flex-1 gap-2 ${isKeywordOpen ? 'items-start' : 'items-center'}`}>
                <span className="text-hover text-bold-16 whitespace-nowrap">
                    실시간
                </span>

                {/* 키워드 컨테이너 */}
                <div className="relative flex-1 overflow-hidden">
                    {isKeywordOpen ? (
                        // ---------- 열린 상태: 최대 5개 리스트 표시 ----------
                        <div className="flex flex-col gap-[6px]">
                            {sortedKeywords.slice(0, 5).map((obj) => (
                                <div
                                    key={obj.uuid}
                                    className="flex gap-2 items-center h-6 cursor-pointer"
                                    onClick={() =>
                                        router.push({
                                            pathname: "/grad-onboarding/list",
                                            query: { tagUuid: obj.uuid },
                                        })
                                    }
                                >
                                    <span className="text-bold-16 text-gray-90">
                                        {obj.topDisplayOrder?.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-semibold-16 text-gray-90 truncate">
                                        {obj.name}
                                    </span>
                                    {obj.isNew && (
                                        <span className="flex">
                                            <NewIcon width={12} height={12} />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // ---------- 닫힌 상태: 하나씩 롤링 ----------
                        <div className="relative h-6">
                            <div
                                className="absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateY(-${current * 1.5}rem)`,
                                }}
                            >
                                {sortedKeywords.map((obj) => (
                                    <div
                                        key={obj.uuid}
                                        className="flex gap-2 items-center h-6 cursor-pointer"
                                        onClick={() =>
                                            router.push({
                                                pathname: "/grad-onboarding/list",
                                                query: { tagUuid: obj.uuid },
                                            })
                                        }
                                    >
                                        <span className="text-bold-16 text-gray-90">
                                            {obj.topDisplayOrder?.toString().padStart(2, "0")}
                                        </span>
                                        <span className="text-semibold-16 text-gray-90 truncate">
                                            {obj.name}
                                        </span>
                                        {obj.isNew && (
                                            <span className="flex">
                                                <NewIcon width={12} height={12} />
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 토글 버튼 */}
            <div
                className="w-[24px] h-[24px] flex justify-center items-center cursor-pointer"
                onClick={() => setIsKeywordOpen((prev) => !prev)}
            >
                {isKeywordOpen ? (
                    <ArrowUpIcon width={20} height={20} className="text-gray-50" />
                ) : (
                    <ArrowDownIcon width={20} height={20} className="text-gray-50" />
                )}
            </div>
        </div>
    )

}

export default observer(GradKeywordMobile)