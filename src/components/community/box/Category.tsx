import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MoneyIcon from '@assets/icons/community/money.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import { components } from 'src/types/api';
import getBoardsByPaging from 'src/apis/community/getBoardsByPaging';
import NoticeIcon from '@assets/icons/community/notice.svg';
import BagIcon from '@assets/icons/community/bag.svg';
import MedalIcon from '@assets/icons/community/medal.svg';
import StudyIcon from '@assets/icons/community/study.svg';
import InfoIcon from '@assets/icons/community/info.svg';
import AirplaneIcon from '@assets/icons/community/airplane.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import Link from 'next/link';
import Image from 'next/image';
import PostItem from './PostItem';

interface CategoryPostProps {
  title: string;
  content: string;
  uuid: string;
  hasImage?: boolean;
  onClick?: () => void;
}

interface CategoryProps {
  uuid: string;
  title: string;
  count?: number;
  iconUrl?: string;
  commentCount?: boolean;
  likeCount?: boolean;
}

export function Category({ uuid, title, count = 7, iconUrl, commentCount=true, likeCount=true }: CategoryProps) {
  const [posts, setPosts] = useState<CategoryPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getPosts = useCallback(async()=>{
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
            likeCount: likeCount? board.likeCount:undefined,
            commentCount: commentCount? board.reviewCount:undefined,
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
  }, [uuid, count])

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              { iconUrl?
                <Image width={32} height={32} src={iconUrl} alt={title}/>
                : <StudyIcon className="w-full h-full" />
              }
            </div>
            <div className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              {title}
            </div>
          </div>
          <Link href={`/community/${uuid}?name=${title}`}>
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
              <PostItem key={index} {...post}/>
            ))
          )}
        </div>
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