import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import MentroingPopup from 'src/assets/images/mentoring/[renewal]MentroingPopup.png';
import DeleteIcon from 'src/assets/icons/common/[renewal]DeleteIcon.svg';
import DownloadIcon from 'src/assets/icons/common/[renewal]DownloadIcon.svg';
import mixpanel from 'mixpanel-browser';

interface MentoringCouponPopupProps {
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
  issueCoupon: () => Promise<void>;
  notSeeToday: () => void;
  isCouponIssueLoading: boolean;
}

export default function MentoringCouponPopup({
  setIsPopupOpen,
  issueCoupon,
  notSeeToday,
  isCouponIssueLoading
}: MentoringCouponPopupProps) {
  return (
    <>
      <div className="fixed inset-0 bg-dim z-[9999]"></div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[346px]">
        {/* 이미지 body */}
        <Image src={MentroingPopup} width={346} alt="팝업" className="relative"></Image>
        {/* 쿠폰 받기 버튼 */}
        {/* 닫기 버튼 */}
        <button
          className="absolute top-[16px] right-[16px]"
          onClick={() => {
            mixpanel.track('click_out', { view: 'mentoring_popup' });
            setIsPopupOpen(false);
          }}
        >
          <DeleteIcon width={20} height={20} className="text-white" />
        </button>
        <button
          onClick={() => {
            mixpanel.track('click_get_coupon', { view: 'mentoring_popup' });
            issueCoupon();
          }}
          className="absolute bottom-[52px] left-[24px] flex justify-center items-center gap-[8px] w-[298px] h-[52px] bg-black rounded-[16px] text-semibold-16 text-white"
          disabled={isCouponIssueLoading}
        >
          <span>쿠폰 받기</span>
          <span>
            <DownloadIcon width={20} height={20} className="text-white" />
          </span>
        </button>
        {/* 오늘 그만 보기 버튼 */}
        <button
          className="absolute bottom-[20px] opacity-[50%] left-1/2 -translate-x-1/2 text-semibold-14 text-white opacity-[50%]"
          onClick={() => {
            mixpanel.track('click_dont_show', { view: 'mentoring_popup' });
            notSeeToday();
          }}
        >
          오늘 그만 보기
        </button>
      </div>
    </>
  );
}
