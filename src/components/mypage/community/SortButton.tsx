import React, { useState, useRef, useEffect } from 'react';

// SVG 아이콘을 인라인으로 정의
const ArrowDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="8"
    height="13"
    viewBox="0 0 8 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-200 ${isOpen ? 'rotate-[270deg]' : 'rotate-[90deg]'}`}
  >
    <path
      d="M1 1L6 6.5L1 12"
      stroke="#818791"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface SortOption {
  value: string;
  label: string;
}

interface SortButtonProps {
  options?: SortOption[];
  selectedValue?: string;
  onSelect?: (value: any) => void;
  className?: string;
}

const defaultOptions: SortOption[] = [
  { value: 'RECENT', label: '최신순' },
  { value: 'POPULAR', label: '인기순' },
  { value: 'LIKE', label: '좋아요순' },
  { value: 'COMMENT', label: '댓글순' },
];

const SortButton: React.FC<SortButtonProps> = ({
  options = defaultOptions,
  selectedValue = 'RECENT',
  onSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue) || options[0];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: SortOption) => {
    onSelect?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className={`bg-gray-20 flex gap-2 items-center justify-center px-5 py-3 rounded-2xl transition-colors hover:bg-gray-30 ${
          isOpen ? 'bg-gray-30' : ''
        }`}
        data-name="SortButton"
      >
        <span className="text-semibold-16 text-gray-70 leading-6 whitespace-nowrap">
          {selectedOption.label}
        </span>
        <div className="flex items-center justify-center w-5 h-5">
          <ArrowDownIcon isOpen={isOpen} />
        </div>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-30 rounded-xl shadow-lg z-50 min-w-full overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className={`w-full px-5 py-2 text-left text-semibold-16 hover:bg-gray-20 transition-colors ${
                option.value === selectedValue
                  ? 'text-gray-70'
                  : 'text-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortButton;