import { useRouter } from "next/router";
import SectionHeaderDesktop from "./SectionHeaderDesktop";
import TrophyIcon from "src/assets/icons/home/TrophyIcon.svg"
import PostRow from "./PostRow";
import getBoardsByPaging from "src/apis/board/getByPaging";
import { useEffect, useState } from "react";
import { components } from "src/types/api";
import BestTextButton from "../BestTextButton";
import { ButtonEnumMap, TextButtonType } from "src/types/textbuttonType";
type BoardEntityViewDto = components['schemas']['BoardEntityView'];

export default function BestPostSectionDesktop({ bestPostList }: { bestPostList?: BoardEntityViewDto[] }) {
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
        <div className="flex flex-1 flex-col space-y-4 px-[20px] min-w-0">
            <SectionHeaderDesktop icon={TrophyIcon}
                content={
                    <p>가방끈 <span className="text-normal">BEST</span> 이야기<span></span></p>
                }
                navigateText="전체보기"
                onClick={() => router.push(`/community/best?sortType=${ButtonEnumMap[selectedButton]}&name=가방끈 BEST 이야기`)}
            />
            <BestTextButton selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
            {postList?.map((item, idx) => (
                <div key={idx}
                    onClick={() => router.push(`/community/post/${item.uuid}`)}
                    className="flex flex-1 items-start space-x-5 pl-2 cursor-pointer"
                >
                    {/* 순위 */}
                    <p className="text-bold-20 text-gray-90">{idx + 1}</p>

                    {/* 본문*/}
                    <PostRow item={item} />
                </div>
            ))}
        </div>
    )
}