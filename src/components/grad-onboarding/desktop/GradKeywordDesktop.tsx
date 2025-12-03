import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import MedalIcon from 'src/assets/icons/grad-onboarding/MedalIcon.svg'
import NewIcon from 'src/assets/icons/grad-onboarding/NewIcon.svg'
import { components } from "src/types/api";

type TagEntityViewDto = components["schemas"]["TagEntityViewDto"]

function GradKeywordDesktop({ keywordList }: { keywordList: TagEntityViewDto[] | null }) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-[20px] bg-gray-20 px-[32px] pt-[28px] pb-[18px] rounded-[12px] w-[270px] shrink-0">
            <div className="flex flex-col gap-[4px]">
                <div className="flex gap-[12px]">
                    <MedalIcon width={32} height={32} />
                    <p className="text-black text-bold-20 whitespace-no-wrap">
                        실시간 인기 키워드
                    </p>
                </div>
                <p className="text-semibold-16 text-gray-70">
                    가방끈에서 가장 많이 보고있어요
                </p>
            </div>
            {keywordList
                ?.sort(
                    (a, b) => (a?.topDisplayOrder || 0) - (b?.topDisplayOrder || 0)
                )
                .map((obj) => (
                    <div
                        key={obj.uuid}
                        className="flex gap-[4px] items-center min-w-0 cursor-pointer"
                        onClick={() => router.push(
                            {
                                pathname: '/grad-onboarding/list',
                                query: { tagUuid: obj.uuid }
                            }
                        )}
                    >
                        <span className="text-bold-20 text-gray-90">
                            {obj.topDisplayOrder?.toString().padStart(2, "0")}
                        </span>
                        <span className="text-med-20 text-black truncate min-w-0">
                            {obj.name}
                        </span>
                        {
                            obj.isNew && (
                                <span className="flex mb-[2px]">
                                    <NewIcon width={16} height={16} />
                                </span>
                            )
                        }
                    </div>
                ))
            }
        </div >
    )

}

export default observer(GradKeywordDesktop)