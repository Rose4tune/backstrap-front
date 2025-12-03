import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MoneyIcon from '@assets/icons/community/money.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import PostItem from './PostItem';
import Link from 'next/link';

interface CategoryPostProps {
  title: string;
  content: string;
  uuid: string;
  likeCount: number;
  hasImage?: boolean;
  onClick?: () => void;
}

interface CategoryProps {
  uuid?: string;
  count?: number;
  sortType: "LIKE" | "POPULAR" | "RECENT" | "MONTHLY_POPULAR" | "MONTHLY_COMMENT_POPULAR" | "MONTHLY_IF_POPULAR" | "MONTHLY_VOTE_POPULAR" | undefined;
}

export default function SideHome({ uuid, sortType, count = 7 }: CategoryProps) {
  const [posts, setPosts] = useState<CategoryPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const response = await getBoardsByPaging({
          count,
          sortType,
          groupUuid: uuid
        });

        if (response.success && response.data?.data) {
          const transformedPosts = response.data.data.map((board: components['schemas']['BoardEntityView']) => {
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
              content: contentText,
              likeCount: board.likeCount || 0,
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
  }, [uuid, sortType]);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              <span className='text-click'>따끈따끈 막 나온 끈</span>
              <span> 추천글</span>
            </div>
          </div>
          <Link href ={`/community/${uuid}?sortType=${sortType}&name=${'게시판 추천글'}`} className="flex items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer">
            <div className="text-semibold-14 text-gray-50 leading-[18px]">
              전체보기
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <ChevronLeftIcon className='text-gray-50 w-4 h-4'/>
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
              <PostItem key={index} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}