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

type ArticleViewDto = components['schemas']['ArticleViewDto']

const GradOpenArticleDesktop = ({ openArticleList }: { openArticleList: ArticleViewDto[] | null }) => {

    const router = useRouter();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessToken();

    const [articleList, setArticleList] = useState<ArticleViewDto[]>(openArticleList || []);

    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };
    
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
    };
    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        updateScrollButtons();
        scrollContainer.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            scrollContainer.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [articleList]);

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
        <div className="flex flex-col w-full space-y-6">
            <div className="flex flex-col w-full mt-7">
                <SectionHeaderDesktop
                    icon={TrophyIcon}
                    content="가방끈 Open Access"
                    subtitle="대학원생이 가장 많이 읽은 아티클 Top 5!"
                />
            </div>

            {/* 스크롤 가능한 아티클 리스트 */}
            <div className="relative">
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-[38px] 4xl:left-[44px] top-[52px]  z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                        aria-label="이전 멘토리스트 보기"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-[0px] top-[52px] 3xl:right-[20px] 4xl:right-[100px]   z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                        aria-label="다음 멘토리스트 보기"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                <div
    ref={scrollRef}
    className="flex gap-[30px] overflow-x-auto scrollbar-hide max-w-[710px] 2xl:max-w-[880px] std1:max-w-[1100px] 4xl:max-w-[1190px]"
    style={{ scrollbarWidth: 'none' }}
  >
    {articleList && articleList.length === 0 ? (
      <div className="flex flex-1 h-[286px] w-full justify-start text-gray-500 text-semibold-18">
        아직 작성된 아티클이 없습니다
      </div>
    ) : (
      articleList?.map((article, idx) => (
        <div key={article.uuid} className="flex gap-3 flex-shrink-0">
          <span className="text-gray-90 text-[32px] font-bold">
            {(idx + 1).toString().padStart(2, "0")}
          </span>

          <div className="flex flex-col gap-[12px]">
            {/* 카드 */}
            <div
              className="relative w-[220px] h-[140px] rounded-[16px] overflow-hidden cursor-pointer"
              onClick={() =>
                router.push(`/grad-onboarding/detail/${article.uuid}`)
              }
            >
              <button
                onClick={(event) =>
                  handleBookmark(event, article.isBookmarkedByMe, article.uuid)
                }
                className="absolute top-0 right-0 z-20 p-4"
              >
                <BookmarkIcon
                  width={32}
                  height={32}
                  className={
                    article.isBookmarkedByMe ? "text-yellow" : "text-gray-40"
                  }
                />
              </button>
              <Image
                src={article.imageUrlMO as string}
                fill
                alt="썸네일 이미지"
                className="object-cover"
              />
            </div>

            {/* 아티클 정보 */}
            <div className="flex flex-col gap-[2px] w-[220px]">
              <div className="flex gap-1 truncate">
                {article.tags?.map((tag) => (
                  <span
                    key={tag.uuid}
                    className="text-reg-14 text-gray-70"
                  >
                    {'#' + tag.name}
                  </span>
                ))}
              </div>
              <div className="text-bold-20 text-black truncate min-w-0">
                {article.title}
              </div>
              <div className="text-gray-70 text-med-16 truncate min-w-0">
                {article.smallTitle}
              </div>
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

export default observer(GradOpenArticleDesktop);
