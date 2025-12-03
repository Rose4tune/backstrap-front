import React, { useEffect, useState, useRef } from 'react';
import getRecruitmentsByCursorNew from 'src/apis/recruitment-new/getRecruitmentsByCursorNew';
import bookmarkRecruitment from 'src/apis/recruitment-bookmark/bookmarkRecruitment';
import unbookmarkRecruitment from 'src/apis/recruitment-bookmark/unbookmarkRecruitment';
import { components } from 'src/types/api';
import { useStore } from '@stores/useStore.hook';
import ScrapIcon from '@assets/icons/community/scrap.svg';

type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];
type RecruitmentPaginationRequestDto = components['schemas']['RecruitmentPaginationRequestDto'];

interface RecruitmentGridProps {
  pageSize?: number;
  sortType?: 'RECENT' | 'POPULAR' | 'DEADLINE' | 'LIKEME';
  showTitle?: boolean;
  title?: string;
  maxRows?: number;
  keyword?: string;
}

interface RecruitmentCardProps {
  recruitment: RecruitmentViewDto;
  onClick: () => void;
  onBookmarkChange: (recruitmentUuid: string, isBookmarked: boolean) => void;
  accessToken?: string;
}

const RecruitmentCard: React.FC<RecruitmentCardProps> = ({ recruitment, onClick, onBookmarkChange, accessToken }) => {
  const [isBookmarked, setIsBookmarked] = useState(recruitment.isBookmarkedByMe || false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const calculateDDay = (deadlineDate?: string): string => {
    if (!deadlineDate) return '';

    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      if(diffDays > 999 ) return '상시채용'
      return `D-${diffDays}`;
    } else if (diffDays === 0) {
      return 'D-DAY';
    } else {
      return '마감';
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!recruitment.uuid || isBookmarkLoading) return;

    setIsBookmarkLoading(true);

    try {
      if (isBookmarked) {
        const response = await unbookmarkRecruitment(recruitment.uuid, accessToken);
        if (response.success) {
          setIsBookmarked(false);
          onBookmarkChange(recruitment.uuid, false);
        }
      } else {
        const response = await bookmarkRecruitment(recruitment.uuid, accessToken);
        if (response.success) {
          setIsBookmarked(true);
          onBookmarkChange(recruitment.uuid, true);
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const dDay = calculateDDay(recruitment.recruitmentDeadlineDate);

  return (
    <div
      className="flex flex-col gap-3 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-[200px] bg-gray-40 rounded-2xl overflow-hidden">
        {recruitment.thumbnailUrl ? (
          <img
            src={recruitment.thumbnailUrl}
            alt={recruitment.title || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white text-bold-16">
            <p className="mb-0">이미지가 없습니다</p>
          </div>
        )}

        {/* D-Day Badge */}
        {dDay && (
          <div className="absolute top-3 left-3 bg-gray-20 rounded-lg px-2 py-1">
            <span className="text-gray-90 text-semibold-16">{dDay}</span>
          </div>
        )}

        {/* Bookmark Icon */}
        <button
          onClick={handleBookmarkClick}
          disabled={isBookmarkLoading}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform duration-200 disabled:opacity-50"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <ScrapIcon
            className={`w-6 h-6 transition-colors duration-200 ${
              isBookmarked ? 'text-yellow' : 'text-gray-40 hover:text-gray-60'
            }`}
          />
        </button>
      </div>

      {/* Text Container */}
      <div className="flex flex-col gap-2 px-1">
        {/* Company & Title */}
        <div className="flex flex-col">
          <span className="text-gray-60 text-med-12">
            {recruitment.recruitmentCompany?.companyName || ''}
          </span>
          <h3 className="text-gray-90 text-bold-16 group-hover:text-normal transition-colors truncate">
            {recruitment.title || ''}
          </h3>
        </div>

        {/* Keywords */}
        <div className="flex items-center gap-1 w-full">
          {/* Education Level Badge */}
          {recruitment.educations && recruitment.educations.length > 0 && (
            <div className="bg-bagstrap-10 rounded px-1.5 py-1 flex-shrink-0">
              <span className="flex text-click text-bold-12 items-center">
                {recruitment.educations[0]}
              </span>
            </div>
          )}

          {/* Other fields */}
          <div className="text-gray-70 text-med-12 truncate">
            {recruitment.jobs?.join(' | ') || '컴퓨터공학 | 경제/경영 | 교육'}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitmentGrid: React.FC<RecruitmentGridProps> = ({
  pageSize = 8,
  sortType = 'RECENT',
  showTitle = true,
  title = '채용',
  maxRows = 1,
  keyword,
}) => {
  const { UserStore } = useStore();
  const accessToken = UserStore.accessToken;
  const [recruitments, setRecruitments] = useState<RecruitmentViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchRecruitments = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestData: RecruitmentPaginationRequestDto = {
        count: pageSize,
        keyword:keyword,
      };

      const response = await getRecruitmentsByCursorNew(requestData);

      if (response.success && response.data?.data) {
        const { data: recruitmentList, totalCount: total } = response.data;
        setRecruitments(recruitmentList || []);
        setTotalCount(total || 0);
      } else {
        throw new Error(response.messages || '채용 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch recruitments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, [pageSize, sortType]);

  useEffect(() => {
    updateScrollButtons();
  }, [recruitments]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);

      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [recruitments]);

  const handleRecruitmentClick = (recruitment: RecruitmentViewDto) => {
    if (recruitment.recruitmentAnnouncementLink) {
      window.open(recruitment.recruitmentAnnouncementLink, '_blank');
    }
  };

  const handleBookmarkChange = (recruitmentUuid: string, isBookmarked: boolean) => {
    setRecruitments(prevRecruitments =>
      prevRecruitments.map(recruitment =>
        recruitment.uuid === recruitmentUuid
          ? { ...recruitment, isBookmarkedByMe: isBookmarked }
          : recruitment
      )
    );
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth + gap; // 308 + 16 = 324px
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth + gap; // 308 + 16 = 324px
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        {showTitle && (
          <div className="flex items-end gap-2 mb-5">
            <h2 className="text-black text-bold-24 tracking-[-0.48px]">{title}</h2>
            <span className="text-gray-70 text-med-20">로딩 중...</span>
          </div>
        )}
        <div className="h-[300px] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
            <span className="text-med-14 text-gray-60">채용 정보 로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        {showTitle && (
          <div className="flex items-end gap-2 mb-5">
            <h2 className="text-black text-bold-24 tracking-[-0.48px]">{title}</h2>
            <span className="text-gray-70 text-med-20">오류</span>
          </div>
        )}
        <div className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-med-14 text-red">{error}</div>
            <button
              onClick={() => fetchRecruitments()}
              className="px-4 py-2 bg-gray-30 text-gray-90 text-semibold-14 rounded-lg hover:bg-hover hover:text-white transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (recruitments.length === 0) {
    return (
      <div className="w-full">
        {showTitle && (
          <div className="flex items-end gap-2 mb-5">
            <h2 className="text-black text-bold-24 tracking-[-0.48px]">{title}</h2>
            <span className="text-gray-70 text-med-20">0건</span>
          </div>
        )}
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-med-14 text-gray-60">등록된 채용 정보가 없습니다.</div>
        </div>
      </div>
    );
  }

  // Calculate card width (assuming 4 cards per view with gaps)
  const cardWidth = 308; // Based on Figma design
  const gap = 16; // 4 in Tailwind
  const cardsPerView = 4;

  return (
    <div className="w-full relative">
      {/* Title */}
      {showTitle && (
        <div className="flex items-end gap-2 mb-5">
          <h2 className="text-black text-bold-24 tracking-[-0.48px]">{title}</h2>
          <span className="text-gray-70 text-med-20">{totalCount}건</span>
        </div>
      )}

      {/* Cards Container */}
      <div className="relative">
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recruitments.map((recruitment) => (
            <div key={recruitment.uuid} className="flex-shrink-0 w-[308px]">
              <RecruitmentCard
                recruitment={recruitment}
                onClick={() => handleRecruitmentClick(recruitment)}
                onBookmarkChange={handleBookmarkChange}
                accessToken={accessToken}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {recruitments.length > cardsPerView && (
          <>
            {/* Left Arrow */}
            {canScrollLeft && (
              <div className="absolute left-0 top-20">
                <button
                  onClick={scrollLeft}
                  className="z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="이전 채용 정보 보기"
                >
                  <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                    <path
                      d="M8 1L1 8L8 15"
                      stroke="#464D57"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <div className="absolute right-0 top-20">
                <button
                  onClick={scrollRight}
                  className="z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="다음 채용 정보 보기"
                >
                  <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                    <path
                      d="M1 1L8 8L1 15"
                      stroke="#464D57"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Hide scrollbar with CSS */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RecruitmentGrid;