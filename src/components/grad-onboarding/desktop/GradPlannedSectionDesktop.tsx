import React, { useState, useRef, useEffect } from 'react';
import SectionHeaderDesktop from 'src/components/home/desktop/SectionHeaderDesktop';
import { components } from 'src/types/api';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import { useRouter } from 'next/router';
import NoticeIcon from 'src/assets/icons/home/NoticeIcon.svg'
import BellIcon from 'src/assets/icons/mentoring/[renewal]bellIcon.svg'
import registerArticleAlarm from '@api/article-alarm/registerArticleAlarm';

type ArticleViewDto = components['schemas']['ArticleViewDto']

const GradPlannedSectionDesktop = ({ plannedArticleList }: { plannedArticleList: ArticleViewDto[] | null }) => {

    const router = useRouter();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [AuthModalComponent, openAuthModal] = useAuthGuardModalDialog();
    const { UserStore } = useStore();
    const accessToken = UserStore.getAccessToken();

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
    }, [plannedArticleList]);

    // article alaram bookmark
    //TODO: userEmail 없을시 예외처리 필요 + 예약완료되었다는 interaction-popup 띄우기
    async function handleArticleAlarm(articleUuid?: string) {
        if (!accessToken) {
            openAuthModal();
            return;
        }
        if (articleUuid && plannedArticleList) {
            try {
                await registerArticleAlarm({ articleUuid: articleUuid as string }, accessToken)
            } catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col w-full">
                <SectionHeaderDesktop
                    icon={NoticeIcon}
                    content="발행 예정 컨텐츠"
                    subtitle="컨텐츠가 올라올 때 알림을 받아보세요!"
                />
            </div>

            {/* 스크롤 가능한 아티클 리스트 */}
            <div className="relative">
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                        aria-label="다음 멘토리스트 보기"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                <div
                    ref={scrollRef}
                    className="flex w-full gap-[32px] overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {plannedArticleList && plannedArticleList.length === 0 ? (
                        <div className="flex h-[174px] w-full items-center justify-center text-gray-500 text-semibold-18">
                            발행 예정인 컨텐츠가 없습니다
                        </div>
                    ) : (
                        plannedArticleList?.map(article => (
                            <div key={article.uuid} className="flex flex-col rounded-[16px] p-5 bg-gray-20 gap-[16px]">
                                {/* 아티클 정보 */}
                                <div className='flex flex-col gap-[2px] w-[300px]'>
                                    <div className='flex gap-1 truncate'>{article.tags?.map((tag) =>
                                        <span className='text-reg-14 text-gray-70'>{'#' + tag.name}</span>
                                    )}
                                    </div>
                                    <div className='text-bold-20 text-black truncate min-w-0'>{article.title}</div>
                                    <div className='text-gray-70 text-med-16 truncate min-w-0'>{article.smallTitle}</div>
                                </div>
                                {/* 알림 받아보기 */}
                                <button
                                    onClick={() =>
                                        handleArticleAlarm(article.uuid)
                                    }
                                    className="w-full items-center justify-center py-3 flex gap-2 bg-white rounded-[16px]"
                                >
                                    <BellIcon width={24} height={24} className='text-gray-90' />
                                    <span className='text-semibold-16 text-gray-90'>알림 받아보기</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {AuthModalComponent}
        </div>
    );
};

export default observer(GradPlannedSectionDesktop);
