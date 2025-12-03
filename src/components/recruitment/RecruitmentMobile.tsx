import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import getRecruitmentsByCursorNew from 'src/apis/recruitment-new/getRecruitmentsByCursorNew';
import bookmarkRecruitment from 'src/apis/recruitment-bookmark/bookmarkRecruitment';
import unbookmarkRecruitment from 'src/apis/recruitment-bookmark/unbookmarkRecruitment';
import { components } from 'src/types/api';
import { useStore } from '@stores/useStore.hook';
import ScrapIcon from '@assets/icons/community/scrap.svg';

type RecruitmentViewDto = components['schemas']['RecruitmentViewDto'];
type RecruitmentPaginationRequestDto = components['schemas']['RecruitmentPaginationRequestDto'];

interface RecruitmentCardProps {
  recruitment: RecruitmentViewDto;
  onBookmarkChange: (recruitmentUuid: string, isBookmarked: boolean) => void;
  accessToken?: string;
}

interface RecruitmentMobileProps {
  searchKeyword?: string;
  initialCount?: number;
}

const RecruitmentCard: React.FC<RecruitmentCardProps> = ({ recruitment, onBookmarkChange, accessToken }) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(recruitment.isBookmarkedByMe || false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // recruitment 데이터가 변경될 때 북마크 상태 동기화
  useEffect(() => {
    setIsBookmarked(recruitment.isBookmarkedByMe || false);
  }, [recruitment.isBookmarkedByMe]);

  const calculateDDay = (deadlineDate?: string): string => {
    if (!deadlineDate) return '';

    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      if (diffDays > 999) return '상시채용';
      return `D-${diffDays}`;
    } else if (diffDays === 0) {
      return 'D-DAY';
    } else {
      return '마감';
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!recruitment.uuid || isBookmarkLoading) return;

    // 로그인 체크
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsBookmarkLoading(true);

    try {
      let response;
      if (isBookmarked) {
        response = await unbookmarkRecruitment(recruitment.uuid, accessToken);
        if (response.success) {
          setIsBookmarked(false);
          onBookmarkChange(recruitment.uuid, false);
          console.log('북마크 해제 성공');
        } else {
          console.error('북마크 해제 실패:', response.messages);
          alert(response.messages || '북마크 해제에 실패했습니다.');
        }
      } else {
        response = await bookmarkRecruitment(recruitment.uuid, accessToken);
        if (response.success) {
          setIsBookmarked(true);
          onBookmarkChange(recruitment.uuid, true);
          console.log('북마크 추가 성공');
        } else {
          console.error('북마크 추가 실패:', response.messages);
          alert(response.messages || '북마크 추가에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleRecruitmentClick = () => {
    if (recruitment.recruitmentAnnouncementLink) {
      window.open(recruitment.recruitmentAnnouncementLink, '_blank');
    }
  };

  const dDay = calculateDDay(recruitment.recruitmentDeadlineDate);

  return (
    <div
      className="flex flex-row gap-3 items-start justify-start p-5 relative w-full border-b border-gray-30 cursor-pointer hover:bg-gray-20 transition-colors"
      onClick={handleRecruitmentClick}
    >
      {/* Company Image */}
      <div className="bg-gray-90 rounded-xl shrink-0 size-16 flex items-center justify-center overflow-hidden">
        {recruitment.thumbnailUrl ? (
          <img
            src={recruitment.thumbnailUrl}
            alt={recruitment.title || ''}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-reg-12 text-center">
            이미지가 없습니다
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 items-start justify-start flex-1 min-w-0">
        {/* Company Name */}
        <div className="text-reg-12 text-gray-60 leading-4">
          {recruitment.recruitmentCompany?.companyName || '아웃스탠더스'}
        </div>

        {/* Title with D-Day */}
        <div className="flex flex-row gap-2 items-start justify-start w-full">
          {dDay && (
            <div className="text-bold-14 text-gray-60 flex-shrink-0">
              {dDay}
            </div>
          )}
          <div className="text-bold-14 text-gray-90 flex-1 min-w-0 truncate">
            {recruitment.title || ''}
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-row gap-1 items-center justify-start w-full">
          {/* Education Level Badge */}
          {recruitment.educations && recruitment.educations.length > 0 && (
            <div className="bg-bagstrap-10 flex flex-row gap-2.5 items-center justify-center p-1 rounded shrink-0">
              <div className="text-semibold-10 text-click leading-3">
                {recruitment.educations[0]}
              </div>
            </div>
          )}

          {/* Other fields */}
          <div className="text-med-12 text-gray-70 leading-4 truncate flex-1">
            <span>{recruitment.jobs?.join(' | ')}</span>
          </div>
        </div>
      </div>

      {/* Bookmark Icon */}
      <button
        onClick={handleBookmarkClick}
        disabled={isBookmarkLoading}
        className="absolute right-5 top-5 size-8 flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 rounded-full hover:bg-gray-20"
        aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      >
        {isBookmarkLoading ? (
          <div className="w-4 h-4 border-2 border-gray-40 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <ScrapIcon
            className={`w-6 h-6 transition-colors duration-200 ${
              isBookmarked ? 'text-yellow' : 'text-gray-40 hover:text-gray-60'
            }`}
          />
        )}
      </button>
    </div>
  );
};

function RecruitmentMobile({ searchKeyword, initialCount = 10 }: RecruitmentMobileProps) {
  const { UserStore } = useStore();
  
  // UserStore 초기화
  useEffect(() => {
    if (UserStore.isEmpty() && UserStore.loadingState === 'idle') {
      UserStore.fetchUser();
    }
  }, [UserStore]);
  
  const accessToken = UserStore.accessToken;

  const [recruitments, setRecruitments] = useState<RecruitmentViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Handle bookmark changes
  const handleBookmarkChange = useCallback((recruitmentUuid: string, isBookmarked: boolean) => {
    setRecruitments(prevRecruitments =>
      prevRecruitments.map(recruitment =>
        recruitment.uuid === recruitmentUuid
          ? { ...recruitment, isBookmarkedByMe: isBookmarked }
          : recruitment
      )
    );
  }, []);

  // Fetch recruitments with cursor-based pagination
  const fetchRecruitments = useCallback(async (isLoadMore = false) => {
    if (loading || (isLoadMore && !hasMore)) return;

    setLoading(true);
    if (!isLoadMore) {
      setError(null);
    }

    try {
      const requestData: RecruitmentPaginationRequestDto = {
        count: initialCount,
        keyword: searchKeyword,
        cursor: isLoadMore ? cursor : undefined,
      };

      const response = await getRecruitmentsByCursorNew(requestData);

      if (response.success && response.data?.data) {
        const { data: recruitmentList, cursor: newCursor } = response.data;

        if (isLoadMore) {
          setRecruitments(prev => [...prev, ...recruitmentList]);
        } else {
          setRecruitments(recruitmentList);
        }

        // Update cursor and hasMore status
        setCursor(newCursor);
        setHasMore(!!newCursor && recruitmentList.length > 0);

        console.log(`Loaded ${recruitmentList.length} recruitments, cursor: ${newCursor}, hasMore: ${!!newCursor}`);
      } else {
        setError(response.messages || '채용정보 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch recruitments:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [initialCount, searchKeyword, cursor, loading, hasMore]);

  // Load more recruitments
  const loadMore = useCallback(() => {
    console.log('loadMore called', { loading, hasMore });
    if (loading || !hasMore) {
      console.log('loadMore blocked:', { loading, hasMore });
      return;
    }
    console.log('Calling fetchRecruitments(true)...');
    fetchRecruitments(true);
  }, [fetchRecruitments, loading, hasMore]);

  // Initialize intersection observer for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          console.log('Intersection detected, loading more recruitments...');
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0
      }
    );

    observer.observe(loadMoreElement);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [loading, loadMore, hasMore]);

  // Initial load when searchKeyword changes
  useEffect(() => {
    const loadInitialRecruitments = async () => {
      setRecruitments([]);
      setCursor(undefined);
      setError(null);
      setHasMore(true);
      setLoading(true);

      try {
        const requestData: RecruitmentPaginationRequestDto = {
          count: initialCount,
          keyword: searchKeyword,
        };

        const response = await getRecruitmentsByCursorNew(requestData);

        if (response.success && response.data?.data) {
          const { data: recruitmentList, cursor: newCursor } = response.data;
          setRecruitments(recruitmentList);
          setCursor(newCursor);
          setHasMore(!!newCursor && recruitmentList.length > 0);

          console.log(`Initial load: ${recruitmentList.length} recruitments, cursor: ${newCursor}, hasMore: ${!!newCursor}`);
        } else {
          setError(response.messages || '채용정보 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch initial recruitments:', error);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialRecruitments();
  }, [searchKeyword, initialCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col">
        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-8 px-5">
            <div className="text-med-14 text-red mb-2">오류가 발생했습니다</div>
            <div className="text-reg-12 text-gray-60 text-center mb-4">{error}</div>
            <button
              onClick={() => fetchRecruitments(false)}
              className="px-4 py-2 bg-normal text-white rounded-lg text-med-14 hover:bg-hover transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Initial Loading State */}
        {loading && recruitments.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-normal border-t-transparent rounded-full animate-spin mb-2"></div>
              <div className="text-med-14 text-gray-60">로딩 중...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recruitments.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-med-14 text-gray-60">채용정보가 없습니다.</div>
          </div>
        )}

        {/* Recruitments */}
        {recruitments.map((recruitment, index) => (
          <RecruitmentCard
            key={`${recruitment.uuid}-${index}`}
            recruitment={recruitment}
            onBookmarkChange={handleBookmarkChange}
            accessToken={accessToken}
          />
        ))}

        {/* Load More Trigger & Loading */}
        {hasMore && !error && recruitments.length > 0 && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-6"
          >
            {loading && recruitments.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-normal border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-reg-12 text-gray-60">더 많은 채용정보를 불러오는 중...</div>
              </div>
            ) : (
              <div className="text-reg-12 text-gray-50">스크롤하여 더 보기</div>
            )}
          </div>
        )}

        {/* End of List */}
        {!hasMore && recruitments.length > 0 && !error && (
          <div className="flex items-center justify-center py-6 border-t border-gray-30">
            <div className="text-reg-12 text-gray-50">모든 채용정보를 확인했습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(RecruitmentMobile);