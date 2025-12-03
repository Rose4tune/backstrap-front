import React, { useState } from 'react';
import LikeIcon from '@assets/icons/community/favorite.svg';
import LikeFilledIcon from '@assets/icons/community/favorite-filled.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import ShareIcon from '@assets/icons/community/share.svg';
import ScrapIcon from '@assets/icons/community/scrap.svg';
import { PostActionsProps } from './Post.types';
import { registerLike, deleteLike, registerScrap, deleteScrap } from '../../../apis/community/userInteraction';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import useCopyLink from '@hooks/useCopyLink';
import LinkCopyToast from '@common/toast/LinkCopyToast';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { useStore } from '@stores/useStore.hook';

export default function PostActions({
  interaction,
  postUuid,
  accessToken,
  onLike,
  onShare,
  onBookmark,
  onRefresh
}: PostActionsProps) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isScrapLoading, setIsScrapLoading] = useState(false);
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  const isMobile = useMediaQuery('(max-width:550px)');
  const { copyLink, copied } = useCopyLink();
  const { UserStore } = useStore();
  // 좋아요 처리
  const handleLike = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const newIsLiked = !interaction.isLiked;

      if (newIsLiked) {
        // 좋아요 등록
        const result = await registerLike('BOARD', postUuid, accessToken);
        if (result.success) {
          onRefresh?.();
        } else {
          if(result.messages==='권한이 없습니다.') openAuthModal();
        }
      } else {
        // 좋아요 취소
        const result = await deleteLike('BOARD', postUuid, undefined, accessToken);
        if (result.success) {
          onRefresh?.();
        } else {
          alert(result.messages || '좋아요 취소에 실패했습니다.');
        }
      }

      onLike?.();
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 스크랩 처리
  const handleScrap = async () => {
    if (isScrapLoading) return;

    setIsScrapLoading(true);
    try {
      const newIsScraped = !interaction.isScraped;

      if (newIsScraped) {
        // 스크랩 등록
        const result = await registerScrap('BOARD', postUuid, accessToken);
        if (result.success) {
          onRefresh?.();
        } else {
          if(result.messages==='권한이 없습니다.') openAuthModal();
        }
      } else {
        // 스크랩 취소
        const result = await deleteScrap('BOARD', postUuid, undefined, accessToken);
        if (result.success) {
          onRefresh?.();
        }
      }

      onBookmark?.();
    } catch (error) {
      console.error('스크랩 처리 중 오류:', error);
      alert('스크랩 처리 중 오류가 발생했습니다.');
    } finally {
      setIsScrapLoading(false);
    }
  };

  // 공유 처리 (링크 복사)
  const handleShare = async () => {
    if(UserStore.getAccessToken()==='') openAuthModal();
    else await copyLink();
    onShare?.();
  };
  return (
    <div className={`flex items-center ${isMobile?'justify-between px-5 pt-5':'gap-x-1 ml-[-20px] pt-[52px]'}`}>
      {AuthModalComponent}
  {/* 좋아요 버튼 */}
      <button
        type="button"
        onClick={handleLike}
        disabled={isLikeLoading}
        className={`${isMobile?'text-semibold-12 px-2':'pl-4 pr-5 text-semibold-14'} flex flex-shrink-0 justify-center items-center gap-1 py-2 rounded-2xl transition-colors hover:bg-red-50 ${
          interaction.isLiked?'text-red':'text-gray-40 hover:text-white'
        } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={interaction.isScraped ? '스크랩 취소' : '스크랩'}
      >
        <div className={`w-6 h-6 flex items-center justify-center`}>
          {isLikeLoading ? (
            <div className="w-4 h-4 border-2 border-gray-40 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LikeIcon className={`w-full h-full`}/>
          )}
        </div>
        <div className="text-gray-90 flex-shrink-0">
          좋아요
        </div>
        <div className="text-gray-90 flex-shrink-0">
          {interaction.likeCount}
        </div>
      </button>

{/* 스크랩 버튼 */}
      <button
        type="button"
        onClick={handleScrap}
        disabled={isScrapLoading}
        className={`${isMobile?'text-semibold-12 px-2':'pl-4 pr-5 text-semibold-14'} flex flex-shrink-0 justify-center items-center gap-1 py-2 rounded-2xl transition-colors hover:bg-amber-100 ${
          interaction.isScraped?'text-yellow':'text-gray-40 hover:text-white'
        } ${isScrapLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={interaction.isScraped ? '스크랩 취소' : '스크랩'}
      >
        <div className={`w-6 h-6 flex items-center justify-center`}>
          {isScrapLoading ? (
            <div className="w-4 h-4 border-2 border-gray-40 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ScrapIcon className={`w-full h-full`}/>
          )}
        </div>
        <div className="text-gray-90 flex-shrink-0">
          스크랩
        </div>
        <div className="text-gray-90 flex-shrink-0">
          {interaction.bookmarkCount}
        </div>
      </button>
      <div className={`flex items-center gap-x-3 gap-y-5`}>
        {/* 공유하기 버튼 */}
        <button
          type="button"
          onClick={handleShare}
          className={`${isMobile?'text-semibold-12':'pl-4 pr-5 text-semibold-14'} flex flex-shrink-0 justify-center items-center gap-1 py-2 rounded-2xl transition-colors`}
          aria-label="공유하기"
        >
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <ShareIcon className="w-full h-full text-gray-90" />
          </div>
          <span className="text-gray-90 flex-shrink-0">
            공유하기
          </span>
        </button>
      </div>
      <LinkCopyToast message="링크가 복사되었습니다!" isVisible={copied} />
    </div>
  );
}