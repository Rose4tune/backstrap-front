import Title from '@common/Title';
import MentorCalendarIcon from 'src/assets/icons/mentoring/[renewal]MentoringCalendarIcon.svg';
import MentorGlassesIcon from 'src/assets/icons/mentoring/[renewal]MentoringReadingGlassesIcon.svg';
import MentorSpringIcon from 'src/assets/icons/mentoring/[renewal]MentoringSpringIcon.svg';
import MentorDesktopIcon from 'src/assets/icons/mentoring/[renewal]MentoringDesktopIcon.svg';

export default function DesktopMentroingProcessSection() {
  return (
    <div className="flex w-full flex flex-col gap-[8px] px-[80px]">
      <div className="text-bold-24 text-gray-90 text-center mb-[32px]">
        멘토링, 어떻게 진행되나요?
      </div>
      <div className="flex gap-[20px]">
        {/* 1번 카드 */}
        <div
          className="flex flex-col w-full px-[32px] py-[40px] bg-gray-20 rounded-[20px]"
          style={{ height: '302px' }}
        >
          <div className="flex flex-col gap-[4px] mb-[54px]">
            <p className="text-gray-60 text-semibold-22">01</p>
            <p className="text-gray-90 text-bold-20">멘토 확인</p>
            <p className="whitespace-pre-line text-med-16 text-gray-70">
              {
                "상담을 받고 싶은 멘토의 정보를 살펴보고 ‘멘토링 신청하기' 버튼을 눌러주세요"
              }
            </p>
          </div>
          <div className="flex flex-1 justify-end items-end">
            <MentorGlassesIcon width={60} height={60} />
          </div>
        </div>
        {/* 2번 카드 */}
        <div
          className="flex  flex-col w-full px-[32px] py-[40px] bg-gray-20 rounded-[20px]"
          style={{ height: '302px' }}
        >
          <div className="flex flex-col gap-[4px] mb-[54px]">
            <p className="text-gray-60 text-semibold-22">02</p>
            <p className="text-gray-90 text-bold-20">일정 선택 및 결제</p>
            <p className="whitespace-pre-line text-med-16 text-gray-70">
              {'원하는 날짜와 시간을 선택하고\n결제를 완료해주세요'}
            </p>
          </div>
          <div className="flex flex-1 justify-end items-end">
            <MentorCalendarIcon width={60} height={60} />
          </div>
        </div>
        {/* 3번 카드 */}
        <div
          className="flex  flex-col w-full px-[32px] py-[40px] bg-gray-20 rounded-[20px]"
          style={{ height: '302px' }}
        >
          <div className="flex flex-col gap-[4px] mb-[54px]">
            <p className="text-gray-60 text-semibold-22">03</p>
            <p className="text-gray-90 text-bold-20">질문지 확인</p>
            <p className="whitespace-pre-line text-med-16 text-gray-70">
              {
                '영업일 1일 이내에 입력하신 연락처로 확정된 일정, 추천 질문들이 담긴 질문지, 그리고 멘토링 URL이 전달 되어요.'
              }
            </p>
          </div>
          <div className="flex flex-1 justify-end items-end">
            <MentorSpringIcon width={60} height={60} />
          </div>
        </div>
        {/* 4번 카드 */}
        <div
          className="flex  flex-col w-full px-[32px] py-[40px] bg-gray-20 rounded-[20px]"
          style={{ height: '302px' }}
        >
          <div className="flex flex-col gap-[4px] mb-[54px]">
            <p className="text-gray-60 text-semibold-22">04</p>
            <p className="text-gray-90 text-bold-20">링크 접속 및 멘토링 진행</p>
            <p className="whitespace-pre-line text-med-16 text-gray-70">
              {'예약한 일정에 맞춰 멘토링 URL로 접속해, 1시간 동안 멘토링을 받아보세요.'}
            </p>
          </div>
          <div className="flex flex-1 justify-end items-end">
            <MentorDesktopIcon width={60} height={60} />
          </div>
        </div>
      </div>
    </div>
  );
}
