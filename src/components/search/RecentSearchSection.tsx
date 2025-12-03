import React from 'react';
import { RecentSearchItem } from './SearchPopup.types';

interface RecentSearchSectionProps {
  recentSearches: RecentSearchItem[];
  onDeleteAll: () => void;
  onDeleteItem: (id: string) => void;
  onSearchClick: (keyword: string) => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function RecentSearchSection({
  recentSearches,
  onDeleteAll,
  onDeleteItem,
  onSearchClick
}: RecentSearchSectionProps) {
  return (
    <div className="basis-0 flex flex-col gap-3 grow min-w-px px-6 py-3">
      {/* Title */}
      <div className="flex items-center justify-between w-full">
        <div className="text-bold-16 text-gray-90">
          최근 검색어
        </div>
        <button
          onClick={onDeleteAll}
          className="text-reg-14 text-gray-50 hover:text-gray-70 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      {/* Recent Search List */}
      <div className="flex flex-col gap-2 w-full">
        {recentSearches.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-reg-14 text-gray-50">
              최근 검색어가 없습니다
            </div>
          </div>
        ) : (
          recentSearches.map((item) => (
            <div key={item.id} className="flex items-center justify-between w-full">
              <button
                onClick={() => onSearchClick(item.keyword)}
                className="text-reg-14 text-gray-90 hover:text-black transition-colors text-left truncate"
              >
                {item.keyword}
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-gray-50 hover:text-gray-70 transition-colors"
                aria-label={`${item.keyword} 삭제`}
              >
                <CloseIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}