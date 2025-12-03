import { useEffect } from 'react';
import CautionIcon from 'src/assets/icons/common/[renewal]CautionIcon.svg';

interface MobileMessageActionPopupProps {
  isOpen: boolean;
  type: 'report' | 'block' | 'exit';
  onClose: () => void;
  onConfirm: () => void;
}

const MESSAGE_CONFIG = {
  report: {
    title: '사용자를 신고할까요?',
    description: '신고하면 철회할 수 없습니다.\n그래도 신고할까요?',
    confirmText: '신고하기',
  },
  block: {
    title: '사용자를 차단할까요?',
    description: '차단하면 철회할 수 없습니다.',
    confirmText: '차단하기',
  },
  exit: {
    title: '대화방을 나가실건가요?',
    description: '한번 나간 대화방은 돌아올 수 없습니다.',
    confirmText: '나가기',
  },
};

export default function MobileMessageActionPopup({
  isOpen,
  type,
  onClose,
  onConfirm,
}: MobileMessageActionPopupProps) {
  if (!isOpen) return null;

  const { title, description, confirmText } = MESSAGE_CONFIG[type];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-dim z-[5000] flex items-center justify-center">
      <div className="bg-white rounded-[20px] w-[327px] px-5 pt-[24px] pb-[20px] text-center relative">
        <CautionIcon width={40} height={40} className="mx-auto mb-[12px]" />
        <p className="text-bold-18 text-black whitespace-pre-line">{title}</p>
        <p className="text-med-14 text-gray-90 mt-[8px] whitespace-pre-line">
          {description}
        </p>

        <div className="flex gap-3 mt-[17px]">
          <button
            className="flex-1 py-3 rounded-[12px] bg-gray-20 text-gray-90 text-semibold-14"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 rounded-[12px] bg-red text-white text-mesemiboldd-14"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
