import React, { useState, useRef, useEffect } from 'react';
import MoreIcon from '@assets/icons/community/more.svg';
import { useMediaQuery } from '@mui/material';

export interface PostMoreMenuProps {
  isMine: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSendMessage?: () => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
  className?: string;
  isDeleteLoading?: boolean;
  isBlockLoading?: boolean;
  isReportLoading?: boolean;
}

export default function PostMoreMenu({
  isMine,
  onEdit,
  onDelete,
  onSendMessage,
  onBlockUser,
  onReportUser,
  className = '',
  isDeleteLoading = false,
  isBlockLoading = false,
  isReportLoading = false
}: PostMoreMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:550px)');

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 로딩 완료 시 메뉴 닫기
  useEffect(() => {
    if (!isDeleteLoading && !isBlockLoading && !isReportLoading) {
      setIsMenuOpen(false);
    }
  }, [isDeleteLoading, isBlockLoading, isReportLoading]);

  const handleMenuClick = async(callback?: () => void) => {
    if (callback) {
      await callback();
    }
    // Don't auto-close menu for delete action to show loading state
    // Menu will close automatically when loading completes
    if (callback !== onDelete) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 더보기 버튼 */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isDeleteLoading || isBlockLoading || isReportLoading}
        className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
          isDeleteLoading || isBlockLoading || isReportLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-20'
        }`}
        aria-label="더보기 메뉴"
      >
        <MoreIcon className='w-6 h-6'/>
      </button>

      {/* 더보기 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`absolute top-8 right-0 bg-white rounded-xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] w-[106px] z-50`}
        >
          <div className={`flex flex-col gap-y-2 p-4 ${isMobile?'text-med-14':'text-med-16'}`}>
            {isMine ? (
              // 작성자 본인 메뉴
              <>
                <button
                  type="button"
                  className="flex text-gray-90 rounded-sm text-left hover:text-hover transition-colors"
                  onClick={() => handleMenuClick(onEdit)}
                >
                  수정하기
                </button>
                <button
                  type="button"
                  disabled={isDeleteLoading}
                  className={`flex rounded-sm text-left transition-colors ${
                    isDeleteLoading
                      ? 'text-gray-50 cursor-not-allowed'
                      : 'text-gray-90 hover:text-hover'
                  }`}
                  onClick={() => handleMenuClick(onDelete)}
                >
                  {isDeleteLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-gray-50 border-t-transparent rounded-full animate-spin"></div>
                      삭제 중...
                    </div>
                  ) : (
                    '삭제하기'
                  )}
                </button>
              </>
            ) : (
              // 다른 사용자 메뉴
              <>
                <button
                  type="button"
                  className="flex text-gray-90 rounded-sm text-left hover:text-hover transition-colors"
                  onClick={onSendMessage}
                >
                  쪽지 보내기
                </button>
                <button
                  type="button"
                  disabled={isBlockLoading}
                  className={`flex rounded-sm text-left transition-colors ${
                    isBlockLoading
                      ? 'text-gray-50 cursor-not-allowed'
                      : 'text-gray-90 hover:text-hover'
                  }`}
                  onClick={() => handleMenuClick(onBlockUser)}
                >
                  {isBlockLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-gray-50 border-t-transparent rounded-full animate-spin"></div>
                      차단 중...
                    </div>
                  ) : (
                    '차단하기'
                  )}
                </button>
                <button
                  type="button"
                  disabled={isReportLoading}
                  className={`flex rounded-sm text-left transition-colors ${
                    isReportLoading
                      ? 'text-gray-50 cursor-not-allowed'
                      : 'text-gray-90 hover:text-hover'
                  }`}
                  onClick={() => handleMenuClick(onReportUser)}
                >
                  {isReportLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-gray-50 border-t-transparent rounded-full animate-spin"></div>
                      신고 중...
                    </div>
                  ) : (
                    '신고하기'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}