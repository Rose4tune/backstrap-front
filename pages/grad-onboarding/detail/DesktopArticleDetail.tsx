import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { components } from "src/types/api";
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg'
import ShareIcon from 'src/assets/icons/common/ShareIcon.svg'
import unBookmarkArticle from "@api/article-bookmark/unBookmarkArticle";
import bookmarkArticle from "@api/article-bookmark/bookmarkArticle";
import { useStore } from "@stores/useStore.hook";
import DownloadIcon from "src/assets/icons/common/[renewal]DownloadIcon.svg"
import Image from 'next/image'
import getFile from "@api/file/getFile";
import getArticle from "@api/article/getByUuid";
import getHotArticleReviews from "@api/review/getHotArticleReviews";
import useAuthGuardModalDialog from "@hooks/bagstrap/user/useAuthGuardModalDialog.hook";
import { useRouter } from "next/router";
import GradCommentSection from "src/components/grad-onboarding/GradCommentSection";
import ArticleContent from "src/components/common/ArticleContent";
import getArticleList from "@api/article-detail/getArticleList";
interface Props {
    article: ArticleViewDto
}

type ArticleViewDto = components['schemas']['ArticleViewDto']
type ReviewViewDtoRes = components['schemas']['ReviewViewDtoRes']

function DesktopArticleDetail({ article }: Props) {
    const [relatedArticleList, setRelatedArticleList] = useState<ArticleViewDto[]>()
    const router = useRouter()

    const [articleObj, setArticleObj] = useState<ArticleViewDto>(article)
    useEffect(() => {
        if (!router.query.uuid) return;
        async function fetchArticle() {
            const res = await getArticle(router.query.uuid as string, accessToken as string)
            if (res.success && res.data) {
                setArticleObj(res.data)
            }
        }
        fetchArticle()
    }, [router.query.uuid])

    const [hotCommentList, setHotCommentList] = useState<ReviewViewDtoRes[]>()
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

    useEffect(() => {
    async function getRelatedArticle() {
        try {
        const res = await getArticleList(50, accessToken)
        if (res.success && res.data?.data) {
            const list = res.data.data.sort(
            (a, b) =>
                new Date(b.createdDate ?? '').getTime() -
                new Date(a.createdDate ?? '').getTime()
            )

            const currentDate = new Date(articleObj.createdDate ?? '')

            // 현재 글보다 최신인 글
            const newer = list
            .filter(item => new Date(item.createdDate ?? '') > currentDate)
            .sort(
                (a, b) =>
                new Date(a.createdDate ?? '').getTime() -
                new Date(b.createdDate ?? '').getTime()
            )

            // 현재 글보다 이전인 글
            const older = list
            .filter(item => new Date(item.createdDate ?? '') < currentDate)
            .sort(
                (a, b) =>
                new Date(b.createdDate ?? '').getTime() -
                new Date(a.createdDate ?? '').getTime()
            )

            let related: ArticleViewDto[] = []

            if (newer.length === 0) {
            // 현재 글이 최신글일 경우 → 이후(이전) 게시글 5개
            related = older.slice(0, 5)
            } else {
            // 최신글이 아닌 경우 → 최신 1개 + 이후 4개
            related.push(newer[0])
            related = [...related, ...older.slice(0, 4)]

            // 5개 미만이면 최신글에서 보충
            if (related.length < 5) {
                const remain = 5 - related.length
                related = [...related, ...newer.slice(1, 1 + remain)]
            }
            }

            // 현재 글 제외
            related = related.filter(item => item.uuid !== articleObj.uuid)

            setRelatedArticleList(related)
        }
        } catch (error) {
        console.error('연관/최신 게시글 불러오기 실패:', error)
        }
    }

    getRelatedArticle()
    }, [articleObj])

    //가장 핫한 댓글 불러오기
    useEffect(() => {
        async function getHotComments() {
            try {
                const results = await getHotArticleReviews(7)
                setHotCommentList(results.data || [])
            } catch (error) {
                console.error(error)
            }
        }

        getHotComments()
    }, [article])

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

    return (
        <div className="flex gap-[60px] px-20 max-w-[1920px] pb-[120px] overflow-hidden w-full mx-auto pt-12">
            {/* main */}
            <div className="flex flex-1 flex-col min-w-0">
            
                {/* 썸네일 + 텍스트 */}
                <div className="flex flex-row items-start gap-[32px] mb-[56px]">
                    {/* 썸네일 */}
                    <div className="overflow-hidden rounded-[24px] w-[300px] h-[200px] flex-shrink-0 relative">
                        <Image
                            src={articleObj.imageUrlMO as string}
                            alt="thumbnail"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* 텍스트 블록 */}
                    <div className="flex flex-col flex-1 min-w-0">
                        {/* 제목 + 버튼 */}
                        <div className="flex justify-between items-start h-[60px] mb-[8px] gap-4">
                            {/* 텍스트 블록 */}
                            <div className="flex flex-col justify-start h-[60px] flex-1 min-w-0 overflow-hidden">
                                <div className="text-semibold-22 text-black leading-[24px] truncate">
                                    {articleObj.title}
                                </div>
                                <div className="text-med-16 text-gray-70 leading-[20px] truncate mt-[4px]">
                                    {articleObj.smallTitle}
                                </div>
                            </div>

                            {/* 버튼 그룹 */}
                            <div className="flex gap-2 items-center shrink-0">
                                <button
                                    className="bg-gray-30 rounded-[12px] flex items-center justify-center w-[46px] h-[46px]"
                                    onClick={(event) =>
                                        handleBookmark(event, articleObj.isBookmarkedByMe, articleObj.uuid)
                                    }
                                >
                                    <BookmarkIcon
                                        width={20}
                                        height={20}
                                        className={
                                            articleObj.isBookmarkedByMe ? "text-yellow" : "text-gray-70"
                                        }
                                    />
                                </button>
                                <button
                                    className="bg-gray-30 rounded-[12px] flex items-center justify-center w-[46px] h-[46px]"
                                    onClick={() => console.log("share")}
                                >
                                    <ShareIcon width={20} height={20} className="text-gray-70" />
                                </button>
                            </div>
                        </div>


                        {/* 태그 */}
                        <div className="flex gap-3 flex-wrap">
                            {articleObj.tags?.map((tag) => (
                                <div
                                    key={tag.uuid}
                                    className="px-3 py-2 rounded-[12px] bg-gray-30 text-gray-70 text-[14px] leading-[14px]"
                                >
                                    {tag.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 하단 섹션 (본문, 파일, 댓글) */}
                <div className="flex flex-col">
                    {/* 본문 */}
                    <article className=" max-w-none mb-[16px]">
                        <ArticleContent content={articleObj.content as string} />
                    </article>

                    {/* 파일 다운로드 */}
                    <div className="flex flex-col gap-4 mb-[76px]">
                        {articleObj.includedFiles?.map((file) => (
                            <div
                                key={file.fileS3Key}
                                className="w-full flex px-10 py-4 rounded-[24px] justify-between items-center bg-gray-20"
                            >
                                <span className="text-semibold-16 text-gray-90">{file.fileName}</span>
                                <button
                                    className="w-12 h-12 items-center justify-center"
                                    onClick={() =>
                                        downloadFile(file.fileS3Key as string, file.fileName as string)
                                    }
                                >
                                    <DownloadIcon width={24} height={24} className="text-gray-90" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 댓글 */}
                    <GradCommentSection uuid={articleObj.uuid as string} />
                </div>
            </div>

            {/* 사이드 */}
            <div className="flex flex-col 4xl:w-[356px] 2xl:w-[220px] gap-8 shrink-0">
                {/* 연관 콘텐츠 */}
                <div className="flex flex-col gap-4">
                    <span className="text-bold-20 text-gray-90">연관 콘텐츠</span>
                    <div className="flex flex-col gap-4">
                        {
                            relatedArticleList?.length == 0 ?
                                <div className="text-gray-70 text-med-16">
                                    연관된 콘텐츠가 없습니다.
                                </div> :
                                relatedArticleList?.map((ra) => {
                                    return (
                                        <div className="flex w-full cursor-pointer gap-[4px]"
                                            onClick={() => router.push(`/grad-onboarding/detail/${ra.uuid}`)}
                                        >
                                            <div className="flex flex-1 flex-col justify-center min-w-0">
                                                <span className="truncate text-semibold-16 text-gray-90">{ra.title}</span>
                                                <span className="truncate text-med-14 text-gray-60">{ra.smallTitle}</span>
                                            </div>
                                            {/* bookmark 되는 썸네일 */}
                                            <div className="relative 2xl:w-[65px] 3xl:w-[75px] h-[50px] rounded-[8px] overflow-hidden shrink-0">
                                                <button
                                                    onClick={event => {
                                                        event.stopPropagation()
                                                        handleBookmark(event, ra.isBookmarkedByMe, ra.uuid, true)
                                                    }
                                                }
                                                    className="absolute top-1 right-1 z-20"
                                                >
                                                    <BookmarkIcon width={24} height={24} className={ra.isBookmarkedByMe ? 'text-yellow' : 'text-gray-40'} />
                                                </button>
                                                 <Image
                                                    src={ra.imageUrlM as string}
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
                {/* 가장 핫한 댓글 */}
                {hotCommentList && hotCommentList?.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <span className="text-bold-20 text-gray-90">가장 핫한 댓글</span>
                        <div className="flex flex-col gap-3">
                            {hotCommentList.map((c) => (
                                <div key={c.uuid}>{c.content}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {AuthModalComponent}
        </div>
    )

}

export default observer(DesktopArticleDetail)
