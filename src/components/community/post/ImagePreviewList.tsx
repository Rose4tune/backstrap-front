import React, { useState, useRef, useEffect } from 'react';
import ImageModal from './ImageModal';

interface ImagePreviewListProps {
  images: string[];
  className?: string;
}

export default function ImagePreviewList({ images, className = '' }: ImagePreviewListProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll state management
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Handle scroll navigation
  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Initialize scroll state and add event listeners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Initial state
    updateScrollButtons();

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    
    // Add resize listener to handle window size changes
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }
  if(images.length===1) {
    return (
      <>
          <div
            className="flex cursor-pointer group"
            onClick={() => handleImageClick(0)}
          >
              <img
                src={images[0]}
                alt={`이미지`}
              />
          </div>
          {/* 이미지 모달 */}
        <ImageModal
          isOpen={isModalOpen}
          images={images}
          currentIndex={currentImageIndex}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
          altText="게시글 이미지"
        />
      </>
    )
  }
  else return (
    <div className={className}>
      {/* WebKit 스크롤바 숨김을 위한 스타일 */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}
      </style>

      {/* 정사각형 미리보기 가로 리스트 */}
      <div className='relative mb-4'>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='이전 이미지들 보기'
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105'
            aria-label='다음 이미지들 보기'
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Scrollable content */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative cursor-pointer group"
            onClick={() => handleImageClick(index)}
          >
            {/* 정사각형 이미지 컨테이너 */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={image}
                alt={`이미지 ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>

            {/* 호버 효과 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* 이미지 개수 표시 */}
      {/* {images.length > 1 && (
        <div className="text-xs text-gray-500 mb-4">
          이미지 {images.length}개
        </div>
      )} */}

      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isModalOpen}
        images={images}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
        altText="게시글 이미지"
      />
    </div>
  );
}