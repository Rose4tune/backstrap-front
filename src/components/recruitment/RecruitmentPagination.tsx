import React, { useEffect, useState, useCallback } from 'react';
import { components } from 'src/types/api';
import getRecruitmentsByCursorNew from 'src/apis/recruitment-new/getRecruitmentsByCursorNew';
import bookmarkRecruitment from 'src/apis/recruitment-bookmark/bookmarkRecruitment';
import unbookmarkRecruitment from 'src/apis/recruitment-bookmark/unbookmarkRecruitment';
import { useStore } from '@stores/useStore.hook';
import ScrapIcon from '@assets/icons/community/scrap.svg';
import ChevronIcon from '@assets/icons/community/chevron-left.svg';

type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];
type RecruitmentPaginationRequestDto = components['schemas']['RecruitmentPaginationRequestDto'];

interface RecruitmentPaginationProps {
  pageSize?: number;
  sortType?: 'RECENT' | 'POPULAR' | 'DEADLINE' | 'LIKEME';
  showTitle?: boolean;
  title?: string;
  keyword?: string;
}

interface RecruitmentCardProps {
  recruitment: RecruitmentViewDto;
  onClick: () => void;
  onBookmarkChange: (recruitmentUuid: string, isBookmarked: boolean) => void;
  accessToken?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// Pure function to calculate visible pages for pagination (from MainList.tsx)
const calculateVisiblePages = (currentPage: number, totalPages: number): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

// Pagination Component (from MainList.tsx)
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false
}) => {
  if (totalPages <= 1) return null;

  const visiblePages = calculateVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-5 py-3 mt-6">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="w-5 h-5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        aria-label="이전 페이지"
      >
        <ChevronIcon className='w-5 h-5 text-gray-50 rotate-180'/>
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="text-[16px] leading-[22px] font-medium text-[#C9CED8] tracking-[0.0912px]"
            >
              ...
            </span>
          );
        }

        const isActive = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            disabled={loading}
            className={`text-[16px] leading-[20px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? 'text-[#464D57]'
                : 'text-[#C9CED8] hover:text-[#464D57] font-medium leading-[22px] tracking-[0.0912px]'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="w-5 h-5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        aria-label="다음 페이지"
      >
        <ChevronIcon className='w-5 h-5 text-gray-50'/>
      </button>
    </div>
  );
};

// Recruitment Card Component (from RecruitmentGrid.tsx)
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

// Main Component
const RecruitmentPagination: React.FC<RecruitmentPaginationProps> = ({
  pageSize = 9, // 3x3 grid
  sortType = 'RECENT',
  showTitle = true,
  title = '채용 공고',
  keyword,
}) => {
  const { UserStore } = useStore();
  const accessToken = UserStore.accessToken;

  const [recruitments, setRecruitments] = useState<RecruitmentViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch recruitments
  const fetchRecruitments = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const requestData: RecruitmentPaginationRequestDto = {
        count: pageSize,
        page: page-1,
        keyword: keyword,
      };

      const response = await getRecruitmentsByCursorNew(requestData);

      if (response.success && response.data?.data) {
        const { data: recruitmentList, totalCount: total } = response.data;
        setRecruitments(recruitmentList || []);
        setTotalCount(total || 0);
        setCurrentPage(page);
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
  }, [pageSize, sortType, keyword]);

  useEffect(() => {
    fetchRecruitments(currentPage);
  }, [currentPage, fetchRecruitments]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  // Handle recruitment click
  const handleRecruitmentClick = (recruitment: RecruitmentViewDto) => {
    if (recruitment.recruitmentAnnouncementLink) {
      window.open(recruitment.recruitmentAnnouncementLink, '_blank');
    }
  };

  // Handle bookmark change
  const handleBookmarkChange = (recruitmentUuid: string, isBookmarked: boolean) => {
    setRecruitments(prevRecruitments =>
      prevRecruitments.map(recruitment =>
        recruitment.uuid === recruitmentUuid
          ? { ...recruitment, isBookmarkedByMe: isBookmarked }
          : recruitment
      )
    );
  };

  return (
    <div className="w-full">
      {/* Title */}
      {showTitle && (
        <div className="flex items-end gap-2 mb-5">
          <h2 className="text-black text-bold-24 tracking-[-0.48px]">{title}</h2>
          <span className="text-gray-70 text-med-20">{totalCount}건</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="h-[600px] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
            <span className="text-med-14 text-gray-60">채용 정보 로딩 중...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-med-14 text-red">{error}</div>
            <button
              onClick={() => fetchRecruitments(currentPage)}
              className="px-4 py-2 bg-gray-30 text-gray-90 text-semibold-14 rounded-lg hover:bg-hover hover:text-white transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recruitments.length === 0 && (
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-med-14 text-gray-60">등록된 채용 정보가 없습니다.</div>
        </div>
      )}

      {/* Cards Grid - 3x3 Layout */}
      {!loading && !error && recruitments.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {recruitments.map((recruitment) => (
              <RecruitmentCard
                key={recruitment.uuid}
                recruitment={recruitment}
                onClick={() => handleRecruitmentClick(recruitment)}
                onBookmarkChange={handleBookmarkChange}
                accessToken={accessToken}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default RecruitmentPagination;