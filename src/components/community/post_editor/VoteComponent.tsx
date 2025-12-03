import React, { useState } from 'react';
import CloseIcon from '@assets/icons/community/close.svg';

interface VoteOption {
  id: string;
  text: string;
}

interface VoteComponentProps {
  isVisible: boolean;
  onClose?: () => void;
  onChange?: (voteData: VoteData) => void;
  initialData?: VoteData;
  readOnly?: boolean; // 읽기 전용 모드
}

interface VoteData {
  title: string;
  options: VoteOption[];
}

export default function VoteComponent({ isVisible, onClose, onChange, initialData, readOnly = false }: VoteComponentProps) {
  const [voteData, setVoteData] = useState<VoteData>({
    title: initialData?.title || '',
    options: initialData?.options || [
      { id: '1', text: '' },
      { id: '2', text: '' },
    ],
  });

  const updateVoteData = (newData: VoteData) => {
    setVoteData(newData);
    onChange?.(newData);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const newData = { ...voteData, title: e.target.value };
    updateVoteData(newData);
  };

  const handleOptionChange = (id: string, text: string) => {
    if (readOnly) return;
    const newData = {
      ...voteData,
      options: voteData.options.map(option =>
        option.id === id ? { ...option, text } : option
      ),
    };
    updateVoteData(newData);
  };

  const addOption = () => {
    if (readOnly) return;
    const newId = Date.now().toString();
    const newData = {
      ...voteData,
      options: [...voteData.options, { id: newId, text: '' }],
    };
    updateVoteData(newData);
  };

  const removeOption = (id: string) => {
    if (readOnly) return;
    if (voteData.options.length <= 2) return; // 최소 2개 옵션 유지
    const newData = {
      ...voteData,
      options: voteData.options.filter(option => option.id !== id),
    };
    updateVoteData(newData);
  };

  if (!isVisible) return null;

  return (
    <div className={`border-[1px] rounded-xl p-[18px] mt-4 relative ${
      readOnly ? 'border-gray-30 bg-gray-10' : 'border-gray-20'
    }`}>
      {readOnly && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-30 rounded text-xs text-gray-60">
          수정 불가
        </div>
      )}
      {/* 닫기 버튼 */}
      {onClose && !readOnly && (
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center hover:bg-gray-30 rounded-full transition-colors"
          aria-label="투표 닫기"
        >
          <CloseIcon className="w-6 h-6 text-gray-70"/>
        </button>
      )}

      {/* 투표 제목 */}
      <div className="mb-4">
        {readOnly ? (
          <div className="w-full text-med-16 text-gray-70 leading-[22px] tracking-[0.0912px] py-1">
            {voteData.title || '투표 제목 없음'}
          </div>
        ) : (
          <input
            type="text"
            value={voteData.title}
            onChange={handleTitleChange}
            placeholder="투표 이름"
            className="w-full text-med-16 text-gray-70 bg-transparent border-none outline-none placeholder-gray-300 leading-[22px] tracking-[0.0912px]"
          />
        )}
      </div>

      {/* 투표 옵션들 */}
      <div className="space-y-3">
        {voteData.options.map((option, index) => (
          <div key={option.id} className={`flex items-center gap-3 rounded-xl p-3 ${
            readOnly ? 'bg-gray-30' : 'bg-gray-20'
          }`}>
            {readOnly ? (
              <div className="flex-1 text-med-14 text-gray-50 leading-[18px] py-1">
                {option.text || `항목 ${index + 1}`}
              </div>
            ) : (
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`항목 ${index + 1}`}
                className="flex-1 text-med-14 text-gray-50 bg-transparent border-none outline-none placeholder-gray-300 leading-[18px]"
              />
            )}
            {!readOnly && voteData.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(option.id)}
                className="w-5 h-5 flex items-center justify-center hover:bg-gray-30 rounded-full transition-colors"
                aria-label={`항목 ${index + 1} 제거`}
              >
                <CloseIcon className="w-3 h-3 text-gray-40" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 항목 추가 버튼 */}
      {!readOnly && (
        <button
          type="button"
          onClick={addOption}
          className="mt-4 text-bold-14 text-gray-50 hover:text-normal transition-colors leading-[18px]"
        >
          + 항목 추가
        </button>
      )}
    </div>
  );
}