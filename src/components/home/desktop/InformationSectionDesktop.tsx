import { useRouter } from "next/router"
import SectionHeaderDesktop from "./SectionHeaderDesktop"
import CommentsIcon from "src/assets/icons/home/CommentsIcon.svg"
import { useEffect, useState } from "react"
import getTopFixedBoard from "src/apis/board/getTopFix"
import { components } from "src/types/api"
import NoticeIcon from "src/assets/icons/home/NoticeIcon.svg"
import getBoardsByPaging from "src/apis/board/getByPaging"
import PostRow from "./PostRow"
import ArrowRightIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg"

type BoardEntityViewDto = components['schemas']['BoardEntityView'];

interface InformationSectionProps {
    fixNotice?: BoardEntityViewDto;
    postList?: BoardEntityViewDto[];
}
export default function InformationSectionDesktop({ fixNotice, postList }: InformationSectionProps) {
    const router = useRouter()
    return (
        <div className="flex flex-1 flex-col space-y-4 px-[20px] min-w-0">
            <SectionHeaderDesktop icon={CommentsIcon}
                content={
                    "정보 게시끈"
                }
                navigateText="전체보기"
                onClick={() => router.push('/community/hifnflwnqw?name=정보 게시끈')}
            />
            {fixNotice &&
                <div
                    className="flex truncate whitespace-nowrap justify-between bg-gray-20 rounded-[8px] py-[12px] px-[16px] items-center cursor-pointer"
                    onClick={() => router.push(`board/post/${fixNotice.uuid}`)}
                >
                    <div className="flex flex-1 gap-[8px] truncate whitespace-nowrap">
                        <NoticeIcon width={24} height={24} />
                        <p className="text-semibold-14 text-gray-90 mt-[4px] truncate whitespace-nowrap">{fixNotice?.title}</p>
                    </div>
                    <div className="flex">
                        <ArrowRightIcon width={20} height={20} className=" text-gray-50" />
                    </div>
                </div>}

            <div className="space-y-3">
                {postList?.map((item, idx) => (
                    <div key={idx} onClick={() => router.push(`/community/post/${item.uuid}`)} className="flex items-start space-x-5 pl-2 cursor-pointer">
                        {/* 순위 */}
                        <p className="text-bold-20 text-gray-90">{idx + 1}</p>

                        {/* 본문 */}
                        <PostRow item={item} />
                    </div>
                ))}
            </div>
        </div >



    )
}