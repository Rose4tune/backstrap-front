import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import HamburgerIcon from '@assets/icons/header/hamburger.svg';
import { components } from 'src/types/api';
import getBoardGroupAll from 'src/apis/community/getBoardGroupAll';
import bookmarkBoardGroup from 'src/apis/community/bookmarkBoardGroup';
import unBookmarkBoardGroup from 'src/apis/community/unBookmarkBoardGroup';
import { COOKIE_NS, COOKIE_NS_APPLE_OAUTH, COOKIE_NS_KAKAO_OAUTH } from '@constants/common/cookie.constant';
import clsx from 'clsx';
import { CategoryMobile } from './CategoryMobile';
import CommunityListModal from './CommunityListModal';

type Category = components['schemas']['FAGroupViewDto'];

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onClick: (category: Category) => void;
}

function CategoryTab({ category, isActive, onClick }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(category)}
      className="flex flex-col gap-1 items-start justify-center p-0 flex-shrink-0 min-w-max transition-colors duration-200"
    >
      <span
        className={clsx(
          'whitespace-nowrap transition-colors duration-200',
          isActive
            ? 'text-bold-14 text-gray-90'
            : 'text-semibold-14 text-gray-50'
        )}
      >
        {category.name}
      </span>
      <div
        className={clsx(
          'h-0.5 w-full transition-opacity duration-200',
          isActive
            ? 'bg-gray-90 opacity-100'
            : 'bg-gray-30 opacity-0'
        )}
      />
    </button>
  );
}

interface CommunityNavigatorMobileProps {
  onMenuToggle?: () => void;
  className?: string;
  type?: 'slide'|'dropdown',
  children?: ReactNode,
  categoryUuid?:string,
  sortType?:"LIKE" | "POPULAR" | "RECENT" | "MONTHLY_POPULAR" | "MONTHLY_COMMENT_POPULAR" | "MONTHLY_IF_POPULAR" | "MONTHLY_VOTE_POPULAR" | "COMMENT";
}

export default function CommunityNavigatorMobile({
  onMenuToggle,
  className = '',
  type = 'slide',
  children,
  categoryUuid,
  sortType = 'RECENT'
}: CommunityNavigatorMobileProps) {
  const [communityList, setCommunityList] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [cookies] = useCookies();
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

  // Fetch community categories
  const fetchCommunityList = async () => {
    try {
      setIsLoading(true);
      const response = await getBoardGroupAll(accessToken);

      if (response.data) {
        // Add "전체" as the first category
        const allCategory: Category = {
          uuid: 'all',
          name: '전체',
          isPinned: false,
          isBookmarkedByMe: false,
          hasNewBoard: false
        };
        // Sort categories: pinned → bookmarked → basic
        const pinnedList: Category[] = [];
        const bookmarkedList: Category[] = [];
        const basicList: Category[] = [];

        response.data.forEach((category) => {
          if (category.isPinned) pinnedList.push(category);
          else if (category.isBookmarkedByMe) bookmarkedList.push(category);
          else basicList.push(category);
        });
        setCommunityList([allCategory, ...response.data]);
        setCategories([...pinnedList, ...bookmarkedList, ...basicList]);

        if(categoryUuid) setActiveCategory({
            uuid: categoryUuid,
            name: '',
            isPinned: false,
            isBookmarkedByMe: false,
            hasNewBoard: false
        })
        else setActiveCategory(allCategory);
      }
    } catch (error) {
      console.error('Failed to fetch community list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);

    // // Navigate to appropriate route
    // if (category.uuid === 'all') {
    //   router.push('/community');
    // } else {
    //   router.push(`/community/${category.uuid}`);
    // }
  };

  // Handle hamburger menu click to open modal
  const handleMenuClick = () => {
    setIsCommunityModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsCommunityModalOpen(false);
  };

  // Handle banner click
  const handleBannerClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle categories change from modal
  const handleCategoriesChange = (newCategories: Category[]) => {
    setCategories(newCategories);

    // Update communityList as well
    const allCategory: Category = {
      uuid: 'all',
      name: '전체',
      isPinned: false,
      isBookmarkedByMe: false,
      hasNewBoard: false
    };
    setCommunityList([allCategory, ...newCategories]);
  };

  // Handle pin/bookmark click from modal
  const handlePinClick = async (isBookmarked: boolean, uuid: string) => {
    try {
      if (isBookmarked) {
        await unBookmarkBoardGroup(uuid, accessToken);
      } else {
        await bookmarkBoardGroup(uuid, accessToken);
      }

      // Refresh categories
      await fetchCommunityList();
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  useEffect(() => {
    fetchCommunityList();
  }, [accessToken, categoryUuid]);

  // Update active category when route changes
  useEffect(() => {
    if (communityList.length > 0) {
      const currentPath = router.asPath;
      if (currentPath === '/community' || currentPath === '/community/') {
        const allCategory = communityList.find(cat => cat.uuid === 'all');
        setActiveCategory(allCategory || null);
      } else if (currentPath.startsWith('/board/')) {
        const boardId = currentPath.split('/board/')[1];
        const matchedCategory = communityList.find(cat => cat.uuid === boardId);
        setActiveCategory(matchedCategory || communityList[0]);
      }
    }
  }, [router.asPath, communityList]);

  // if (isLoading) {
  //   return (
  //     <div className={`bg-white pt-5 px-5 ${className}`}>
  //       <div className="flex flex-row items-center gap-3">
  //         <div className="w-6 h-6 bg-gray-30 animate-pulse rounded" />
  //         <div className="h-4 bg-gray-30 animate-pulse rounded w-12" />
  //         <div className="h-4 bg-gray-30 animate-pulse rounded w-16" />
  //         <div className="h-4 bg-gray-30 animate-pulse rounded w-20" />
  //       </div>
  //     </div>
  //   );
  // }
  if(type==='dropdown') return (
    <div className={`bg-white ${className}`}>
        <div onClick={handleMenuClick}>
            {children}
        </div>
      <CategoryMobile
        uuid={activeCategory?.uuid||''}
        sortType={sortType}
      />
      {/* Community List Modal */}
      <CommunityListModal
        isOpen={isCommunityModalOpen}
        onClose={handleModalClose}
        categories={categories}
        loading={isLoading}
        onPinClick={handlePinClick}
      />
    </div>
  )
  else return (
    <div className={`bg-white ${className}`}>
      <div className="flex flex-row items-center w-full">
        <div
        className="flex flex-row gap-3 items-center justify-start pb-0 pt-5 pl-5 pr-3"
        >
            {/* Hamburger Menu Icon */}
            <button
                type="button"
                onClick={handleMenuClick}
                className="shrink-0 w-6 h-6 flex items-center justify-center transition-colors duration-200 hover:bg-gray-20 rounded"
                aria-label="메뉴 열기"
            >
                <HamburgerIcon className="w-full h-full text-gray-90" />
            </button>

        </div>
        <div
          ref={scrollContainerRef}
          className="pb-0 pt-5 pr-5 overflow-x-auto w-full scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex flex-row gap-3 items-center justify-start w-max">
            {/* Category Tabs */}
            {communityList.filter((category)=>category.isPinned||category.isBookmarkedByMe||category.uuid==='all').map((category, index) => (
              <CategoryTab
                key={category.uuid || index}
                category={category}
                isActive={activeCategory?.uuid === category.uuid}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </div>
      <CategoryMobile
        uuid={activeCategory?.uuid||''}
        sortType={sortType}
      />

      {/* Community List Modal */}
      <CommunityListModal
        isOpen={isCommunityModalOpen}
        onClose={handleModalClose}
        categories={categories}
        loading={isLoading}
        onPinClick={handlePinClick}
      />
    </div>
  );
}