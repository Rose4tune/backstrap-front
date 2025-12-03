import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import clsx from 'clsx';

// SVG Icons
import PinIcon from '@assets/icons/community/pin.svg';
import NewIcon from '@assets/icons/community/new.svg';
import BestIcon from '@assets/icons/community/best.svg';
import FireIcon from '@assets/icons/community/fire.svg';

type Category = components['schemas']['FAGroupViewDto'];

interface CategoryItemProps {
  category: Category;
  onPinClick: (isBookmarked: boolean, uuid: string) => Promise<void>;
  onClick: () => void;
}

function CategoryItem({ category, onPinClick, onClick }: CategoryItemProps) {

  const getPinIcon = () => {
    if (category.isPinned) {
      return <PinIcon className="w-5 h-5 text-red" />;
    } else if (category.isBookmarkedByMe) {
      return <PinIcon className="w-5 h-5 text-normal" />;
    } else {
      return <PinIcon className="w-5 h-5 text-gray-50" />;
    }
  };

  return (
    <div className="flex flex-row w-full pl-0 pr-5">
      <div
        className="cursor-pointer p-1"
        onClick={(e) => {
          e.stopPropagation();
          onPinClick(category.isBookmarkedByMe || false, category.uuid || '');
        }}
      >
        {getPinIcon()}
      </div>
      <div
        className="flex flex-row gap-2 items-center flex-1 cursor-pointer"
        onClick={onClick}
      >
        <span className="text-semibold-14 text-gray-90 flex-1">
          {category.name}
        </span>
        {category.hasNewBoard && (
          <NewIcon className="w-3 h-3 text-red" />
        )}
      </div>
    </div>
  );
}

interface CommunityListModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  loading?: boolean;
  onPinClick?: (isBookmarked: boolean, uuid: string) => Promise<void>;
  className?: string;
}

export default function CommunityListModal({
  isOpen,
  onClose,
  categories = [],
  loading = false,
  onPinClick,
  className
}: CommunityListModalProps) {

  // Bottom sheet states
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const router = useRouter();

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    if (category.uuid) {
      router.replace(`/community/${category.uuid}?name=${category.name}`);
      onClose();
    }
  };

  // Handle overlay click to close modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // Only allow dragging down
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 150; // 150px threshold for closing

    if (translateY > threshold) {
      setIsVisible(false);
      // Delay the actual close to allow animation
      setTimeout(() => {
        onClose();
        setTranslateY(0);
      }, 300);
    } else {
      // Snap back to original position
      setTranslateY(0);
    }

    setIsDragging(false);
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentY = e.clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 150;

    if (translateY > threshold) {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        setTranslateY(0);
      }, 300);
    } else {
      setTranslateY(0);
    }

    setIsDragging(false);
  };

  // Global mouse events for desktop
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const currentY = e.clientY;
      const deltaY = currentY - startYRef.current;

      if (deltaY > 0) {
        setTranslateY(deltaY);
      }
    };

    const handleGlobalMouseUp = () => {
      const threshold = 150;

      if (translateY > threshold) {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
          setTranslateY(0);
        }, 300);
      } else {
        setTranslateY(0);
      }

      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, translateY, onClose]);

  // Handle modal open/close and keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Trigger entrance animation
      setTimeout(() => {
        setIsVisible(true);
      }, 10);

      // Focus modal for accessibility after animation
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 350);
    } else {
      document.body.style.overflow = 'unset';
      setIsVisible(false);
      // Reset position when closed
      setTranslateY(0);
      setIsDragging(false);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={clsx("fixed inset-0 z-50", className)} style={{zIndex:2147}}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={clsx(
          "absolute inset-0 bg-black transition-opacity duration-300 ease-out",
          isVisible ? "bg-opacity-40" : "bg-opacity-0"
        )}
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={clsx(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] focus:outline-none"
        )}
        style={{
          transform: isVisible
            ? `translateY(${translateY}px)`
            : 'translateY(100%)',
          transition: isDragging
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="w-[60px] h-1 bg-gray-30 rounded-xl" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 pt-3">
          <h2 id="modal-title" className="text-semibold-16 text-black leading-6">
            게시판 목록
          </h2>
          <p className="text-reg-12 text-gray-60 leading-4 mt-1">
            고정하고 싶은 게시끈은 옆 아이콘을 선택해주세요
          </p>
        </div>

        {/* Content */}
        <div className="px-5 pb-28 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <CategoryItem
                  key={`${category.uuid}-${index}`}
                  category={category}
                  onPinClick={onPinClick || (() => Promise.resolve())}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}