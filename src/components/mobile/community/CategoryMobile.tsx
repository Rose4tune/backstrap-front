import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import MoneyIcon from '@assets/icons/community/money.svg';
import NewIcon from '@assets/icons/community/new.svg';
import SchoolIcon from '@assets/icons/community/school.svg';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import NoticeIcon from '@assets/icons/community/notice.svg';
import BagIcon from '@assets/icons/community/bag.svg';
import MedalIcon from '@assets/icons/community/medal.svg';
import StudyIcon from '@assets/icons/community/study.svg';
import InfoIcon from '@assets/icons/community/info.svg';
import AirplaneIcon from '@assets/icons/community/airplane.svg';
import Link from 'next/link';

interface CategoryPostProps {
  title: string;
  content: string;
  uuid: string;
  author?: {
    nickname?: string;
    school?: {
      name?: string;
    };
    isAnonymous?: boolean;
  };
  createdAt?: string;
  likeCount?: number;
  commentCount?: number;
  hasNewBoard?: boolean;
  isHot?: boolean;
  onClick?: () => void;
}

interface CategoryProps {
  uuid?: string;
  initialCount?: number;
  searchKeyword?: string;
  sortType?: "LIKE" | "POPULAR" | "RECENT" | "MONTHLY_POPULAR" | "MONTHLY_COMMENT_POPULAR" | "MONTHLY_IF_POPULAR" | "MONTHLY_VOTE_POPULAR" | "COMMENT";
}

function CategoryPost({
  title,
  content,
  author,
  createdAt,
  likeCount = 0,
  commentCount = 0,
  hasNewBoard = false,
  isHot = false,
  onClick
}: CategoryPostProps) {

  // Format timestamp: today = HH:MM, other days = MM.DD
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const today = new Date();

      // Check if it's today
      const isToday = date.toDateString() === today.toDateString();

      if (isToday) {
        // Show time if today
        return date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } else {
        // Show date if not today (MM.DD format)
        return date.toLocaleDateString('ko-KR', {
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '.').slice(0, -1); // Remove trailing dot
      }
    } catch {
      return '';
    }
  };

  return (
    <div
      className="flex flex-col justify-center relative w-full border-b border-gray-30 cursor-pointer hover:bg-gray-20 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2 px-5 py-4">
        {/* Title with badges */}
        <div className="flex flex-row gap-1 items-center">
          <span className="text-semibold-14 text-gray-90 line-clamp-1">
            {title}
          </span>

          {/* NEW badge */}
          {hasNewBoard && (
            <div className="w-3 h-3 flex-shrink-0">
              <NewIcon className="w-full h-full" />
            </div>
          )}

          {/* HOT badge */}
          {isHot && (
            <div className="bg-normal text-white text-[8px] font-black leading-[12px] px-0.5 py-1 rounded-sm h-3 flex items-center justify-center flex-shrink-0">
              HOT
            </div>
          )}
        </div>

        {/* Content preview */}
        <div className="text-reg-12 text-gray-60 line-clamp-1">
          {content || '내용 미리보기가 가능합니다'}
        </div>

        {/* Bottom section */}
        <div className="flex flex-row items-center justify-between w-full">
          {/* Author info */}
          <div className="flex flex-row gap-[3px] items-center">
            <span className="text-semibold-12 text-gray-70">
              {author?.isAnonymous !== false ? '익명의 끈' : (author?.nickname || '익명의 끈')}
            </span>

            {/* School info */}
            {author?.school?.name && (
              <div className="flex flex-row gap-1 items-center">
                <div className="flex w-4 h-4 flex-shrink-0">
                  <SchoolIcon className="w-full h-full text-gray-70" />
                </div>
                <span className="text-semibold-12 text-gray-70">
                  {author.school.name}
                </span>
              </div>
            )}

            <span className="text-med-12 text-gray-50">•</span>
            <span className="text-med-12 text-gray-50">
              {formatTime(createdAt) || '11.32'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-x-2 items-center">
            {/* Like count */}
            <div className="flex flex-row gap-x-1 items-center">
              <div className="flex w-4 h-4 flex-shrink-0">
                <FavoriteIcon className="w-4 h-4 text-red" />
              </div>
              <span className="text-semibold-12 text-gray-70">
                {likeCount}
              </span>
            </div>

            {/* Comment count */}
            <div className="flex flex-row gap-1 items-center">
              <div className="flex w-4 h-4 flex-shrink-0">
                <CommentIcon className="w-full h-full text-gray-70" />
              </div>
              <span className="text-semibold-12 text-gray-70">
                {commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Category = components['schemas']['FAGroupViewDto'];

export function CategoryMobile({ uuid, initialCount = 10, searchKeyword, sortType='RECENT' }: CategoryProps) {
  const [posts, setPosts] = useState<CategoryPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Transform board data to CategoryPostProps
  const transformBoardData = useCallback((board: components['schemas']['BoardEntityView']): CategoryPostProps => {
    let contentText = '';
    try {
      const parsed = JSON.parse(board.content || '[]');
      if (Array.isArray(parsed)) {
        const allText = parsed
          .map(item => {
            if (item && item.insert && typeof item.insert === 'string') {
              return item.insert;
            }
            return '';
          })
          .filter(text => text.length > 0)
          .join(' ');
        contentText = allText.replace(/\n/g, ' ').trim();
      }
    } catch (error) {
      console.error('Failed to parse board content:', error);
    }

    return {
      title: board.title || '',
      content: contentText,
      uuid: board.uuid || '',
      author: {
        nickname: board.user?.name,
        school: board.user?.school ? {
          name: board.user.school.name
        } : undefined,
        isAnonymous: board.isAnonymous
      },
      createdAt: board.createdDate,
      likeCount: board.likeCount || 0,
      commentCount: board.reviewCount || 0,
      // hasNewBoard: board.hasNewBoard || false,
      // isHot: (board.likeCount || 0) > 10,
      onClick: () => {
        router.push(`/community/post/${board.uuid}?source=category`);
      }
    };
  }, [router]);

  // Fetch posts with pagination
  const fetchPosts = useCallback(async (isLoadMore = false) => {
    // Prevent duplicate requests or loading when no more data
    if (loading || (isLoadMore && !hasMore)) return;

    setLoading(true);
    if (!isLoadMore) {
      setError(null);
    }

    try {
      const pageToLoad = isLoadMore ? currentPage + 1 : 0;

      const response = await getBoardsByPaging({
        count: initialCount,
        page: pageToLoad,
        sortType,
        groupUuid: uuid,
        searchKeyword,
        entityStatus: 'ACTIVE',
      });

      if (response.success && response.data) {
        const newPosts = response.data.data?.map(transformBoardData) || [];

        if (isLoadMore) {
          setPosts(prev => [...prev, ...newPosts]);
          setCurrentPage(pageToLoad);
        } else {
          setPosts(newPosts);
          setCurrentPage(1);
        }

        // If no new posts returned, set hasMore to false
        if (newPosts.length === 0) {
          setHasMore(false);
        }

        console.log(`Loaded ${newPosts.length} posts, page: ${pageToLoad}, hasMore: ${newPosts.length > 0}`);
      } else {
        setError(response.messages || '게시글 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to fetch category posts:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [uuid, initialCount, currentPage, transformBoardData, loading, hasMore]);

  // Load more posts
  const loadMore = useCallback(() => {
    console.log('loadMore called', { loading, hasMore });
    if (loading || !hasMore) {
      console.log('loadMore blocked:', { loading, hasMore });
      return;
    }
    console.log('Calling fetchPosts(true)...');
    fetchPosts(true);
  }, [fetchPosts, loading, hasMore]);

  // Initialize intersection observer for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only trigger if element is intersecting and we're not already loading
        if (entry.isIntersecting && !loading && hasMore) {
          console.log('Intersection detected, loading more posts...');
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '50px', // Trigger when 50px away from element
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

  // Initial load when uuid changes
  useEffect(() => {
    const loadInitialPosts = async () => {
      // Reset state for new category
      setPosts([]);
      setCurrentPage(1);
      setError(null);
      setHasMore(true);
      setLoading(true);

      try {
        const response = await getBoardsByPaging({
          count: initialCount,
          page: 0, // Always start from page 0 for initial load
          sortType,
          groupUuid: uuid,
          searchKeyword,
          entityStatus: 'ACTIVE',
        });

        if (response.success && response.data) {
          const newPosts = response.data.data?.map(transformBoardData) || [];
          setPosts(newPosts);

          // If no posts returned, set hasMore to false
          if (newPosts.length === 0) {
            setHasMore(false);
          }

          console.log(`Initial load: ${newPosts.length} posts, page: 0, hasMore: ${newPosts.length > 0}`);
        } else {
          setError(response.messages || '게시글 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch initial posts:', error);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [uuid, initialCount, transformBoardData]);

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
      {/* Content */}
      <div className="flex flex-col">
        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-8 px-5">
            <div className="text-med-14 text-red mb-2">오류가 발생했습니다</div>
            <div className="text-reg-12 text-gray-60 text-center mb-4">{error}</div>
            <button
              onClick={() => fetchPosts(false)}
              className="px-4 py-2 bg-normal text-white rounded-lg text-med-14 hover:bg-hover transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Initial Loading State */}
        {loading && posts.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-normal border-t-transparent rounded-full animate-spin mb-2"></div>
              <div className="text-med-14 text-gray-60">로딩 중...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-med-14 text-gray-60">게시글이 없습니다.</div>
          </div>
        )}

        {/* Posts */}
        {posts.map((post, index) => (
          <CategoryPost key={`${post.uuid}-${index}`} {...post} />
        ))}

        {/* Load More Trigger & Loading */}
        {hasMore && !error && posts.length > 0 && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-6"
          >
            {loading && posts.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-normal border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-reg-12 text-gray-60">더 많은 게시글을 불러오는 중...</div>
              </div>
            ) : (
              <div className="text-reg-12 text-gray-50">스크롤하여 더 보기</div>
            )}
          </div>
        )}

        {/* End of List */}
        {!hasMore && posts.length > 0 && !error && (
          <div className="flex items-center justify-center py-6 border-t border-gray-30">
            <div className="text-reg-12 text-gray-50">모든 게시글을 확인했습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export const CATEGORY_LIST = [
  {
    name:'자유게시끈',
    code:'FREE',
    uuid:''
  },
  {
    name:'홍보게시끈',
    code:'AD',
    uuid:''
  },
  {
    name:'장학금게시끈',
    code:'',
    uuid:'',
    icon:<MoneyIcon/>
  },
  {
    name:'비밀게시끈',
    code:'SECRET',
    uuid:''
  },
  {
    name:'고민상담게시끈',
    code:'',
    uuid:''
  },
  {
    name:'연애결혼게시끈',
    code:'',
    uuid:''
  },
  {
    name:'우리연구실모집끈',
    code:'LAB',
    uuid:'',
    icon:<NoticeIcon/>
  },
  {
    name:'취업게시끈',
    code:'',
    uuid:'',
    icon:<BagIcon/>
  },
  {
    name:'유학게시끈',
    code:'',
    uuid:'',
    icon:<AirplaneIcon/>
  },
  {
    name:'정보게시끈',
    code:'',
    uuid:'',
    icon:<InfoIcon/>
  },
  {
    name:'합격수기게시끈',
    code:'',
    uuid:'',
    icon:<MedalIcon/>
  },
]