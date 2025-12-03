import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import { components } from 'src/types/api';
import getHotReviews from 'src/apis/community/getHotReviews';
import getBoard from 'src/apis/community/getBoard';
import PostItem, { PostItemProps } from './PostItem';

type ReviewViewDtoRes = components['schemas']['ReviewViewDtoRes'];

interface HotCommentProps {
  title: string;
  count?: number;
  accessToken?: string;
}

const HotComment = ({ title, count = 7, accessToken }: HotCommentProps) => {
  const [comments, setComments] = useState<PostItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getHotComments = useCallback(async()=>{
    setLoading(true);
    try {
      const response = await getHotReviews({ count }, accessToken);

      if (response.success && response.data) {
        // 댓글 내용 텍스트만 추출하는 유틸 함수
        const getPlainText = (content: string): string => {
          return content.replace(/<[^>]*>/g, '').trim();
        };

        // 게시물 제목 없이 먼저 댓글 데이터 구성
        const commentsData = response.data.map((review: ReviewViewDtoRes) => ({
          title: getPlainText(review.content || ''),
          content: '게시물', // 기본값
          uuid: review.uuid || '',
          likeCount: review.likeCount || 0,
          parentEntityUuid: review.parentEntityUuid,
          onClick: () => {
            if (review.parentEntityUuid) {
              router.push(`/community/post/${review.parentEntityUuid}`);
            }
          }
        }));

        // 먼저 댓글 데이터를 설정하여 빠른 렌더링
        setComments(commentsData);

        // 고유한 parentEntityUuid들만 추출 (타입 가드 적용)
        const uniqueParentUuids = [...new Set(
          response.data
            .map(review => review.parentEntityUuid)
            .filter((uuid): uuid is string => Boolean(uuid))
        )];

        // 중복 제거된 게시물들의 제목을 한 번에 가져오기
        if (uniqueParentUuids.length > 0) {
          const boardTitles = new Map<string, string>();

          await Promise.all(
            uniqueParentUuids.map(async (parentUuid: string) => {
              try {
                const boardResponse = await getBoard({ uuid: parentUuid }, accessToken);
                if (boardResponse.success && boardResponse.data?.title) {
                  boardTitles.set(parentUuid, boardResponse.data.title);
                }
              } catch (error) {
                console.error(`Failed to fetch board title for ${parentUuid}:`, error);
              }
            })
          );

          // 제목 정보로 댓글 데이터 업데이트
          const updatedComments = commentsData.map(comment => ({
            ...comment,
            content: comment.parentEntityUuid
              ? boardTitles.get(comment.parentEntityUuid) || '게시물'
              : '게시물'
          }));

          setComments(updatedComments);
        }
      }
    } catch (error) {
      console.error('Failed to fetch hot comments:', error);
    } finally {
      setLoading(false);
    }
  }, [count, accessToken])

  useEffect(() => {
    getHotComments();
  }, [getHotComments]);

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
              {title}
            </div>
          </div>
          {/* <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50">
            <div className="text-semibold-14 text-gray-50 leading-[18px]">
              전체보기
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <ChevronLeftIcon className='text-gray-50'/>
            </div>
          </div> */}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <img src="/assets/loading.gif" alt="로딩" className="w-5 h-5" />
              <div className="text-med-14 text-gray-60">로딩 중...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-med-14 text-gray-60">인기 댓글이 없습니다.</div>
            </div>
          ) : (
            comments.map((comment, index) => (
              <PostItem key={comment.uuid} {...comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default HotComment;