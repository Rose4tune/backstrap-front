import React, { useState, useRef, useEffect } from 'react';
import BookIcon from "src/assets/icons/grad-onboarding/BookIcon.svg"
import SectionHeaderDesktop from 'src/components/home/desktop/SectionHeaderDesktop';
import { components } from 'src/types/api';
import { DesktopMentorCard } from 'src/components/mentoring/mentoringIndexPageComponents';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import { unBookmark } from '@api/mentor-book-mark/un-bookmark';
import { bookmark } from '@api/mentor-book-mark/bookmark';
import GradMentorCardDesktop from './GradMentorCardDesktop';
import { useRouter } from 'next/router';

type MentorViewDto = components['schemas']['MentorViewDto']
const GradMentorSectionDesktop = ({ mentorList }: { mentorList: MentorViewDto[] | null }) => {

    const router = useRouter();
    // Scroll state management
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
    const { UserStore } = useStore()
    const accessToken = UserStore.getAccessToken()
    const [activeMentorList, setActiveMentorList] = useState<MentorViewDto[]>(mentorList || [])

    // Update scroll button visibility
    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision
        }
    };

    // Handle scroll navigation
    const scrollLeft = () => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Initialize scroll state and add event listeners
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // Initial state
        updateScrollButtons();

        // Add scroll event listener
        scrollContainer.addEventListener('scroll', updateScrollButtons);

        // Add resize listener to handle window size changes
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            scrollContainer.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [mentorList]);

    // Todo: UseDebounce 적용하기
    // Bookmark/Unbookmark api 호출 함수
    async function handleBookmark(event: any, isBookMarked?: boolean, mentorUuid?: string) {
        event.stopPropagation();

        //로그인 상태 아니면 로그인부터 시키기
        if (!accessToken) {
            openAuthModal();
            return;
        }

        if (mentorUuid && accessToken && mentorList) {
            setActiveMentorList(prev =>
                prev?.map(m =>
                    m.uuid === mentorUuid ? { ...m, isBookmarkedByMe: !isBookMarked } : m
                )
            );
            try {
                if (isBookMarked) {
                    await unBookmark(mentorUuid, accessToken);
                } else {
                    await bookmark(mentorUuid, accessToken);
                }


            } catch (e) {
                setActiveMentorList(prev =>
                    prev?.map(m =>
                        m.uuid === mentorUuid ? { ...m, isBookmarkedByMe: !isBookMarked } : m
                    )
                );
            }
        }
    }

    return (
        <div className='flex flex-col w-full space-y-5'>
            <div className='flex flex-col w-full'>
                <SectionHeaderDesktop
                    icon={BookIcon}
                    content={'사수 없이도 살아남는 대학원생 되기!'}
                    navigateText='전체보기'
                    onClick={() => router.push('/mentoring')}
                    subtitle='실제 대학원생들이 알려주는 우당탕탕 생존기'
                />
            </div>
            {/* Scroll container with navigation arrows */}
            <div className='relative'>
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
                        aria-label='이전 멘토리스트 보기'
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={scrollRight}
                        className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
                        aria-label='다음 멘토리스트 보기'
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    className='flex w-full gap-4 overflow-x-scroll scrollbar-hide cursor-pointer'
                    style={{ scrollbarWidth: 'none' }}
                >
                    {activeMentorList?.map((mentor, idx) => {
                        return (
                            <div className='w-[424px] rounded-[16px] overflow-hidden relative flex-shrink-0'>
                                <GradMentorCardDesktop mentor={mentor} handleBookmark={handleBookmark} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {AuthModalComponent}
        </div>
    );
};

export default observer(GradMentorSectionDesktop)