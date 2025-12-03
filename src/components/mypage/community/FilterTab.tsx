import React from 'react';

export interface FilterTabOption {
  value: string;
  label: string;
}

interface FilterTabProps {
  options?: FilterTabOption[];
  counts?: number[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

const defaultOptions: FilterTabOption[] = [
  { value: 'SCRAPED', label: '나의 스크랩' },
  { value: 'LIKED', label: '내가 공감한' },
  { value: 'COMMENTED', label: '내가 쓴 댓글' },
  { value: 'POSTED', label: '내가 쓴 글' }
];

const defaultCounts: number[] = [301, 10, 4, 8];

const FilterTab: React.FC<FilterTabProps> = ({
  options = defaultOptions,
  counts = defaultCounts,
  selectedValue = 'scrap',
  onSelect,
  className = ""
}) => {
  const handleTabSelect = (value: string) => {
    onSelect?.(value);
  };

  return (
    <div
      className={`flex gap-0 items-stretch justify-start py-7 rounded-[20px] ${className}`}
      data-name="FilterTab"
    >
      {options.map((option, index) => (
        <React.Fragment key={option.value}>
          <button
            onClick={() => handleTabSelect(option.value)}
            className="flex-1 flex flex-col gap-1 items-center justify-start min-w-0 transition-colors hover:opacity-80"
          >
            <div
              className={`text-med-16 tracking-[0.0912px] leading-[22px] whitespace-nowrap ${
                option.value === selectedValue
                  ? 'text-click'
                  : 'text-gray-70'
              }`}
            >
              {option.label}
            </div>
            <div
              className={`text-semibold-22 leading-[28px] whitespace-nowrap ${
                option.value === selectedValue
                  ? 'text-click'
                  : 'text-gray-90'
              }`}
            >
              {counts[index] || 0}
            </div>
          </button>

          {/* 구분선 (마지막 항목 제외) */}
          {index < options.length - 1 && (
            <div className="bg-gray-40 w-px self-stretch" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FilterTab;