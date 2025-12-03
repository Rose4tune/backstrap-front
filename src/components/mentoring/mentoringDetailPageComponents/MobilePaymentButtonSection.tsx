import { Dispatch, SetStateAction } from 'react';
import { components } from 'src/types/api';

type MentorViewDto = components['schemas']['MentorViewDto'];
interface MobilePaymentButtonSection {
  mentor?: MentorViewDto | null;
  price: number;
  setIsPaymentOpen: Dispatch<SetStateAction<boolean>>;
}
export default function MobilePaymentButtonSection({
  mentor,
  price,
  setIsPaymentOpen
}: MobilePaymentButtonSection) {
  return (
    <div
      style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)' }}
      className="std:hidden max-w-[450px] mx-auto sticky flex bottom-0 bg-white px-[24px] pt-[16px] pb-[32px] justify-between z-[500]"
    >
      {/* 설명 및 가격 */}
      <div>
        <p className="text-semibold-12 text-gray-70">멘토링 1회권 (60분)</p>
        <div className="flex gap-[4px] items-center">
          {/* Todo: 로그인 여부, 쿠폰 소유 여부에 따라 할인가 띄우기 */}
          {mentor?.originPrice !== price && (
            <p className="text-semibold-16 text-gray-50 line-through">
              {mentor?.originPrice?.toLocaleString() + '원'}
            </p>
          )}
          <p className="text-bold-16 text-gray-90">{price?.toLocaleString() + '원'}</p>
        </div>
      </div>
      <button
        onClick={() => setIsPaymentOpen(true)}
        className="bg-normal px-[28px] py-[12px] text-white text-bold-16 rounded-[12px]"
      >
        신청하기
      </button>
    </div>
  );
}
