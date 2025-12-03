import React from 'react';
import RecentSearchSection from './RecentSearchSection';
import PopularKeywordSection from './PopularKeywordSection';
import { SearchPopupProps } from './SearchPopup.types';
import useRecentSearches from 'src/hooks/useRecentSearches';
import { useMediaQuery } from '@mui/material';

export default function SearchPopup({
  onClose,
  onSearch,
  accessToken
}: SearchPopupProps) {
  const isMobile = useMediaQuery('(max-width:550px)');
  const {
    recentSearches,
    deleteRecentSearch,
    clearAllRecentSearches,
    addRecentSearch
  } = useRecentSearches();

  const handleSearchClick = (keyword: string) => {
    addRecentSearch(keyword);
    onSearch?.(keyword);
    onClose?.();
  };

  if(!isMobile) return (
    <div className="bg-white flex items-start justify-start pb-6 pt-4 px-3 rounded-2xl shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] w-[994px] max-w-2xl">
      <div className="flex w-full">
        {/* Left Side - Recent Searches */}
        <RecentSearchSection
          recentSearches={recentSearches}
          onDeleteAll={clearAllRecentSearches}
          onDeleteItem={deleteRecentSearch}
          onSearchClick={handleSearchClick}
        />

        {/* Right Side - Popular Keywords */}
        <PopularKeywordSection
          onSearchClick={handleSearchClick}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
  return (
    <div className="bg-white flex items-start justify-start">
      <div className="flex w-full flex-col">
        {/* Left Side - Recent Searches */}
        <RecentSearchSection
          recentSearches={recentSearches}
          onDeleteAll={clearAllRecentSearches}
          onDeleteItem={deleteRecentSearch}
          onSearchClick={handleSearchClick}
        />

        {/* Right Side - Popular Keywords */}
        <PopularKeywordSection
          onSearchClick={handleSearchClick}
          accessToken={accessToken}
        />
      </div>
    </div>
  )
}