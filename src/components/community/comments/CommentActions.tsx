import React, { useState } from 'react';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import MoreIcon from '@assets/icons/community/more.svg';
import { registerLike, deleteLike, registerBlock } from '../../../apis/community/userInteraction';
import registerUserReport from '@api/community/registerUserReport';
import UserReport from '../popup/UserReport';
import Link from 'next/link';
import CommentDelete from '../popup/CommentDelete';
import UserBlock from '../popup/UserBlock';
import LinkCopyToast from '@common/toast/LinkCopyToast';
import { useMediaQuery } from '@mui/material';
import { useStore } from '@stores/useStore.hook';

interface CommentActionsProps {
  commentId: string;
  authorId: string;
  likeCount: number;
  isLiked: boolean;
  isOwn: boolean;
  accessToken?: string;
  isAnnonymousAuthor?: boolean;
  onRefresh?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  compact?: boolean; // 헤더용 더보기 버튼만 표시
  likeOnly?: boolean; // 좋아요 버튼만 표시
}

export default function CommentActions({
  commentId,
  authorId,
  isAnnonymousAuthor = true,
  likeCount,
  isLiked,
  isOwn,
  accessToken,
  onRefresh,
  onEdit,
  onDelete,
  onReply,
  compact = false,
  likeOnly = false
}: CommentActionsProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const isMobile = useMediaQuery('(max-width:550px)');
  const { HeaderStore } = useStore()

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 댓글 좋아요/취소 처리
  const handleLike = async () => {
    if (isLikeLoading || !accessToken) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        // 좋아요 취소
        const result = await deleteLike('REVIEW', commentId, undefined, accessToken);
        if (result.success) {
          onRefresh?.();
        } else {
          alert(result.messages || '좋아요 취소에 실패했습니다.');
        }
      } else {
        // 좋아요 등록
        const result = await registerLike('REVIEW', commentId, accessToken);
        if (result.success) {
          onRefresh?.();
        } else {
          alert(result.messages || '좋아요 등록에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Comment like error:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 신고하기
  const handleReport = async () => {
    try {
      const result = await registerUserReport({
        parentEntityType: 'REVIEW',
        parentEntityUuid: commentId,
        reportedUuid: commentId,
        userReportType: 'ABUSE'
      }, accessToken);

      if (result.success) {
        showToastMessage('신고가 접수되었습니다.');
        setReportReason('');
        setShowReportModal(false);
      } else {
        showToastMessage(result.messages || '신고 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('Report error:', error);
      showToastMessage('신고 접수 중 오류가 발생했습니다.');
    }
  };

  const handleBlock = async () => {
    try {
      const result = await registerBlock('USER', authorId, accessToken);
      if (result.success) {
        showToastMessage('차단이 완료되었습니다.');
        setShowBlockModal(false);
      } else {
        showToastMessage(result.messages || '차단에 실패했습니다.');
      }
    } catch (error) {
      console.error('Block error:', error);
      showToastMessage('차단 중 오류가 발생했습니다.');
    }
  };
  // 좋아요만 표시하는 모드 (피그마 디자인의 우측 좋아요 버튼)
  if (likeOnly) {
    return (
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleLike}
          disabled={isLikeLoading}
          className={`${isLikeLoading ? 'opacity-50' : ''} flex`}
        >
          {isLikeLoading ? (
            <div className="w-4 h-4 border border-red border-t-transparent rounded-full animate-spin" />
          ) : (
            <FavoriteIcon className={`w-4 h-4 ${isLiked ? 'text-red' : 'text-red-50'}`} />
          )}
        </button>
        <span className="text-semibold-12 text-gray-60">{likeCount}</span>
      </div>
    );
  }

  // 더보기 버튼만 표시하는 모드 (피그마 디자인의 헤더 더보기)
  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-4 h-4 flex items-center justify-center transition-colors"
          aria-label="더보기 메뉴"
        >
          <MoreIcon className="w-4 h-4 text-gray-60" />
        </button>

        {showMoreMenu && (
          <div className="absolute top-8 right-0 bg-white rounded-xl shadow-lg border border-gray-20 w-32 py-2 z-20">
            {isOwn ? (
              <>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-med-14 text-gray-90 hover:bg-gray-10 transition-colors"
                  onClick={() => {
                    onEdit?.();
                    setShowMoreMenu(false);
                  }}
                >
                  수정하기
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-med-14 text-red hover:bg-gray-10 transition-colors"
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                >
                  삭제하기
                </button>
              </>
            ) : (
              <div className='flex flex-col'>
                <Link
                  href={`/my/alarm/message/send?uuid=${commentId}&partnerUuid=${authorId}&type=REVIEW`}
                  onClick={(e) => {
                    // 데스크탑이면 기본 이동 막기
                    if (!isMobile) {
                      e.preventDefault();
                      HeaderStore.setIsSendMessageOpen(true);
                      HeaderStore.setType("REVIEW")
                      HeaderStore.setUuid(commentId)
                      //최상단 scroll
                      if (typeof window !== 'undefined') {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                      }
                    }

                    // 모바일이면 그대로 이동 (기본 링크 동작 유지)
                  }}
                  className="w-full px-4 py-2 text-left text-med-14 text-gray-90 hover:bg-gray-10 transition-colors"
                >
                  쪽지 보내기
                </Link>

                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-med-14 text-gray-90 hover:bg-gray-10 transition-colors"
                  onClick={() => {
                    setShowBlockModal(true);
                    setShowMoreMenu(false);
                  }}
                >
                  차단하기
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-med-14 text-gray-90 hover:bg-gray-10 transition-colors"
                  onClick={() => {
                    setShowReportModal(true);
                    setShowMoreMenu(false);
                  }}
                >
                  신고하기
                </button>
              </div>
            )}
          </div>
        )}
        {showDeleteModal && <CommentDelete onConfirm={() => {
          onDelete?.();
          setShowDeleteModal(false);
        }} onClose={() => setShowDeleteModal(!showDeleteModal)} />}
        {/* 차단하기 모달 */}
        {showBlockModal && <UserBlock onConfirm={async () => {
          await handleBlock();
        }}
          onClose={() => setShowBlockModal(!showBlockModal)} />}
        {/* 신고하기 모달 */}
        {showReportModal && <UserReport onConfirm={async () => {
          await handleReport();
        }}
          onClose={() => setShowReportModal(!showReportModal)} />}

        {/* Toast 메시지 */}
        <LinkCopyToast message={toastMessage} isVisible={showToast} />
      </div>
    );
  }
}