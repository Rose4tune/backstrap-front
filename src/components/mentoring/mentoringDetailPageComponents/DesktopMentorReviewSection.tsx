import { components } from 'src/types/api';
import MentorRatingIcon from 'src/assets/icons/mentoring/[renewal]MentoringRatingStar.svg';

type MentorReviewViewDto = components['schemas']['MentorReviewViewDto'];

interface MentorReviewSectionProps {
  reviewList: MentorReviewViewDto[] | null;
}
export default function DesktopMentorReviewSection({
  reviewList
}: MentorReviewSectionProps) {
  return (
    <div className="flex flex-col gap-[16px] bg-white pt-[28px] pb-[32px]">
      <div className="flex flex-1 text-bold-20 text-black pb-[8px] border-b-[1px] border-gray-20">
        참여후기
      </div>
      {/* MentorReviewCard */}
      {/* TOdo: 멘토에따른 리뷰 데이터셋으로 전환 */}
      <div className="w-full gap-[12px] flex flex-col">
        {reviewList &&
          reviewList.length > 0 &&
          reviewList.map((review, idx) => (
            <div
              key={review.uuid || idx}
              className="flex flex-col px-[20px] pt-[20px] pb-[20px] rounded-[20px] bg-gray-20"
            >
              {/* 리뷰 내용 */}
              <p className="whitespace-pre-line text-med-14 text-gray-90 mb-[4px]">
                {review.content}
              </p>
              {/* 별점 및 리뷰 작성 날짜 라인 */}
              <div className="flex gap-[8px] items-center mb-[4px]">
                <div className="flex gap-[4px]">
                  {[...Array(Math.ceil(Number(review.rating)))].map(() => (
                    <MentorRatingIcon width={16} height={16} />
                  ))}
                </div>
                {review.rating && review.rating > 0 && (
                  <div className="w-[1px] h-[16px] bg-gray-50" />
                )}
                <div className="text-med-14 text-gray-70">
                  {review.createdDate?.split('T')[0]}
                </div>
              </div>
              {/* Todo: 작성자 아이디 masking 필요 */}
              <p className="text-med-12 text-gray-60">
                {review?.userName
                  ?.split('')
                  .map((char, idx) => (idx >= 1 && review.userName ? '*' : char))
                  .join('')}
                {'님'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
