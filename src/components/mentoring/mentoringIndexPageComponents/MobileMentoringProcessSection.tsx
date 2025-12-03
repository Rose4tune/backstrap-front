import MentorCalendarIcon from 'src/assets/icons/mentoring/[renewal]MentoringCalendarIcon.svg';
import MentorGlassesIcon from 'src/assets/icons/mentoring/[renewal]MentoringReadingGlassesIcon.svg';
import MentorSpringIcon from 'src/assets/icons/mentoring/[renewal]MentoringSpringIcon.svg';
import MentorDesktopIcon from 'src/assets/icons/mentoring/[renewal]MentoringDesktopIcon.svg';

export default function MobileMentoringProcessSection() {
  return (
    <div className="max-w-[550px] mx-auto w-full flex flex-col gap-[8px] px-[20px]">
      {/* MentoringProcess Header */}
      <div className="flex w-full h-[30px] justify-between mt-[16px] items-center">
        <div className="text-bold-20 text-gray-90">멘토링 진행 방식</div>
      </div>
      {/* MentroingProcessCard */}
      {/* 1번 카드 */}
      <div className="flex flex-col w-full p-[20px] bg-gray-20 rounded-[20px]">
        <div className="flex gap-[4px] text-bold-16 mb-[8px]">
          <p className="text-gray-60">01</p>
          <p className="text-gray-90">멘토 확인</p>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-pre-line text-med-12 text-gray-70">
            {
              "상담을 받고 싶은 멘토의 정보를 살펴보고\n ‘멘토링 신청하기' 버튼을 눌러주세요"
            }
          </p>
          <MentorGlassesIcon width={40} height={40} />
        </div>
      </div>
      {/* 2번 카드 */}
      <div className="flex flex-col w-full p-[20px] bg-gray-20 rounded-[20px]">
        <div className="flex gap-[4px] text-bold-16 mb-[8px]">
          <p className="text-gray-60">02</p>
          <p className="text-gray-90">일정 선택 및 결제</p>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-pre-line text-med-12 text-gray-70">
            {'원하는 날짜와 시간을 선택하고\n 결제를 완료해주세요'}
          </p>
          <MentorCalendarIcon width={40} height={40} />
        </div>
      </div>
      {/* 3번 카드 */}
      <div className="flex flex-col w-full p-[20px] bg-gray-20 rounded-[20px]">
        <div className="flex gap-[4px] text-bold-16 mb-[8px]">
          <p className="text-gray-60">03</p>
          <p className="text-gray-90">질문지 확인</p>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-pre-line text-med-12 text-gray-70">
            {
              '영업일 1일 이내에 입력하신 연락처로\n확정된 일정, 추천 질문들이 담긴 질문지,\n그리고 멘토링 URL이 전달 되어요.'
            }
          </p>
          <MentorSpringIcon width={40} height={40} />
        </div>
      </div>
      {/* 4번 카드 */}
      <div className="flex flex-col w-full p-[20px] bg-gray-20 rounded-[20px]">
        <div className="flex gap-[4px] text-bold-16 mb-[8px]">
          <p className="text-gray-60">04</p>
          <p className="text-gray-90">링크 접속 및 멘토링 진행</p>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-pre-line text-med-12 text-gray-70">
            {'예약한 일정에 맞춰 멘토링 URL로 접속해,\n1시간 동안 멘토링을 받아보세요.'}
          </p>
          <MentorDesktopIcon width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
