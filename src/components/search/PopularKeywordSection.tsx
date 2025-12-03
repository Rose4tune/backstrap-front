import React, { useState, useEffect } from 'react';
import { getAllKeywords } from 'src/apis/search/getAllKeywords';
import { components } from 'src/types/api';
import { PopularKeywordItem } from './SearchPopup.types';

type KeywordViewDto = components['schemas']['KeywordViewDto'];

interface PopularKeywordSectionProps {
  onSearchClick: (keyword: string) => void;
  accessToken?: string;
}

const NewBadge = () => (
  <div className="bg-red text-white text-[10px] font-bold px-1 py-0.5 rounded text-center leading-none">
    N
  </div>
);

export default function PopularKeywordSection({
  onSearchClick,
  accessToken
}: PopularKeywordSectionProps) {
  const [popularKeywords, setPopularKeywords] = useState<PopularKeywordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPopularKeywords = async () => {

      setLoading(true);
      setError('');

      try {
        const response = await getAllKeywords();

        if (response.success && response.data) {
          // Transform API data to popular keywords format
          const transformedKeywords: PopularKeywordItem[] = response.data
            .slice(0, 10) // Limit to top 10
            .map((item: KeywordViewDto, index: number) => ({
              id: item.id || index,
              keyword: item.keyword || '',
              rank: index + 1,
              isNew: index >= 4 // Mark items 5+ as "new" for demo
            }))
            .filter(item => item.keyword); // Filter out empty keywords

          setPopularKeywords(transformedKeywords);
        } else {
          setError(response.messages || '키워드를 불러올 수 없습니다');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다');
        console.error('Failed to fetch popular keywords:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularKeywords();
  }, [accessToken]);

  const displayKeywords = popularKeywords;

  const renderKeywordList = (startIndex: number, count: number) => {
    const keywords = displayKeywords.slice(startIndex, startIndex + count);

    return (
      <div className="flex flex-col gap-3 w-[150px]">
        {keywords.map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            <div className="text-bold-14 text-gray-90 text-left w-5 leading-[18px]">
              {String(item.rank).padStart(2, '0')}
            </div>
            <button
              onClick={() => onSearchClick(item.keyword)}
              className="text-med-14 text-black hover:text-gray-70 transition-colors text-left text-nowrap leading-[20px] truncate"
            >
              {item.keyword}
            </button>
            {item.isNew && <NewBadge />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="basis-0 flex flex-col gap-3 grow min-w-px px-6 py-3">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="text-bold-16 text-black leading-[20px]">
          실시간 인기 키워드
        </div>
        <div className="text-med-12 text-gray-70 leading-[16px]">
          가방끈에서 가장 많이 보고있어요
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-between w-full">
        {loading ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="text-med-14 text-gray-60">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="text-med-14 text-red">{error}</div>
          </div>
        ) : displayKeywords.length === 0 ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="text-med-14 text-gray-60">인기 키워드가 없습니다</div>
          </div>
        ) : (
          <>
            {/* Left column (1-3) */}
            {renderKeywordList(0, 3)}

            {/* Right column (4-5) */}
            {renderKeywordList(3, 2)}
          </>
        )}
      </div>
    </div>
  );
}