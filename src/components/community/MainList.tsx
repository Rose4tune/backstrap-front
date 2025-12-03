import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import Link from 'next/link';
import SchoolIcon from '@assets/icons/community/school.svg';
import ChevronIcon from '@assets/icons/community/chevron-left.svg';

// Types
type BoardEntityView = components['schemas']['BoardEntityView'];

interface MainListItem {
  uuid: string;
  number: number;
  category: string;
  title: string;
  author: string;
  createdDate: string;
  likeCount: number;
  reviewCount: number;
  school?: string;
}

interface MainListProps {
  categoryUuid?: string;
  sortType?: "LIKE" | "MONTHLY_COMMENT_POPULAR" | "MONTHLY_IF_POPULAR" | "MONTHLY_POPULAR" | "MONTHLY_VOTE_POPULAR" | "POPULAR" | "RECENT" | "COMMENT";
  pageSize?: number;
  title?: string;
  showWriteButton?: boolean;
  keyword?: string;
  onFetch?: any;
  showTitle?: boolean;
  initialPage?: number;
}

interface MainListHeaderProps {
  title: string;
  showWriteButton: boolean;
  sortType?: string;
  categoryUuid?: string
}

interface MainListRowProps {
  item: MainListItem;
  onClick: () => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// Pure helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}분 전`;
    }
    return `${hours}시간 전`;
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  }
};

const transformBoardsToItems = (
  boards: BoardEntityView[],
  currentPage: number,
  pageSize: number,
  totalCount: number
): MainListItem[] => {
  return boards.map((board, index) => {
    // Calculate item number (descending order from total)
    const itemNumber = totalCount - ((currentPage - 1) * pageSize) - index;

    return {
      uuid: board.uuid || '',
      number: itemNumber,
      category: board.category?.name || '일반',
      title: board.title || '',
      author: board.user?.name || '익명',
      createdDate: formatDate(board.createdDate),
      likeCount: board.likeCount || 0,
      reviewCount: board.reviewCount || 0,
      school: board.user?.school?.name
    };
  });
};

// Pure function to calculate visible pages for pagination
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

// Figma-based Pagination Component
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
        {/* <svg width="7" height="13" viewBox="0 0 7 13" fill="none">
          <path d="M6 1L1 6.5L6 12" stroke="#C9CED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> */}
        <ChevronIcon className='w-5 h-5 text-gray-50 rotate-180' />
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
            className={`text-[16px] leading-[20px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isActive
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
        {/* <svg width="8" height="14" viewBox="0 0 8 14" fill="none" transform="rotate(180)">
          <path d="M7 1L1 7L7 13" stroke="#C9CED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg> */}
        <ChevronIcon className='w-5 h-5 text-gray-50' />
      </button>
    </div>
  );
};

// Header Component
const MainListHeader: React.FC<MainListHeaderProps> = ({ title, showWriteButton, sortType, categoryUuid }) => {
  return (
    <div className="flex justify-between mb-4 pl-5">
      <div className='flex w-fit gap-2 items-center'>
        <div className="text-bold-20 text-gray-90">
          {title}
        </div>
        {/* sortType에 따른 추가 */}
        <div className="text-bold-20 text-gray-60">
          {sortType === "MONTHLY_IF_POPULAR" ? "IF 높은 끈" : sortType === "RECENT" ? "최신순" : sortType === "MONTHLY_COMMENT_POPULAR" ? "댓글순" : sortType === "MONTHLY_VOTE_POPULAR" ? "핫한 투표" : ""}
        </div>
      </div>
      {showWriteButton && (
        <Link
          href={`/community/edit${categoryUuid ? `?categoryUuid=${categoryUuid}` : ''}`}
          className="px-4 py-2 bg-gray-30 text-gray-90 text-semibold-14 rounded-lg hover:bg-hover hover:text-white transition-colors"
        >
          글쓰기
        </Link>
      )}
    </div>
  );
};

// Table Row Component
const MainListRow: React.FC<MainListRowProps> = ({ item, onClick }) => {
  return (
    <tr
      className=" border-gray-40 hover:bg-gray-20 cursor-pointer transition-colors w-full"
      onClick={onClick}
    >
      <td className="px-4 py-2 text-med-14 text-gray-50 text-center whitespace-nowrap">
        {item.number}
      </td>
      <td className="px-4 py-2 text-med-14 text-gray-60 text-center whitespace-break-spaces">
        {item.category}
      </td>
      <td className="px-4 py-2 text-semibold-16 text-gray-90">
        <div className="truncate">
          {item.title}
        </div>
      </td>
      <td className="px-4 py-2 text-semibold-14 text-center whitespace-nowrap">
        <div className='flex flex-row h-full gap-x-1 text-gray-70 items-center'>
          {item.school ? (
            <>
              <SchoolIcon className='w-4 h-4' />
              <span>{item.school}</span>
              <span className='text-gray-50'>{item.author}</span>
            </>
          ) : (
            <div className='w-full flex justify-center'>
              <span className='text-gray-50'>{item.author}</span>
            </div>
          )
          }
        </div>
      </td>
      <td className="px-4 py-2 text-center whitespace-nowrap">
        <div className="flex flex-row gap-1 justify-center">
          <div className="flex items-center justify-center gap-1 flex-shrink-0">
            <FavoriteIcon className="w-4 h-4 text-red" />
            <span className="text-semibold-12 text-gray-70">{item.likeCount}</span>
          </div>
          <div className="flex items-center justify-center gap-1 flex-shrink-0">
            <CommentIcon className="w-4 h-4 text-gray-60" />
            <span className="text-semibold-12 text-gray-70">{item.reviewCount}</span>
          </div>
        </div>
      </td>
    </tr>
  );
};

// Main Component
const MainList: React.FC<MainListProps> = ({
  categoryUuid,
  sortType = 'RECENT',
  pageSize = 20,
  title = '따끈따끈 막 나온 끈',
  showWriteButton = true,
  keyword,
  onFetch,
  showTitle = true,
  initialPage = 1,
}) => {
  const router = useRouter();

  // Simple state management
  const [items, setItems] = useState<MainListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Clean fetch function
  const fetchBoards = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBoardsByPaging({
        page: page,
        count: pageSize,
        sortType,
        groupUuid: categoryUuid,
        entityStatus: 'ACTIVE',
        searchKeyword: keyword,
      });

      if (response.success && response.data?.data) {
        const { data: boards, totalCount: total } = response.data;

        setTotalCount(total || 0);
        setItems(transformBoardsToItems(boards, page, pageSize, total || 0));
        setCurrentPage(page);
        onFetch?.(total);
      } else {
        throw new Error(response.messages || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch boards:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize, sortType, categoryUuid]);

  // Simple useEffect
  useEffect(() => {
    fetchBoards(currentPage);
  }, [currentPage, fetchBoards]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      router.replace(url);
    }
  };

  // Handle row click
  const handleRowClick = (item: MainListItem) => {
    router.push(`/community/post/${item.uuid}?source=${categoryUuid || 'community'}`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col py-4">
        {showTitle &&
          <MainListHeader
            title={title}
            sortType={sortType}
            showWriteButton={showWriteButton}
            categoryUuid={categoryUuid}
          />
        }

        {/* Table */}
        <div className="w-full overflow-x-auto bg-white">
          <table className="w-full table-fixed" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '64px' }} />
              <col style={{ width: '96px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '200px' }} />
              <col style={{ width: '120px' }} />
            </colgroup>
            <thead className='w-full border-b border-gray-30'>
              <tr>
                <th className="px-4 py-3 text-semibold-14 text-gray-70 text-center whitespace-nowrap">번호</th>
                <th className="px-4 py-3 text-semibold-14 text-gray-70 text-center whitespace-nowrap">게시판</th>
                <th className="px-4 py-3 text-semibold-14 text-gray-70 text-center">제목</th>
                <th className="px-4 py-3 text-semibold-14 text-gray-70 text-center whitespace-nowrap">끈쓴이</th>
                <th className="px-4 py-3 text-semibold-14 text-gray-70 text-center whitespace-nowrap">반응</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
                      <span className="text-med-14 text-gray-60">로딩 중...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-med-14 text-red">{error}</div>
                      <button
                        onClick={() => fetchBoards(currentPage)}
                        className="px-4 py-2 bg-gray-30 text-gray-90 text-semibold-14 rounded-lg hover:bg-hover hover:text-white transition-colors"
                      >
                        다시 시도
                      </button>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-med-14 text-gray-60">게시글이 없습니다.</div>
                      {showWriteButton && (
                        <Link
                          href={`/community/edit`}
                          className="px-4 py-2 bg-normal text-white text-semibold-14 rounded-lg hover:bg-hover transition-colors"
                        >
                          첫 번째 글 작성하기
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <MainListRow
                    key={item.uuid}
                    item={item}
                    onClick={() => handleRowClick(item)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MainList;