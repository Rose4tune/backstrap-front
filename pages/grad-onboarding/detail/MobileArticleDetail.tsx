import { observer } from "mobx-react"
import { components } from "src/types/api"
import Image from 'next/image'
import { useEffect, useState } from "react"
import getArticle from "@api/article/getByUuid"
import { useRouter } from "next/router"
import getFile from "@api/file/getFile"
import GradCommentSection from "src/components/grad-onboarding/GradCommentSection"
import DownloadIcon from 'src/assets/icons/common/[renewal]DownloadIcon.svg'
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg'
import unBookmarkArticle from "@api/article-bookmark/unBookmarkArticle"
import bookmarkArticle from "@api/article-bookmark/bookmarkArticle"
import { useStore } from "@stores/useStore.hook"
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook"

import ArticleContent from "src/components/common/ArticleContent";
interface Props {
    article: ArticleViewDto
}
type ArticleViewDto = components['schemas']['ArticleViewDto']

function MobileArticleDetail({ article }: Props) {
    const router = useRouter()
    const [articleObj, setArticleObj] = useState<ArticleViewDto>(article)
    useEffect(() => {
        if (!router.query.uuid) return;
        async function fetchArticle() {
            const res = await getArticle(router.query.uuid as string)
            if (res.success && res.data) {
                setArticleObj(res.data)
            }
        }
        fetchArticle()
    }, [router.query.uuid])

    const { UserStore } = useStore();
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const accessToken = UserStore.getAccessToken();
    const [relatedArticleList, setRelatedArticleList] = useState<ArticleViewDto[]>()


    async function downloadFile(fileS3Key: string, fileName: string) {
        try {
            const res = await getFile(fileS3Key);

            if (!res.success || !res.data) {
                throw new Error(res.messages ?? '다운로드 실패');
            }

            const blob = res.data as Blob; // blob 그대로
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName ?? 'downloaded-file';
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        }
    }

    //병렬 API 실행: relatedArticle 불러오기
    useEffect(() => {
        async function getRelatedArticle() {
            try {
                const promises = (article?.relatedArticleUuids ?? []).map(uuid => getArticle(uuid));
                const results = await Promise.all(promises);

                const tempList = results
                    .map(res => res.data)
                    .filter((item): item is ArticleViewDto => item !== undefined);

                setRelatedArticleList(tempList);
            } catch (error) {
                console.error(error);
            }
        }
        getRelatedArticle();
    }, [article]);


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
        if (articleUuid && (articleObj || relatedArticleList)) {
            related ?
                setRelatedArticleList((prev) =>
                    (prev || [])?.map((a) =>
                        a.uuid === articleUuid
                            ? { ...a, isBookmarkedByMe: !isBookMarked }
                            : a
                    )
                ) :
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
                related ?
                    setRelatedArticleList((prev) =>
                        (prev || [])?.map((a) =>
                            a.uuid === articleUuid
                                ? { ...a, isBookmarkedByMe: !isBookMarked }
                                : a
                        )
                    ) :
                    setArticleObj((prev) => {
                        return (
                            { ...prev, isBookmarkedByMe: !isBookMarked }
                        )
                    })
            }
        }
    }

    return (
        <div className="min-h-[calc(100vh-100px)] overflow-y-auto">
            {/* main */}
            <div className="flex flex-1 flex-col px-3">
                {/* 썸네일 */}
                <div className="overflow-hidden w-full h-[250px] relative bg-gray-90 mb-[40px] rounded-[20px]">
                    <Image
                        src={articleObj.imageUrlMO as string}
                        alt="thumbnail"
                        fill
                        className="object-cover bg-white"
                    />
                </div>
                <div className="flex flex-col pb-[100px] px-2">
                    <div className="flex flex-col gap-1 mb-[32px]">
                        {/* 태그 */}
                        <div className="flex gap-1 flex-wrap">
                            {articleObj.tags?.map((tag) => {
                                return (
                                    <div className="text-reg-14 text-gray-70">
                                        {'#' + tag.name}
                                    </div>
                                )
                            })}
                        </div>
                        {/* 제목 */}
                        <div className="flex items-center">
                            <div className="flex-1 min-w-0 truncate text-bold-20 text-black">{articleObj.title}</div>
                        </div>
                        {/* 소제목 */}
                        <div className="flex text-med-14 text-gray-70">
                            <div className="flex-1 min-w-0 truncate">{articleObj.smallTitle}</div>
                        </div>
                    </div>
                    {/* 본문: ReactQuillNew */}
                    <div 
                        className="mb-[24px]">
                        <ArticleContent content={articleObj.content ?? ""} />
                    </div>
                    {/* 파일 다운로드 */}
                    <div className="flex flex-col gap-2 mb-[32px]">
                        {articleObj.includedFiles?.map((file) =>
                            <div className="w-full flex px-5 py-3 rounded-[8px] justify-between items-center bg-gray-20">
                                <span className="text-semibold-14 text-gray-90">{file.fileName}</span>
                                <button className="w-8 h-8 items-center justify-center"
                                    onClick={() => {
                                        downloadFile(file.fileS3Key as string, file.fileName as string)
                                    }}
                                >
                                    <DownloadIcon width={20} height={20} className="text-gray-90" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 좋아요수, 스크랩, 공유하기 */}
                    {/* <GradArticleAction interaction={{"likeCount": articleObj, "commentCount":articleObj., "isLiked":true}} postUuid={""} /> */}

                    {/* 댓글 */}
                    <div className="flex mb-5">
                        <GradCommentSection uuid={articleObj.uuid as string} />
                    </div>

                    {/* 연관 콘텐츠 */}
                    <div className="flex flex-col gap-3">
                        <span className="text-bold-16 text-gray-90">연관 콘텐츠</span>
                        <div className="flex flex-col gap-6">
                            {
                                relatedArticleList?.map((ra) => {
                                    return (
                                        <div className="flex w-full cursor-pointer"
                                            onClick={() => router.push(`/grad-onboarding/detail/${ra.uuid}`)}
                                        >
                                            <div className="flex flex-1 flex-col justify-center">
                                                <span className="flex w-full min-w-0 truncate text-bold-14 text-gray-90">{ra.title}</span>
                                                <span className="line-clamp-2 text-med-12 text-gray-60">{ra.smallTitle}</span>
                                            </div>
                                            {/* bookmark 되는 썸네일 */}
                                            <div className="relative w-[84px] h-[56px] rounded-[8px] overflow-hidden">
                                                <button
                                                    onClick={event => {
                                                        event.stopPropagation()
                                                        handleBookmark(event, ra.isBookmarkedByMe, ra.uuid, true)
                                                    }
                                                    }
                                                    className="absolute top-0 right-0 p-1 z-20"
                                                >
                                                    <BookmarkIcon width={24} height={24} className={ra.isBookmarkedByMe ? 'text-yellow' : 'text-gray-40'} />
                                                </button>
                                                <Image
                                                    src={ra.imageUrlMO as string}
                                                    alt="thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
            {AuthModalComponent}
        </div >
    )
}

export default observer(MobileArticleDetail)