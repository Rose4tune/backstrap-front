import { useRouter } from "next/router";
import TrophyIcon from "src/assets/icons/home/TrophyIcon.svg"
import getBoardsByPaging from "src/apis/board/getByPaging";
import { useEffect, useState } from "react";
import { components } from "src/types/api";
import SectionHeaderMobile from "./SectionHeaderMobile";
import ImageIcon from "src/assets/icons/home/ImageIcon.svg"
import BestTextButtonMobile from "./BestTextButtonMobile";
import LoveIcon from "src/assets/icons/home/LoveIcon.svg"
import SmallCommentIcon from "src/assets/icons/home/SmallCommentIcon.svg"
import { ButtonEnumMap, TextButtonType } from "src/types/textbuttonType";
import hasImage from "src/utils/home/hasImage";

type BoardEntityViewDto = components['schemas']['BoardEntityView'];
export default function BestPostSectionMobile({ bestPostList }: { bestPostList?: BoardEntityViewDto[] }) {
    const router = useRouter()
    const [selectedButton, setSelectedButton] = useState<TextButtonType>("IF 높은 끈")
    const [postList, setPostList] = useState<BoardEntityViewDto[] | undefined>(bestPostList)
    //글 목록 받아오기
    useEffect(() => {
        async function getPostList() {
            try {
                const response = await getBoardsByPaging({
                    sortType: ButtonEnumMap[selectedButton],
                    paginationRequestDto: {
                        count: 7
                    }
                })
                setPostList(response.data?.data)
            } catch (error) {
                console.error(error)
            }
        }
        getPostList()
    }, [selectedButton])
    return (
        <div className="flex flex-1 flex-col">
            <SectionHeaderMobile icon={TrophyIcon}
                content={
                    <p>가방끈 <span className="text-normal">BEST</span> 이야기</p>
                }
                navigateText="전체보기"
                onClick={() => router.push(`/community/best?sortType=${ButtonEnumMap[selectedButton]}&name=가방끈 BEST 이야기`)}
            />
            <BestTextButtonMobile selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
            <div className="space-y-2 mb-[20px]">
                {postList?.map((item, idx) => (
                    <div key={idx} onClick={() => router.push(`/community/post/${item.uuid}`)} className="flex items-center justify-between cursor-pointer truncate">
                        <div className="flex items-center flex-1 min-w-0 overflow-hidden mr-3">
                            {/* 순위 */}
                            <p className="text-bold-16 text-gray-90 mr-2">{idx + 1}</p>
                            {/* 이미지 있는 경우 */}
                            {hasImage(item.content || '') && <ImageIcon className="text-gray-60 w-[16px] h-[16px] mr-1" />}
                            {/* 제목 */}
                            <p className="text-semibold-14 text-gray-90 mr-2">
                                {item.title}
                            </p>
                            {/* 내용 */}
                            <p className="text-med-12 text-gray-60 mr-2 mt-[2px]">
                                {item.summary}
                            </p>
                        </div>

                        <div className="flex items-center gap-[8px]">
                            <div className="flex items-center text-semibold-10 text-gray-70 space-x-1">
                                <LoveIcon className="w-[12px] h-[12px]" />
                                <span >{item.likeCount}</span>
                            </div>
                            <div className="flex items-center  text-semibold-10 text-gray-70 space-x-1">
                                <SmallCommentIcon className="w-[12px] h-[12px]" />
                                <span>{item.reviewCount}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>

    )
}