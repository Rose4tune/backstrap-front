import React from 'react';
import WarningIcon from '@assets/icons/community/warning.svg';
import { useMediaQuery } from '@mui/material';

interface VerificationRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export default function VerificationRequiredPopup({
  isOpen,
  onClose,
  onClick,
  title = "제목",
  description = "내용에 대해서 두 줄 이상으로 작성해주세요",
  actionText = "액션 이름"
}: VerificationRequiredPopupProps) {
  const isMobile = useMediaQuery('(max-width:550px)');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center"
    style={{zIndex:2147483649}}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Popup */}
      <div className={`relative bg-white rounded-[20px] ${!isMobile?'w-[375px]':'w-[335px]'} max-w-[90vw]`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-6 h-6 flex items-center justify-center"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-gray-60"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-start pt-9 pb-0 px-0 gap-2">
          {/* Warning Icon */}
          <WarningIcon className={`${!isMobile?'w-10 h-10':'w-10 h-10'}`}/>

          {/* Title */}
          <h2 className={`${!isMobile?'text-bold-24':'text-bold-16'} text-black leading-[32px] tracking-[-0.48px]`}>
            {title}
          </h2>

          {/* Description */}
          <p className="text-[14px] font-medium text-gray-70 leading-[20px] text-center px-4">
            {description}
          </p>

          {/* Action Button */}
          <div className="w-full rounded-bl-[20px] rounded-br-[20px] overflow-hidden">
            <div className="px-5 py-[14px]">
              <button
                onClick={onClick}
                className="w-full h-[52px] bg-normal rounded-2xl flex items-center justify-center"
              >
                <span className="text-[16px] font-semibold text-white leading-[24px]">
                  {actionText}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}