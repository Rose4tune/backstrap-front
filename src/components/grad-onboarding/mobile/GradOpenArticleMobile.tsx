import React, { useState, useRef, useEffect } from 'react';
import SectionHeaderDesktop from 'src/components/home/desktop/SectionHeaderDesktop';
import { components } from 'src/types/api';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import { useRouter } from 'next/router';
import unBookmarkArticle from '@api/article-bookmark/unBookmarkArticle';
import bookmarkArticle from '@api/article-bookmark/bookmarkArticle';
import TrophyIcon from "src/assets/icons/home/TrophyIcon.svg"
import Image from 'next/image';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import SectionHeaderMobile from 'src/components/home/mobile/SectionHeaderMobile';

type ArticleViewDto = components['schemas']['ArticleViewDto']

const GradOpenArticleMobile = ({ openArticleList }: { openArticleList: ArticleViewDto[] | null }) => {

    const router = useRouter();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessToken();

    const [articleList, setArticleList] = useState<ArticleViewDto[]>(openArticleList || []);

    // 북마크 토글
    async function handleBookmark(event: React.MouseEvent, isBookMarked?: boolean, articleUuid?: string) {
        event.stopPropagation();
        if (!accessToken) {
            openAuthModal();
            return;
        }
        if (articleUuid && articleList) {
            setArticleList(prev =>
                prev?.map(a =>
                    a.uuid === articleUuid ? { ...a, isBookmarkedByMe: !isBookMarked } : a
                )
            );
            try {
                if (isBookMarked) {
                    await unBookmarkArticle(articleUuid, accessToken);
                } else {
                    await bookmarkArticle(articleUuid, accessToken);
                }


            } catch (e) {
                console.error(e);
                setArticleList(prev =>
                    prev?.map(a =>
                        a.uuid === articleUuid ? { ...a, isBookmarkedByMe: !isBookMarked } : a
                    )
                );
            }
        }
    }

    return (
        <div className="flex flex-col w-full space-y-5 px-5 pt-4 pb-5">
            <div className="flex flex-col w-full">
                <SectionHeaderMobile
                    icon={TrophyIcon}
                    content="가방끈 Open Access"
                    subtitle="대학원생이 가장 많이 읽은 아티클 Top 5!"
                />
            </div>

            {/* 스크롤 가능한 아티클 리스트 */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex w-full gap-[28px] overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {articleList && articleList.length === 0 ? (
                        <div className="flex h-[286px] w-full items-center justify-center text-gray-500 text-semibold-18">
                            아직 작성된 아티클이 없습니다
                        </div>
                    ) : (
                        articleList?.map((article, idx) => (
                            <div className='flex gap-3'>
                                <div key={article.uuid} className="flex flex-col gap-[12px]">
                                    {/* 카드 */}
                                    <div className="relative w-[176px] h-[120px] rounded-[24px] overflow-hidden cursor-pointer"
                                        onClick={() => router.push(`/grad-onboarding/detail/${article.uuid}`)}>
                                        <button
                                            onClick={event => {
                                                event.stopPropagation()
                                                handleBookmark(event, article.isBookmarkedByMe, article.uuid)
                                            }
                                            }
                                            className="absolute top-0 right-0 z-20 px-2 py-3"
                                        >
                                            <BookmarkIcon width={24} height={24} className={article.isBookmarkedByMe ? 'text-yellow' : 'text-gray-40'} />
                                        </button>
                                        <Image
                                            src={article.imageUrlMO as string}
                                            fill
                                            alt="썸네일 이미지"
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* 아티클 정보 */}
                                    <div className='flex flex-col gap-[2px] w-[176px]'>
                                        <div className='flex gap-1 truncate'>{article.tags?.map((tag) =>
                                            <span className='text-reg-12 text-gray-70'>{'#' + tag.name}</span>
                                        )}
                                        </div>
                                        <div className='text-bold-16 text-black truncate min-w-0'>{article.title}</div>
                                        <div className='text-gray-70 text-med-14 truncate min-w-0'>{article.smallTitle}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {AuthModalComponent}
        </div >
    );
};

export default observer(GradOpenArticleMobile);
