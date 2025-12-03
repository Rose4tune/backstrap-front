import FillButton from '@common/button/FillButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function FailPage() {
  const router = useRouter();
  const { errorMessage: rawErrorMessage, mentorUuid: rawMentorUuid } = router.query;
  const errorMessage = typeof rawErrorMessage === 'string' ? rawErrorMessage : '';
  const mentorUuid = typeof rawMentorUuid === 'string' ? rawMentorUuid : '';

  return (
    <div className="flex flex-1 flex-col w-full min-h-screen max-w-[550px] mx-auto">
      <div className="flex justify-center mt-[30%] mb-[10%]">
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width="120"
          height="120"
        />
      </div>
      <p className="text-semibold-16 text-gray-90 flex justify-center">
        결제를 실패했어요
      </p>
      <div className="text-semibold-16 text-gray-90 flex justify-center">
        {errorMessage}
      </div>
      <div className="flex flex-1 w-full px-10 mt-20">
        <FillButton
          size="Large"
          buttonStatus={'active'}
          onClick={() => router.push(`/mentoring/mentorlist/${mentorUuid}`)}
        >
          결제 화면으로 돌아가기
        </FillButton>
      </div>
    </div>
  );
}
