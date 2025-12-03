import React, { useEffect, useCallback, useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  altText?: string;
}

export default function ImageModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
  altText = '이미지'
}: ImageModalProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 네비게이션 함수들
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
    }
  }, [onClose, goToPrevious, goToNext]);

  // 터치 제스처 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // 배경 클릭으로 모달 닫기 (데스크톱 친화적)
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 클릭된 요소가 배경 div인 경우에만 닫기
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 모달 컨테이너 클릭 시 이벤트 전파 방지
  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 cursor-pointer"
      style={{zIndex:2147483649}}
      onClick={handleBackgroundClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 뷰어"
    >
      {/* 모달 컨테이너 */}
      <div
        className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center cursor-default"
        onClick={handleModalClick}
      >
        {/* 상단 닫기 버튼 */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="이미지 모달 닫기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button> */}

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 bg-black bg-opacity-60 text-white rounded-full flex items-center gap-2 hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="이미지 모달 닫기"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="text-sm font-medium">닫기</span>
        </button>

        {/* 이전 버튼 */}
        {hasPrevious && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-0 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all focus:outline-none"
            aria-label="이전 이미지"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
        )}

        {/* 다음 버튼 */}
        {hasNext && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-0 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all"
            aria-label="다음 이미지"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        )}

        {/* 이미지 카운터 */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 이미지 */}
        <img
          src={currentImage}
          alt={`${altText} ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}