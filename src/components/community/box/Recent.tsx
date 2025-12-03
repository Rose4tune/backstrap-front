import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FireIcon from '@assets/icons/community/fire.svg';
import ImageIcon from '@assets/icons/community/image.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import { BoardEntityView, BoardsDocument, BoardSortType, BoardsQuery, BoardsQueryVariables } from '@generated/graphql';
import { useApolloClient } from '@hooks/useApolloClient';
import Link from 'next/link';
import PostItem, { PostItemProps } from './PostItem';

interface RecentProps {
  // width prop 제거하고 fill 방식으로 변경
}

// function Post({ title, content, hasImage, onClick }: PostProps) {
//   return (
//     <div
//       className="flex flex-col gap-1 cursor-pointer hover:bg-gray-20 rounded-sm transition-colors overflow-hidden"
//       onClick={onClick}
//     >
//       <div className="flex items-start gap-2">
//         {hasImage ? (
//           <div className="flex items-start gap-1">
//             <div className="w-4 h-4 flex items-center justify-center mt-0.5">
//               <ImageIcon className="w-4 h-4 text-gray-50" />
//             </div>
//             <div className="truncate text-bold-16 text-gray-90 leading-[18px]">
//               {title}
//             </div>
//           </div>
//         ) : (
//           <div className="truncate text-bold-16 text-gray-90 leading-[18px]">
//             {title}
//           </div>
//         )}
//       </div>
//       <div className="text-med-14 text-gray-50 leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
//         {content}
//       </div>
//     </div>
//   );
// }

interface PostGridProps {
  posts:PostItemProps[];
  simple?:boolean;
}

function PostGrid({ posts, simple }: PostGridProps) {
  return (
    <div className="w-full h-[376px] flex flex-col flex-wrap content-start gap-x-[60px] gap-y-3 overflow-hidden flex-shrink-0">
      {posts.map((post, index) => (
        <div key={index} className={`${simple?'w-full': 'w-[calc(50%-30px)]'} flex flex-shrink-0}`}>
          <PostItem {...post}/>
          {/* <Post {...post} /> */}
        </div>
      ))}
    </div>
  );
}

interface RecentProps {
  simple?: boolean;
}

export default function Recent({simple=false}:RecentProps) {
  const [boardList, setBoardList] = useState<BoardEntityView[]>([]);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    const fetchRecentBoards = async () => {
      setLoading(true);
      try {
        const result = await apolloClient.query<BoardsQuery, BoardsQueryVariables>({
          query: BoardsDocument,
          variables: {
            input: {
              paginationRequestDto: {
                count: simple?7:14
              },
              sortType: null
            }
          }
        });

        if (result.data?.boardsByCursor?.data) {
          const filteredData = result.data.boardsByCursor.data.filter(
            board => board !== null
          ) as BoardEntityView[];
          setBoardList(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch recent boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBoards();
  }, [apolloClient]);

  const transformToPostProps = (board: BoardEntityView): PostItemProps => {
    let contentText = '';
    let hasImage = false;

    try {
      const parsed = JSON.parse(board.content);
      if (Array.isArray(parsed)) {
        // 이미지 포함 여부 검사
        hasImage = parsed.some(item => {
          return item && item.insert &&
            (typeof item.insert === 'object' && item.insert.image) ||
            (typeof item.insert === 'string' && item.insert.includes('<img'));
        });

        // 텍스트 추출
        const firstItem = parsed[0];
        if (firstItem && firstItem.insert && typeof firstItem.insert === 'string') {
          contentText = firstItem.insert.replace(/\n/g, ' ').trim();
        }
      }
    } catch (error) {
      console.error('Failed to parse board content:', error);
    }

    // 반응형을 위해 적절한 길이로 제한 (CSS로 처리)
    const contentPreview = contentText.length > 40 ? contentText.substring(0, 40) + '...' : contentText;

    return {
      title: board.title,
      content: contentPreview,
      hasImage: hasImage,
      uuid: board.uuid,
      likeCount: board.likeCount,
      commentCount: board.reviewCount,
      onClick: () => {
        router.push(`/community/post/${board.uuid}?source=community`);
      }
    };
  };

  const posts = boardList.map(transformToPostProps);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <FireIcon className="w-full h-full"/>
            </div>
            <div className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              따끈따끈 막 나온 끈
            </div>
          </div>
          <Link href={'/community/recent'}>
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
        <div className="flex w-full h-[376px] flex-shrink-0">
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
            <PostGrid posts={posts} simple={simple}/>
          )}
        </div>
      </div>
    </div>
  );
}