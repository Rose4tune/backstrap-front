import bookmarkArticle from "@api/article-bookmark/bookmarkArticle";
import unBookmarkArticle from "@api/article-bookmark/unBookmarkArticle";
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useState } from "react";
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg'
import SearchIcon from 'src/assets/icons/common/SearchIcon.svg'
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg'
import { components } from "src/types/api";

interface Props {
    page: "HOME" | "LIST" | "DETAIL"
    article?: ArticleViewDto
}

type ArticleViewDto = components['schemas']['ArticleViewDto']


function MobileGradHeader({ page, article }: Props) {
    const router = useRouter()
    const [articleObj, setArticleObj] = useState<ArticleViewDto>(article as ArticleViewDto)
    const { UserStore } = useStore();
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const accessToken = UserStore.getAccessToken();
    /** 북마크 토글 */
    async function handleBookmark(
        event: React.MouseEvent,
        isBookMarked?: boolean,
        articleUuid?: string,
        related?: boolean
    ) {
        event.stopPropagation();
        if (!accessToken) {
            openAuthModal();
            return;
        }
        if (articleUuid && (articleObj)) {
            setArticleObj((prev) => {
                return (
                    { ...prev, isBookmarkedByMe: !isBookMarked }
                )
            })
            try {
                if (isBookMarked) {
                    await unBookmarkArticle(articleUuid, accessToken);
                } else {
                    await bookmarkArticle(articleUuid, accessToken);
                }
            } catch (e) {
                console.error(e);
                setArticleObj((prev) => {
                    return (
                        { ...prev, isBookmarkedByMe: !isBookMarked }
                    )
                })
            }
        }
    }
    const MiddlePart =
        page === "HOME" ?
            // HOME
            <div className="text-gray-90 text-semibold-16">대학원 온보딩</div> :
            page === "LIST" ?
                // LIST
                <div></div> :
                // DETAIL
                <div></div>
    const LastPart =
        page === "HOME" ?
            // HOME
            <div className="w-[26px] h-[26px]" /> :
            page === "LIST" ?
                // LIST
                <div></div> :
                // DETAIL
                <div className="flex gap-[14px]">
                    {/* <div className="w-[26px] h-[26px] justify-center items-center">
                        <SearchIcon width={20} height={20} className="text-gray-50" />
                    </div> */}
                    <div className="w-[26px] h-[26px] justify-center items-center"
                        onClick={(event) => handleBookmark(
                            event,
                            articleObj.isBookmarkedByMe,
                            articleObj.uuid
                        )}
                    >
                        <BookmarkIcon width={20} height={20} className={articleObj?.isBookmarkedByMe ? 'text-yellow' : 'text-gray-50'} />
                    </div>
                </div>

    return (
        <>
            <div className="flex px-[20px] pt-[53px] pb-[20px] justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="flex w-[26px] h-[26px] justify-center items-center"
                >
                    <LeftArrowIcon width={20} height={20} className="text-gray-50" />
                </button>
                {MiddlePart}
                {LastPart}
                {AuthModalComponent}
            </div>
        </>

    )
}

export default observer(MobileGradHeader)