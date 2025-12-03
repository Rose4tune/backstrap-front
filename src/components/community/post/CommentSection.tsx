import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Comment, Author } from './Post.types';
import CommentItem from '../comments/CommentItem';
import CommentForm from '../comments/CommentForm';
import getCommentsByPaging, { GetCommentsByPagingParams } from '../../../apis/community/comments/getCommentsByPaging';
import { components } from 'src/types/api';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import LockIcon from '@assets/icons/community/lock.svg';
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';
type ReviewViewDtoRes = components['schemas']['ReviewViewDtoRes'];
type UserViewDtoRes = components['schemas']['UserViewDtoRes'];

interface CommentSectionProps {
  uuid: string; // 게시글 UUID
  postAuthorId?: string; // 게시글 작성자 ID
}

// 댓글과 답글 수를 재귀적으로 계산하는 함수
function countTotalComments(comments: Comment[]): number {
  let total = 0;
  comments.forEach(comment => {
    total += 1; // 댓글 자체
    if (comment.replies && comment.replies.length > 0) {
      total += countTotalComments(comment.replies); // 답글들
    }
  });
  return total;
}

// 익명 사용자 번호 매핑을 위한 함수
function assignAnonymousNumbers(comments: Comment[]): Comment[] {
  const anonymousUserMap = new Map<string, number>();
  let anonymousCounter = 1;

  // 모든 댓글과 답글을 시간순으로 수집하여 익명 사용자에게 번호 부여
  const collectAllComments = (commentList: Comment[]): Comment[] => {
    const allComments: Comment[] = [];

    const traverse = (comment: Comment) => {
      allComments.push(comment);
      if (comment.replies) {
        comment.replies.forEach(traverse);
      }
    };

    commentList.forEach(traverse);
    return allComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  // 시간순으로 정렬된 모든 댓글에서 익명 사용자 번호 할당
  const allCommentsSorted = collectAllComments(comments);
  allCommentsSorted.forEach(comment => {
    if (comment.author.isAnonymous && comment.author.id && !anonymousUserMap.has(comment.author.id)) {
      anonymousUserMap.set(comment.author.id, anonymousCounter++);
    }
  });

  const processComment = (comment: Comment): Comment => {
    let nickname = comment.author.nickname;

    if (comment.author.isAnonymous && comment.author.id) {
      const userNumber = anonymousUserMap.get(comment.author.id);
      nickname = `익명의 끈 ${userNumber}`;
    }

    const processedComment: Comment = {
      ...comment,
      author: {
        ...comment.author,
        nickname
      },
      replies: comment.replies ? comment.replies.map(processComment) : undefined
    };

    return processedComment;
  };

  return comments.map(processComment);
}

// API 응답을 Comment 타입으로 변환하는 함수
function mapReviewToComment(review: ReviewViewDtoRes): Comment | null {
  if (!review.uuid) {
    return null;
  }

  // 작성자 정보 변환
  const author: Author = {
    id: review.user?.uuid || '',
    nickname: review.isAnonymous ? '익명의 끈' : review.user?.name, // 기본값, 나중에 번호가 추가됨
    profileImage: review.user?.profileImageUrl,
    isAnonymous: review.isAnonymous || false,
    school: review.user?.schoolName ? {
      name: review.user.school?.name,
      region: '', // API에서 제공하지 않음
      code: '' // API에서 제공하지 않음
    } : undefined
  };

  // 대댓글 변환
  const replies: Comment[] = [];
  if (review.childReviews && review.childReviews.length > 0) {
    review.childReviews.forEach(childReview => {
      const childComment = mapReviewToComment(childReview);
      if (childComment) {
        replies.push(childComment);
      }
    });
  }

  return {
    id: review.uuid,
    content: review.content||'',
    author,
    createdAt: review.createdDate || '',
    likeCount: review.likeCount || 0,
    isLiked: review.isLikedByMe || false,
    replies: replies.length > 0 ? replies : undefined,
    status: review.entityStatus
  };
}


export default function CommentSection({ uuid, postAuthorId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width:550px)');
  const [refreshKey, setRefreshKey] = useState(0);
  const [cookies] = useCookies();

  // accessToken과 현재 사용자 ID 가져오기
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

  const currentUserId =
    cookies[COOKIE_NS]?.authPayload?.user?.uuid ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.user?.uuid ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.user?.uuid;

  // 댓글 데이터 로딩
  useEffect(() => {
    const loadComments = async () => {
      if (!uuid) {
        setError('게시글 UUID가 필요합니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getCommentsByPaging(
          {
            parentEntityUuid: uuid,
            parentEntityType: 'BOARD',
            reviewType: 'BOARD',
            sortType: 'RECENT',
            page: 0,
            count: 10000
          },
          accessToken
        );

        if (response.success && response.data) {
          const mappedComments: Comment[] = [];

          if (response.data.data) {
            response.data.data.forEach(review => {
              const comment = mapReviewToComment(review);
              if (comment) {
                mappedComments.push(comment);
              }
            });
          }

          // 익명 사용자에게 번호 할당
          const commentsWithNumbers = assignAnonymousNumbers(mappedComments);
          setComments(commentsWithNumbers);
          // totalCount가 0이면 실제 댓글 수를 사용 (답글 포함한 전체 수)
          const actualCount = response.data.totalCount || countTotalComments(mappedComments);
          setTotalCount(actualCount);
        } else {
          setError(response.messages || '댓글을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
        setError('댓글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [uuid, accessToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };


  // 로딩 중
  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col w-full">
  //       <div className="px-3 pb-5">
  //         <h3 className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
  //           댓글
  //         </h3>
  //       </div>
  //       <div className="flex justify-center items-center py-8">
  //         <div className="w-6 h-6 border-2 border-gray-30 border-t-normal rounded-full animate-spin"></div>
  //         <span className="ml-3 text-med-14 text-gray-70">댓글을 불러오는 중...</span>
  //       </div>
  //     </div>
  //   );
  // }

  // 에러 상태
  // if (error) {
  //   return (
  //     <div className="flex flex-col w-full">
  //       <div className="px-3 pb-5">
  //         <h3 className="text-bold-20 text-gray-90 leading-[28px] tracking-[-0.4px]">
  //           댓글
  //         </h3>
  //       </div>
  //       <div className="flex flex-col items-center py-8">
  //         <span className="text-red-500 text-center mb-4">⚠️</span>
  //         <span className="text-med-14 text-red-500">{error}</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex pt-5 flex-col w-full">
      {/* 댓글 제목 */}
      <div className={`${!isMobile&&'px-3 pb-5'}`}>
        <h3 className={`${isMobile?'text-semibold-14':'text-bold-16'} text-gray-90 leading-[28px] tracking-[-0.4px]`}>
          댓글 ({totalCount})
        </h3>
      </div>

      {/* 댓글 입력창 */}
      <div className="mb-1">
        <CommentForm
          parentEntityType="BOARD"
          parentEntityUuid={uuid}
          accessToken={accessToken}
          onSubmit={handleRefresh}
          placeholder={!accessToken?'댓글 작성을 위해 로그인을 해주세요':'댓글을 입력해 주세요'}
        />
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-1 relative rounded-xl min-h-60">
        {!accessToken &&
          (
            <div className='px-20 flex flex-col gap-y-[10px] items-center blur-none absolute z-20 w-full h-full'>
              <div className='flex flex-col gap-y-[10px] items-center justify-center min-h-[200px] max-h-[460px] h-full'>
                <LockIcon/>
                <span className='text-semibold-16 text-gray-90 text-center'>댓글을 보기 위해 로그인/회원가입을 해주세요</span>
                <Link href={'/user/sign-in'} className='flex py-4 px-6 text-semibold-16 text-white bg-normal rounded-[16px] flex-shrink-0 text-center'>
                  로그인/회원가입 하러 가기
                </Link>
              </div>
            </div>
          )
        }
        <div className={`flex flex-col gap-1 ${!accessToken && 'blur-md'} ${!isMobile&&'px-5'}`}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isPostAuthor={comment.author.id === postAuthorId}
              postAuthorId={postAuthorId}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}