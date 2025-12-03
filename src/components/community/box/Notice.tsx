import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NoticeIcon from '@assets/icons/community/notice.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import Link from 'next/link';
import PinIcon from '@assets/icons/community/pin.svg';

interface CategoryPostProps {
  title: string;
  content: string;
  uuid: string;
  hasImage?: boolean;
  onClick?: () => void;
  isPinned?: boolean;
}

interface CategoryProps {
  uuid: string;
  title: string;
  count?: number;
}

function NoticePost({ title, content, hasImage, onClick, isPinned }: CategoryPostProps) {
  return (
    <div
      className="flex flex-col gap-1 cursor-pointer hover:bg-gray-20 rounded-sm transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-[8px] min-w-0 overflow-hidden">
        {isPinned? (
          <PinIcon className='w-5 h-5 text-red'/>
        ) : (
          <div className="w-[23px] h-[28px] flex items-center justify-center text-bold-20 text-gray-90 flex-shrink-0">
            •
          </div>
        )}
        <div className="flex flex-row gap-3 min-w-0 overflow-hidden text-left">
          <div className="flex items-center gap-1 flex-shrink-0 text-semibold-16 text-gray-90 leading-[24px]">
            {hasImage && (
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-50" />
              </div>
            )}
            <span className="">{title}</span>
          </div>
          <div className="truncate flex-grow min-w-0 text-semibold-14 text-gray-60 leading-[24px]">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notice({ uuid, title, count = 7 }: CategoryProps) {
  const [posts, setPosts] = useState<CategoryPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const response = await getBoardsByPaging({
          count,
          sortType: 'RECENT',
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
  }, [uuid]);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <NoticeIcon className="w-full h-full" />
            </div>
            <div className="truncate text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              {title}
            </div>
          </div>
          <Link href={`/community/${uuid}?name=끈지기 공지`}>
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer">
              <div className="truncate text-semibold-14 text-gray-50 leading-[18px]">
                전체보기
              </div>
              <div className="w-4 h-4 flex items-center justify-center">
                <ChevronLeftIcon className='text-gray-50 w-4 h-4'/>
              </div>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
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
              <NoticePost key={index} isPinned={index===0 && true} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}