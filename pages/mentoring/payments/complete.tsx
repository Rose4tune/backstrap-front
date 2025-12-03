import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import DeleteIcon from 'src/assets/icons/common/[renewal]DeleteIcon.svg';
import welcomeAnimation from '@public/assets/[renewal]welcome.json';
import Image from 'next/image';
import FillButton from '@common/button/FillButton';
import PageLayout from '@layouts/PageLayout';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';

export default function CompletePage() {
  const router = useRouter();
  const { mentorUuid: rawMentorUuid } = router.query;

  const mentorUuid = typeof rawMentorUuid === 'string' ? rawMentorUuid : '';
  const isMobile = useMediaQuery('(max-width:550px)');

  //mixpanel
  useEffect(() => {
    if (mentorUuid.length > 0) {
      mixpanel.track(`View_Mentoring_Done_${mentorUuid}`);
    }
  }, [mentorUuid]);

  return (
    isMobile ? (
      <div className="flex flex-col max-w-[550px] w-full mx-auto">
        {/* 헤더 */}
        <div className="flex px-[20px] pt-[53px] pb-[20px] border-b-[1px] border-gray-30">
          <div className="flex w-full justify-end">
            <button onClick={() => router.replace('/mentoring')}>
              <DeleteIcon width={20} height={20} className="text-gray-50" />
            </button>
            {/* Bookmark button */}
          </div>
        </div>
        <div className="flex flex-1 w-full flex-col pt-[12px] px-[20px] relative min-h-[500px]">
          <p className="text-bold-24 text-center text-black mb-[4px] mt-[80px]">
            멘토링 신청이 완료 되었어요!
          </p>
          <div className="text-gray-60 text-reg-16 mb-[24px] text-center">
            <p>결제 내역과 멘토링 프로세스는 카카오톡 알림톡과</p>
            <p>마이페이지에서 확인해주세요!</p>
          </div>
          <Lottie
            animationData={welcomeAnimation}
            className="absolute pointer-events-none left-1/2 top-[300px] -translate-y-1/2 -translate-x-1/2"
          />
          <div className="absolute w-[124px] h-[124px] mb-[32px] ml-[11.5px] left-1/2 -translate-x-1/2 top-[300px] -translate-y-1/2 ">
            <Image
              src="/images/[renewal]party.png"
              width={124}
              height={124}
              alt="환영합니다"
              className="absolute top-0 left-0"
            />
          </div>
          <div className="absolute top-[400px] left-1/2 -translate-x-1/2 flex flex-1 w-full mx-auto mt-[20px] px-[20px] max-w-[450px]">
            <FillButton
              onClick={() => {
                mixpanel.track('click_to_home', { view: 'mentoring_pay' });
                router.replace('/');
              }}
              buttonStatus="active"
              size="Large"
            >
              가방끈 홈으로 가기
            </FillButton>
          </div>
        </div>
      </div>
    ) : (
      <div className="max-w-[1920px] min-w-[1440px] w-full mx-auto">
        <div className="pt-[53px] w-full">
          <GlobalHeader />
        </div>
        <div className="flex flex-1 max-w-[550px] flex-col pt-[12px] px-[20px] relative min-h-[500px] mx-auto">
          <div className='flex flex-col w-full'>
            <p className="text-semibold-22 text-black mb-[4px]">결제가 완료 되었어요!</p>
            <div className="text-gray-60 text-reg-14 mb-[24px]">
              <p>결제 확인은 카카오톡 알림톡이나</p>
              <p>마이페이지에서 확인해보세요!</p>
            </div>
          </div>

          <Lottie
            animationData={welcomeAnimation}
            className="absolute pointer-events-none left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
          />
          <div className="absolute w-[124px] h-[124px] mb-[32px] ml-[11.5px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">
            <Image
              src="/images/[renewal]party.png"
              width={124}
              height={124}
              alt="환영합니다"
              className="absolute top-0 left-0"
            />
          </div>
          <div className='h-[320px]' />
          <div className='flex h-[62px] w-full px-[20px]'>
            <FillButton
              onClick={() => {
                mixpanel.track('click_to_home', { view: 'mentoring_pay' });
                router.replace('/');
              }}
              buttonStatus="active"
              size="Large"
            >
              가방끈 홈으로 가기
            </FillButton>
          </div>

        </div>
      </div>
    )
  );

}
