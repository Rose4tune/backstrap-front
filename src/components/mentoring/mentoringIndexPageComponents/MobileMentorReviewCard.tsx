import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import MentorGoIcon from 'src/assets/icons/mentoring/[renewal]MentoringGoIcon.svg';
import MentorRatingIcon from 'src/assets/icons/mentoring/[renewal]MentoringRatingStar.svg';
import mixpanel from 'mixpanel-browser';

type MentorReviewViewDto = components['schemas']['MentorReviewViewDto'];
interface MentorReviewCardProps {
  review: MentorReviewViewDto;
}
export default function MobileMentorReviewCard({ review }: MentorReviewCardProps) {
  const router = useRouter();
  return (
    <div
      className="inline-block w-[263px] h-[336px] px-[20px] pt-[20px] pb-[28px] border-[1px] border-gray-30 rounded-[20px]"
      onClick={() => {
        mixpanel.track(`click_mentor_${review.mentorUuid}_review`, {
          view: 'mentoring'
        });
        router.push(`/mentoring/mentorlist/${review.mentorUuid}`);
      }}
    >
      {/* 이름 및 icon 라인 */}
      <div className="flex justify-between mb-[8px]">
        <p className="text-semibold-14 text-gray-90">{review.mentorName}</p>
        <MentorGoIcon width={20} height={20} />
      </div>
      {/* 별점 및 리뷰 작성 날짜 라인 */}
      <div className="flex gap-[8px] items-center mb-[12px]">
        <div className="flex gap-[4px]">
          {[...Array(Math.ceil(Number(review.rating)))].map((__, idx) => (
            <MentorRatingIcon key={review.uuid || '' + idx} width={16} height={16} />
          ))}
        </div>
        {review.rating && review.rating > 0 && (
          <div className="w-[1px] h-[16px] bg-gray-50" />
        )}
        <div className="text-med-14 text-gray-70">
          {review.createdDate?.split('T')[0]}
        </div>
      </div>
      {/* 리뷰 내용 */}
      <p className="whitespace-pre-line text-med-12 text-gray-90 mb-[12px]">
        {review.content}
      </p>
      {/* Todo: 작성자 아이디 masking 필요 */}
      <p className="text-med-12 text-gray-60">
        {review?.userName
          ?.split('')
          .map((char, idx) => (idx >= 1 && review.userName ? '*' : char))
          .join('')}
        {'님'}
      </p>
    </div>
  );
}
