import MentorSpringIcon from 'src/assets/icons/mentoring/[renewal]MentoringSpringIcon.svg';
import MentorThinkingIcon from 'src/assets/icons/mentoring/[renewal]MentoringThinkingFaceIcon.svg';
import MentorMapIcon from 'src/assets/icons/mentoring/[renewal]MentoringMapIcon.svg';
import MentorBagIcon from 'src/assets/icons/mentoring/[renewal]MentoringBagIcon.svg';

export default function DesktopMentorRecommendationSection() {
  return (
    <div className="flex flex-col gap-[16px] bg-white pt-[28px] mb-[40px]">
      <div className="flex flex-1 text-bold-20 text-black pb-[8px] border-b-[1px] border-gray-20">
        이런 분들에게 추천드려요!
      </div>
      <div className="w-full flex gap-[8px]">
        {/* RecommendationCard */}
        {/* 1번 카드 */}
        <div className="flex flex justify-between items-center w-full p-[20px] bg-gray-20 rounded-[20px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-60 text-semibold-16">01</p>
            <p className="text-gray-90 text-bold-16">진로 고민</p>
          </div>
          <MentorThinkingIcon width={35} height={35} />
        </div>
        {/* 2번 카드 */}
        <div className="flex flex justify-between items-center w-full p-[20px] bg-gray-20 rounded-[20px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-60 text-semibold-16">02</p>
            <p className="text-gray-90 text-bold-16">커리어 상담</p>
          </div>
          <MentorMapIcon width={35} height={35} />
        </div>
        {/* 3번 카드 */}
        <div className="flex flex justify-between items-center w-full p-[20px] bg-gray-20 rounded-[20px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-60 text-semibold-16">03</p>
            <p className="text-gray-90 text-bold-16 whitespace-pre-line">{`CV 작성`}</p>
          </div>
          <MentorSpringIcon width={35} height={35} />
        </div>
        {/* 4번 카드 */}
        <div className="flex flex justify-between items-center w-full p-[20px] bg-gray-20 rounded-[20px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-60 text-semibold-16">04</p>
            <p className="text-gray-90 text-bold-16 whitespace-pre-line">{`취업 상담`}</p>
          </div>
          <MentorBagIcon width={35} height={35} />
        </div>
      </div>
    </div>
  );
}
