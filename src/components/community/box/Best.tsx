import React, { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import CommunityIcon from '@assets/icons/community/best.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import LikeIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import Link from 'next/link';
import FavoriteIcon from '@assets/icons/community/favorite.svg';

interface BestPostProps {
  rank: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  uuid: string;
  sortType: 'monthly' | 'comment' | 'if' | 'vote';
  hasImage?: boolean;
  onClick?: () => void;
}
function PostItem({ title, content, hasImage, onClick, likeCount, commentCount, rank , sortType}:BestPostProps) {
  return (
    <div
      className="flex w-full flex-col gap-1 cursor-pointer hover:bg-gray-20 rounded-sm transition-colors"
      onClick={onClick}
    >
        <div className="flex justify-between items-center gap-2 flex-row">
          <div className="flex items-center gap-x-[8px] min-w-0 overflow-hidden">
            <div className="w-[23px] h-[28px] flex items-center justify-center text-bold-16 m:text-bold-20 text-gray-90 flex-shrink-0">
              {rank}
            </div>
            <div className="flex flex-row gap-2 min-w-0 overflow-hidden text-left">
              <div className={`flex items-center gap-1 m:min-w-0 text-semibold-14 m:text-semibold-16 text-gray-90 leading-[24px] flex-shrink-0 }`}>
                {hasImage && (
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-4 h-4 text-gray-50" />
                  </div>
                )}
                <span className="m:truncate m:min-w-0">{title}</span>
              </div>
              <div className='flex items-center min-w-0'>
                <div className="truncate flex-grow min-w-0 text-med-12 m:text-semibold-14 text-gray-60">
                  {content}
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-shrink-0 flex-row items-center gap-x-1'>
            {
                ((likeCount!==undefined)&&(sortType!=='comment')) && (
                    <div className='flex flex-row gap-x-1 items-center'>
                    <FavoriteIcon className='w-4 h-4 text-red'/>
                    <div className='text-semibold-12 text-gray-70'>
                        {likeCount}
                    </div>
                    </div>
                )
            }
            {
                (commentCount!==undefined) && (
                    <div className='flex flex-row gap-x-1 items-center'>
                    <CommentIcon className='w-4 h-4 text-gray-60'/>
                    <div className='text-semibold-12 text-gray-70'>
                        {commentCount}
                    </div>
                    </div>
                )
            }
          </div>
        </div>
      <div className='flex justify-between items-center'>

      </div>
    </div>
  );
}
function BestPost({ rank, title, content, likeCount, commentCount, sortType, hasImage, onClick }: BestPostProps) {

  const getIcon = () => {
    switch (sortType) {
      case 'monthly':
      case 'if':
      case 'vote':
        return <LikeIcon className="w-full h-full text-red" />;
      case 'comment':
        return <CommentIcon className="w-full h-full text-gray-60" />;
      default:
        return <LikeIcon className="w-full h-full text-red" />;
    }
  };

  const getCount = () => {
    switch (sortType) {
      case 'comment':
        return commentCount;
      case 'monthly':
      case 'if':
      case 'vote':
      default:
        return likeCount;
    }
  };

  return (
    <div
      className="flex max-w-full min-w-0 items-center justify-between gap-x-[8px] cursor-pointer hover:bg-gray-20 rounded-sm transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-[8px] min-w-0 overflow-hidden">
        <div className="w-[23px] h-[28px] flex items-center justify-center text-bold-20 text-gray-90 flex-shrink-0">
          {rank}
        </div>
        <div className="flex flex-row gap-1 min-w-0 overflow-hidden text-left">
          <div className="flex flex-shrink-0 items-center gap-1 truncate text-semibold-14 m:text-semibold-16 text-gray-90 leading-[24px]">
            {hasImage && (
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-50" />
              </div>
            )}
            <span>{title}</span>
          </div>
          <div className="truncate overflow-hidden flex-grow min-w-0 text-med-12 m:text-semibold-14 text-gray-60">
            {content}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="text-semibold-12 text-gray-70 leading-[18px]">
          {getCount()}
        </div>
      </div>
    </div>
  );
}

function BestColumn({ posts }: { posts: BestPostProps[] }) {
  return (
    <div className="flex-1 flex min-w-0 flex-col gap-1 m:gap-2 overflow-hidden">
      {posts.map((post, index) => (
        <PostItem key={index} {...post} />
      ))}
    </div>
  );
}

export default function Best() {
  const [boardList, setBoardList] = useState<components['schemas']['BoardEntityView'][]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<'monthly' | 'comment' | 'if' | 'vote'>('if');
  const [page, setPage] = useState<0|1>(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const getSortTypeForAPI = (type: 'monthly' | 'comment' | 'if' | 'vote') => {
    switch (type) {
      case 'monthly':
        return 'RECENT';
      case 'comment':
        return 'MONTHLY_COMMENT_POPULAR';
      case 'if':
        return 'MONTHLY_IF_POPULAR';
      case 'vote':
        return 'MONTHLY_VOTE_POPULAR';
      default:
        return 'MONTHLY_POPULAR';
    }
  };

  useEffect(() => {
    const fetchBestBoards = async () => {
      setLoading(true);
      try {
        const response = await getBoardsByPaging({
          count: 10,
          sortType: getSortTypeForAPI(sortType)
        });

        if (response.success && response.data?.data) {
          setBoardList(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch best boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestBoards();
  }, [sortType]);

  const transformToBestProps = (board: components['schemas']['BoardEntityView'], index: number): BestPostProps => {
    let contentText = '';
    let hasImage = false;

    try {
      const parsed = JSON.parse(board.content || '[]');
      if (Array.isArray(parsed)) {
        // 이미지 포함 여부 검사
        hasImage = parsed.some(item => {
          return item && item.insert &&
            (typeof item.insert === 'object' && item.insert.image) ||
            (typeof item.insert === 'string' && item.insert.includes('<img'));
        });

        // 텍스트 추출
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
      rank: index + 1,
      title: board.title || '',
      content: contentText,
      likeCount: board.likeCount || 0,
      commentCount: board.reviewCount || 0,
      uuid: board.uuid || '',
      sortType: sortType,
      hasImage: hasImage,
      onClick: () => {
        router.push(`/community/post/${board.uuid}?source=community-best`);
      }
    };
  };

  const posts = boardList.map(transformToBestProps);
  const leftColumnPosts = posts.slice(0, 5);
  const rightColumnPosts = posts.slice(5, 10);
  const postByPage = [leftColumnPosts, rightColumnPosts];

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStart;

    // 페이지 경계 제한
    if ((page === 0 && diff > 0) || (page === 1 && diff < 0)) {
      setDragOffset(diff * 0.3); // 경계에서는 저항감 있게
    } else {
      setDragOffset(diff);
    }
  };

  const onTouchEnd = () => {
    if (!isDragging) return;

    const distance = dragOffset;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    if (isLeftSwipe && page === 0) {
      setPage(1);
    } else if (isRightSwipe && page === 1) {
      setPage(0);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 m:w-8 m:h-8 flex items-center justify-center flex-shrink-0">
              <CommunityIcon className="w-full h-full" />
            </div>
            <div className="truncate text-bold-16 m:text-bold-20 text-gray-90 m:leading-[28px] tracking-[-0.4px]">
              <span>가방끈</span>
              <span className="text-[#2ddace]"> BEST</span>
              <span> 이야기</span>
            </div>
          </div>
          <Link href={`/community/best?sortType=${getSortTypeForAPI(sortType)}&name=가방끈BEST이야기`}>
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl">
              <div className="truncate text-semibold-12 m:text-semibold-14 text-gray-50 leading-[18px]">
                전체보기
              </div>
              <div className="w-3 h-3 m:w-4 m:h-4 flex items-center justify-center">
                <ChevronLeftIcon className='w-full h-full text-gray-50'/>
              </div>
            </div>
          </Link>
        </div>
        <div className='flex items-center justify-between'>
          <div className="flex items-center gap-2 px-1 m:px-3 flex-shrink-0">
            <div
              className={`text-med-14 leading-[20px] cursor-pointer ${
                sortType === 'if' ? 'text-[#2ddace]' : 'text-gray-50'
              }`}
              onClick={() => setSortType('if')}
            >
              IF 높은 끈
            </div>
            <div className="w-px h-4 bg-[#f8f8fb]" />
            <div
              className={`text-semibold-14 leading-[18px] cursor-pointer ${
                sortType === 'monthly' ? 'text-[#2ddace]' : 'text-gray-50'
              }`}
              onClick={() => setSortType('monthly')}
            >
              최신순
            </div>
            <div className="w-px h-4 bg-[#f8f8fb]" />
            <div
              className={`text-med-14 leading-[20px] cursor-pointer ${
                sortType === 'comment' ? 'text-[#2ddace]' : 'text-gray-50'
              }`}
              onClick={() => setSortType('comment')}
            >
              댓글순
            </div>
            <div className="w-px h-4 bg-[#f8f8fb]" />
            <div
              className={`text-med-14 leading-[20px] cursor-pointer ${
                sortType === 'vote' ? 'text-[#2ddace]' : 'text-gray-50'
              }`}
              onClick={() => setSortType('vote')}
            >
              핫한 투표
            </div>
          </div>
          <div className='flex flex-row gap-x-3'>
            <div className="w-3 h-3 m:w-4 m:h-4 flex items-center justify-center rotate-180 cursor-pointer"
            onClick={()=>setPage(0)}>
              <ChevronLeftIcon className={`w-full h-full ${page===0?'text-gray-50':'text-gray-60'}`}/>
            </div>
            <div className="w-3 h-3 m:w-4 m:h-4 flex items-center justify-center cursor-pointer"
            onClick={()=>setPage(1)}>
              <ChevronLeftIcon className={`w-full h-full ${page===1?'text-gray-50':'text-gray-60'}`}/>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-full gap-2">
              <img src="/assets/loading.gif" alt="로딩" className="w-5 h-5" />
              <div className="text-med-14 text-gray-60">로딩 중...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-med-14 text-gray-60">게시글이 없습니다.</div>
            </div>
          ) : (
            <div
              className={`flex w-[200%] ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
              style={{
                transform: `translateX(${-page * 50 + (containerRef.current ? (dragOffset / containerRef.current.offsetWidth * 50) : 0)}%)`
              }}
            >
              <div className="w-1/2 flex-shrink-0 pr-2">
                <BestColumn posts={leftColumnPosts} />
              </div>
              <div className="w-1/2 flex-shrink-0 pl-2">
                <BestColumn posts={rightColumnPosts} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}