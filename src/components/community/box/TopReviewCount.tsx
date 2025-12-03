import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MoneyIcon from '@assets/icons/community/money.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import NoticeIcon from '@assets/icons/community/notice.svg';
import BagIcon from '@assets/icons/community/bag.svg';
import MedalIcon from '@assets/icons/community/medal.svg';
import LikeIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import InfoIcon from '@assets/icons/community/info.svg';
import BurningIcon from '@assets/icons/community/comment-community.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import Link from 'next/link';
import Image from 'next/image';

interface BestPostProps {
  rank: number;
  title: string;
  content: string;
  likeCount: number;
  reviewCount: number;
  uuid: string;
  hasImage?: boolean;
  onClick?: () => void;
}

interface CategoryProps {
  title: string;
  count?: number;
  iconUrl?: string;
}

function BestPost({ rank, title, content, likeCount, reviewCount, hasImage, onClick }: BestPostProps) {

  return (
    <div
      className="flex max-w-full min-w-0 items-center justify-between gap-x-[8px] cursor-pointer hover:bg-gray-20 rounded-sm transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-[8px] min-w-0 overflow-hidden">
        <div className="w-[23px] h-[28px] flex items-center justify-center text-bold-20 text-gray-90 flex-shrink-0">
          {rank}
        </div>
        <div className="flex flex-row gap-2 min-w-0 overflow-hidden text-left">
          <div className="flex items-center gap-1 flex-shrink-0 text-semibold-14 m:text-semibold-16 text-gray-90 leading-[24px]">
            {hasImage && (
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-50" />
              </div>
            )}
            <span className="">{title}</span>
          </div>
          <div className='flex items-center min-w-0'>
            <div className="truncate flex-grow min-w-0 text-med-12 m:text-semibold-14 text-gray-60">
              {content}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 flex items-center justify-center">
          <LikeIcon className="w-full h-full text-red" />
        </div>
        <div className="text-semibold-12 text-gray-70 leading-[18px]">
          {likeCount}
        </div>
        <div className="w-4 h-4 flex items-center justify-center">
          <CommentIcon className="w-full h-full text-gray-60" />
        </div>
        <div className="text-semibold-12 text-gray-70 leading-[18px]">
          {reviewCount}
        </div>
      </div>
    </div>
  );
}

export default function TopReviewCount({ title, count = 7, iconUrl }: CategoryProps) {
  const [posts, setPosts] = useState<BestPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const response = await getBoardsByPaging({
          count,
          sortType: 'COMMENT',
        });

        if (response.success && response.data?.data) {
          const transformedPosts = response.data.data.map((board: components['schemas']['BoardEntityView'], i) => {
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

            // 이미지 포함 여부 검사
            let hasImage = false;
            try {
              const parsed = JSON.parse(board.content || '[]');
              if (Array.isArray(parsed)) {
                hasImage = parsed.some(item => {
                  return item && item.insert &&
                    (typeof item.insert === 'object' && item.insert.image) ||
                    (typeof item.insert === 'string' && item.insert.includes('<img'));
                });
              }
            } catch (error) {
              console.error('Failed to parse board content for image detection:', error);
            }

            return {
              title: board.title || '',
              rank:i+1,
              likeCount:board.likeCount||0,
              reviewCount:board.reviewCount||0,
              content: contentText,
              uuid: board.uuid || '',
              hasImage: hasImage,
              onClick: () => {
                router.push(`/community/post/${board.uuid}?source=category`);
              }
            };
          });
          setPosts(transformedPosts);
        }
      } catch (error) {
        console.error('Failed to fetch category posts:', error);
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              { iconUrl?
                <Image width={32} height={32} src={iconUrl} alt={title}/>
                : <BurningIcon className="w-full h-full" />
              }
            </div>
            <div className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              {title}
            </div>
          </div>
          <Link href={`/community/topComment?sortType=COMMENT&name=최근 댓글이 많이 달린 글`}>
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer">
              <div className="text-semibold-14 text-gray-50 leading-[18px]">
                전체보기
              </div>
              <div className="w-4 h-4 flex items-center justify-center">
                <ChevronLeftIcon className='text-gray-50 w-4 h-4'/>
              </div>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <img src="/assets/loading.gif" alt="로딩" className="w-5 h-5" />
              <div className="text-med-14 text-gray-60">로딩 중...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-med-14 text-gray-60">게시글이 없습니다.</div>
            </div>
          ) : (
            posts.map((post, index) => (
              <BestPost key={index} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}