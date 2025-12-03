import DeleteIcon from 'src/assets/icons/common/[renewal]DeleteIcon.svg';
import CautionIcon from 'src/assets/icons/common/[renewal]CautionIcon.svg';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ERROR_POPUP_TITLE_MAP } from 'src/constants/errorPopupMessage.constant';

interface ErrorPopupProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
}

export default function ErrorPopup({ isOpen, setIsOpen, errorMessage }: ErrorPopupProps) {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 팝업오픈시 스크롤 막기
    } else {
      document.body.style.overflow = ''; // 원래대로 복구
    }

    // 컴포넌트 언마운트 시 복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-dim z-[5000]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[36px] px-[32px] rounded-[20px] w-[327px]">
        <div
          className="absolute top-[16px] right-[16px] cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <DeleteIcon width={24} height={24} className="text-gray-70" />
        </div>
        <div className="flex flex-col items-center gap-[8px] text-center">
          <CautionIcon width={40} height={40} />
          <p className="text-bold-24 text-black">{ERROR_POPUP_TITLE_MAP[errorMessage]}</p>
          <p className="text-med-14 text-gray-90">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
