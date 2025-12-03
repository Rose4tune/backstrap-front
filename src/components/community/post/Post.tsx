import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostVoteDisplay from './PostVoteDisplay';
import CommentSection from './CommentSection';
import UserBlock from '../popup/UserBlock';
import PostDelete from '../popup/PostDelete';
import UserReport from '../popup/UserReport';
import getBoard, { GetBoardParams } from '../../../apis/community/getBoard';
import { registerBlock } from '../../../apis/community/userInteraction';
import deleteBoard from '../../../apis/community/deleteBoard';
import registerUserReport from '../../../apis/community/registerUserReport';
import { PostProps, PostData, Author, PostInteraction, Comment } from './Post.types';
import { components } from 'src/types/api';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { useRouter } from 'next/router';
import LinkCopyToast from '@common/toast/LinkCopyToast';
import { useStore } from '@stores/useStore.hook';
import { useMediaQuery } from '@mui/material';

type BoardEntityView = components['schemas']['BoardEntityView'];

// API 응답을 PostData로 변환하는 함수
function mapBoardToPostData(board: BoardEntityView): PostData | null {
  if (!board.uuid || !board.title) {
    return null;
  }
  // 작성자 정보 변환
  const author: Author = {
    id: board.user?.uuid || '',
    nickname: board.user?.name,
    profileImage: board.user?.profileImageUrl,
    isAnonymous: board.isAnonymous || false,
    school: board.user?.school ? {
      name: board.user.school.name,
      region: board.user.school.region,
      code: board.user.school.code
    } : undefined
  };

  // 상호작용 정보 변환
  const interaction: PostInteraction = {
    likeCount: board.likeCount ?? 1,
    commentCount: board.reviewCount ?? 1,
    isLiked: board.isLikedByMe || false,
    bookmarkCount: board.bookmarkCount ?? 1,
    isScraped: board.isBookmarkedByMe || false // API에서 제공하지 않는 정보
  };

  // 콘텐츠 파싱 (Delta 형식에서 텍스트 추출)
  let content = board.content || '';
  let images: string[] = [];

  // console.log('Debug - board.content:', typeof board.content, board.content);

  try {
    if (content.startsWith('[') || content.startsWith('{')) {
      const parsed = JSON.parse(content);
      // console.log('Debug - parsed content:', parsed);
      if (Array.isArray(parsed)) {
        // Delta 형식에서 텍스트와 이미지 추출
        let textContent = '';
        const imageList: string[] = [];

        parsed.forEach((item, index) => {
          // console.log(`Debug - item ${index}:`, item);
          if (item && typeof item.insert === 'string') {
            // 링크 속성이 있는 경우 HTML 링크로 변환
            if (item.attributes && item.attributes.link) {
              textContent += `<a href="${item.attributes.link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors break-all">${item.insert}</a>`;
            } else {
              textContent += item.insert;
            }
          } else if (item && typeof item.insert === 'object' && 'image' in item.insert) {
            // console.log('Debug - found image:', item.insert.image);
            imageList.push(item.insert.image);
          }
        });

        content = textContent;
        images = imageList;
        // console.log('Debug - extracted images from content:', imageList);
      }
    }
  } catch (error) {
    console.error('Failed to parse board content:', error);
  }

  // 첨부 파일에서 이미지 추출 (API 구조: FAEntityFileEntityView -> FileEntityView)
  // console.log('Debug - board.files:', board.files);
  if (board.files && board.files.length > 0) {
    const fileImages = board.files
      .filter(fileEntity => fileEntity.file?.url)
      .map(fileEntity => fileEntity.file!.url!);
    // console.log('Debug - extracted images from files:', fileImages);
    images = [...images, ...fileImages];
  }

  // console.log('Debug - final images array:', images);

  // 댓글 변환 (현재는 빈 배열, 향후 댓글 API 연동 필요)
  const comments: Comment[] = [];

  return {
    id: board.uuid,
    title: board.title,
    content: content.trim(),
    author,
    createdAt: board.createdDate || '',
    tags: [], // API에서 태그 정보 제공하지 않음
    images,
    category: board.category?.name || '',
    categoryUuid: board.category?.uuid,
    interaction,
    comments,
    vote: board.vote // 투표 데이터 추가
  };
}

export default function Post({ boardData, accessToken, onRefresh }: PostProps) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUserBlockOpen, setIsUserBlockOpen] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isPostDeleteOpen, setIsPostDeleteOpen] = useState(false);
  const [isUserReportOpen, setIsUserReportOpen] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [targetUser, setTargetUser] = useState<Author | null>(null);
  const [cookies] = useCookies();

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 토큰 우선순위: props > 쿠키
  const currentAccessToken = accessToken ||
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:550px)');
  const { HeaderStore } = useStore()  // boardData를 PostData로 변환
  useEffect(() => {
    if (boardData) {
      try {
        const mappedData = mapBoardToPostData(boardData);
        if (mappedData) {
          setPostData(mappedData);
          setError(null);
        } else {
          setError('게시글 데이터를 처리할 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to process board data:', error);
        setError('게시글 데이터 처리 중 오류가 발생했습니다.');
      }
    }
  }, [boardData]);

  const handleEdit = () => {
    if (postData) {
      router.push(`/community/edit/${postData.id}?category=${postData.category}`)
    }
  };

  const handleDelete = () => {
    if (postData) {
      // console.log('게시글 삭제:', postData.id);
      setIsPostDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (postData) {
      setIsDeleteLoading(true);
      try {
        // console.log('게시글 삭제 확정:', postData.id);

        const result = await deleteBoard({
          uuid: postData.id
        }, currentAccessToken);

        if (result.success) {
          // console.log('게시글 삭제 완료:', postData.id);
          setIsPostDeleteOpen(false);
          showToastMessage('게시글이 삭제되었습니다.');

          // 삭제 완료 후 이전 페이지로 이동
          setTimeout(() => router.back(), 1000);
        } else {
          // console.error('게시글 삭제 실패:', result.messages);
          showToastMessage('게시글 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('게시글 삭제 API 호출 실패:', error);
        showToastMessage('게시글 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleteLoading(false);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleteLoading) return;
    setIsPostDeleteOpen(false);
  };

  const handleSendMessage = () => {
    if (postData) {
      if (isMobile) {
        router.push(`/my/alarm/message/send?uuid=${postData.id}&partnerUuid=${postData.author.id}&type=${"BOARD"}`)
      } else {
        HeaderStore.setIsSendMessageOpen(true)
        HeaderStore.setType("BOARD")
        HeaderStore.setUuid(postData.id)
      }
    }
  };

  const handleBlockUser = () => {
    if (postData) {
      // console.log('차단하기 클릭:', postData.author.nickname || '익명');
      setTargetUser(postData.author);
      setIsUserBlockOpen(true);
    }
  };

  const handleConfirmBlock = async () => {
    if (targetUser && postData) {
      setIsBlockLoading(true);
      try {
        // console.log('사용자 차단 확정:', targetUser.nickname || '익명');

        const result = await registerBlock('USER', targetUser.id, currentAccessToken);

        if (result.success) {
          // console.log('사용자 차단 완료:', targetUser.nickname || '익명');
          setIsUserBlockOpen(false);
          setTargetUser(null);
          showToastMessage('사용자가 차단되었습니다.');

          // 차단 완료 후 페이지 새로고침 또는 상태 업데이트
          if (onRefresh) {
            onRefresh();
          }
        } else {
          // console.error('사용자 차단 실패:', result.messages);
          showToastMessage('차단에 실패했습니다.');
        }
      } catch (error) {
        console.error('사용자 차단 API 호출 실패:', error);
        showToastMessage('차단 중 오류가 발생했습니다.');
      } finally {
        setIsBlockLoading(false);
      }
    }
  };

  const handleCloseBlockModal = () => {
    // Prevent closing while API call is in progress
    if (isBlockLoading) return;

    setIsUserBlockOpen(false);
    setTargetUser(null);
  };

  const handleReportUser = () => {
    if (postData) {
      // console.log('신고하기 클릭:', postData.author.nickname || '익명');
      setTargetUser(postData.author);
      setIsUserReportOpen(true);
    }
  };

  const handleConfirmReport = async () => {
    if (targetUser && postData) {
      setIsReportLoading(true);
      try {
        // console.log('사용자 신고 확정:', targetUser.nickname || '익명');

        const result = await registerUserReport({
          parentEntityType: 'BOARD',
          parentEntityUuid: postData.id,
          reportedUuid: targetUser.id,
          userReportType: 'ABUSE',
          content: '부적절한 사용자 신고'
        }, currentAccessToken);

        if (result.success) {
          // console.log('사용자 신고 완료:', targetUser.nickname || '익명');
          setIsUserReportOpen(false);
          setTargetUser(null);
          showToastMessage('신고가 접수되었습니다.');

          // 신고 완료 후 페이지 새로고침 또는 상태 업데이트
          if (onRefresh) {
            onRefresh();
          }
        } else {
          // console.error('사용자 신고 실패:', result.messages);
          showToastMessage(result.messages || '신고 접수에 실패했습니다.');
        }
      } catch (error) {
        console.error('사용자 신고 API 호출 실패:', error);
        showToastMessage('신고 처리 중 오류가 발생했습니다.');
      } finally {
        setIsReportLoading(false);
      }
    }
  };

  const handleCloseReportModal = () => {
    if (isReportLoading) return;
    setIsUserReportOpen(false);
    setTargetUser(null);
  };

  const handleMoreMenu = () => {
    if (postData) {
      // console.log('더보기 메뉴:', postData.id);
    }
  };

  // 로딩 상태는 이제 상위에서 관리

  // 에러 상태
  if (error) {
    return (
      <article className="flex flex-col justify-center items-center p-8">
        <div className="text-red-500 text-center mb-4">
          <span className="text-2xl mb-2 block">⚠️</span>
          <span className="text-med-16">{error}</span>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          다시 시도
        </button>
      </article>
    );
  }

  // 데이터 없음 또는 필수 데이터 누락
  if (!postData || !postData.id || !postData.author) {
    return (
      <article className="flex flex-col justify-center items-center p-8">
        <span className="text-med-16 text-gray-70">게시글을 찾을 수 없습니다.</span>
      </article>
    );
  }

  // 정상 렌더링
  return (
    <article className='w-full'>
      {/* 게시글 헤더 */}
      <PostHeader
        title={postData.title}
        author={postData.author}
        createdAt={postData.createdAt}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSendMessage={handleSendMessage}
        onBlockUser={handleBlockUser}
        onReportUser={handleReportUser}
        isDeleteLoading={isDeleteLoading}
        isBlockLoading={isBlockLoading}
        isReportLoading={isReportLoading}
        category={postData.category}
        categoryUuid={postData.categoryUuid}
      />

      {/* 게시글 내용 */}
      <PostContent
        title={postData.title}
        content={postData.content}
        images={postData.images}
        tags={postData.tags}
      />

      {/* 투표 (있는 경우에만 표시) */}
      {postData.vote && (
        <PostVoteDisplay
          className='w-full max-w-[600px]'
          vote={postData.vote}
          accessToken={accessToken}
          onVote={(selectedOptions) => {
            // console.log('투표 완료:', selectedOptions);
            // 투표 완료 후 게시글 데이터 새로고침 (선택사항)
            // loadPost();
          }}
        />
      )}
      <div className='h-5' />
      {/* 게시글 액션 */}
      <PostActions
        interaction={postData.interaction}
        postUuid={postData.id}
        accessToken={accessToken}
        onRefresh={onRefresh}
      />

      {/* 댓글 섹션 */}
      <CommentSection uuid={postData.id || ''} postAuthorId={postData.author?.id || ''} />

      {/* 사용자 차단 모달 */}
      <UserBlock
        isOpen={isUserBlockOpen}
        onClose={handleCloseBlockModal}
        onConfirm={handleConfirmBlock}
        userName={targetUser?.nickname || targetUser?.id || '사용자'}
        isLoading={isBlockLoading}
      />

      {/* 게시글 삭제 모달 */}
      <PostDelete
        isOpen={isPostDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        postTitle={postData.title}
        isLoading={isDeleteLoading}
      />

      {/* 사용자 신고 모달 */}
      <UserReport
        isOpen={isUserReportOpen}
        onClose={handleCloseReportModal}
        onConfirm={handleConfirmReport}
        userName={targetUser?.nickname || targetUser?.id || '사용자'}
        isLoading={isReportLoading}
      />

      {/* Toast 메시지 */}
      <LinkCopyToast message={toastMessage} isVisible={showToast} />
    </article>
  );
}