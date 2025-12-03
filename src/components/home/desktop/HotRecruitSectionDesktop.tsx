import FireIcon from 'src/assets/icons/common/FireIcon.svg';
import { useRouter } from 'next/router';
import SectionHeaderDesktop from './SectionHeaderDesktop';
import { components } from 'src/types/api';
import Image from 'next/image';
import { getDDay } from 'src/utils/getDDay';
import { useState, useRef, useEffect } from 'react';

type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];

export default function HotRecruitSectionDesktop({ hotRecruitList }: { hotRecruitList?: RecruitmentViewDto[] | null }) {

  const router = useRouter();

  // Scroll state management
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
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
  }, [hotRecruitList]);

  return (
    <div className="flex flex-col w-full space-y-5">
      <SectionHeaderDesktop
        icon={FireIcon}
        content={'지금 핫한 채용 소식'}
        onClick={() => router.push('/careers')}
        navigateText="전체보기"
      />

      {/* Scroll container with navigation arrows */}
      <div className='relative'>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='이전 핫한 채용소식 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='다음 핫한 채용소식 보기'
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex w-full gap-4 overflow-x-scroll scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
        {hotRecruitList?.map(item => {
          return (
            <div
              key={item.uuid}
              className="flex flex-col cursor-pointer flex-shrink-0"
              onClick={() => router.push(`/careers/${item.uuid}`)}
            >
              {/* 썸네일 + D-day */}
              <div className="w-[308px] h-[200px] rounded-[16px] overflow-hidden relative">
                {item.thumbnailUrl && (
                  <Image
                    src={item.thumbnailUrl}
                    alt="recruitment thumbnail"
                    width={308}
                    height={200}
                    className="object-cover w-[308px] h-[200px]"
                  />
                )}
                <div className="absolute top-[12px] left-[12px] bg-white text-gray-90 text-bold-12 px-[8px] py-[2px] rounded-[4px]">
                  {getDDay(item.recruitmentDeadlineDate)}
                </div>
              </div>
              {/* 텍스트 영역 */}
              <div className="w-[308px] px-[4px] mt-[12px]">
                <p className="text-gray-60 text-med-12">
                  {item.recruitmentCompany?.companyName}
                </p>
                <p className="text-gray-90 text-bold-16 truncate">{item.title}</p>
                <div className="flex flex-wrap gap-[4px] mt-[8px] items-center">
                  {item.educations?.map(edu => (
                    <span
                      key={edu}
                      className="bg-bagstrap-10 text-bold-12 px-[6px] py-[4px] rounded-[4px] items-center flex text-click"
                    >
                      {edu}
                    </span>
                  ))}
                  {item.jobs?.map((job, idx) => (
                    <span key={job} className="text-gray-70 text-med-12">
                      {job}
                      {idx < (item.jobs || []).length - 1 && (
                        <span className="mx-[4px] text-gray-70">|</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
