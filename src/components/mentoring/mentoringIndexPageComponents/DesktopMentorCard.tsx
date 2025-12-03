import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import CrownIcon from 'src/assets/icons/mentoring/[renewal]CrownIcon.svg';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import mixpanel from 'mixpanel-browser';

type MentorViewDto = components['schemas']['MentorViewDto'];
interface MentorCardProps {
  mentor: MentorViewDto;
  handleBookmark: (
    event: any,
    isBookMarked?: boolean,
    mentorUuid?: string
  ) => Promise<void>;
}

export default function DesktopMentorCard({ mentor, handleBookmark }: MentorCardProps) {
  const router = useRouter();

  return (
    <div
      key={mentor.uuid}
      className="flex flex-col w-full rounded-[32px] bg-white border-[1px] border-gray-30 pt-[28px] px-[28px] pb-[20px] rounded-[24px]"
      onClick={() => {
        mixpanel.track(`click_see_mentor_${mentor.uuid}`, {
          view: 'mentoring'
        });
        router.push(`/mentoring/mentorlist/${mentor.uuid}`);
      }}
    >
      {/* 첫번째 row: name, hastags, images */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-bold-20 text-gray-90">{mentor.name}</p>
          <div className="flex flex-wrap gap-[4px] text-[#4D6CD9] text-med-14 mb-[12px]">
            {mentor.hashTags?.map((v, idx) => {
              return <p key={v + idx}>{'#' + v}</p>;
            })}
          </div>
        </div>
      </div>
      {/* education */}
      <div className="flex flex-col gap-[4px] mb-[4px]">
        {mentor.educations?.map((v, idx) => {
          return (
            <div className="flex gap-[8px] items-start" key={idx}>
              {v.iconUrl && (
                <img
                  src={v.iconUrl}
                  alt="university"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
              <p className="text-med-16 text-gray-90 whitespace-pre-line">{v?.detail}</p>
            </div>
          );
        })}
      </div>
      {/* career */}
      <div className="flex gap-[8px] mb-[8px]">
        <CrownIcon width={24} height={24} />
        <div className="flex flex-col gap-[2px] items-start">
          {mentor.experiences?.map((v, idx) => {
            return (
              <p key={idx} className="text-med-16 text-gray-90 whitespace-pre-line">
                {v?.detail}
              </p>
            );
          })}
        </div>
      </div>
      {/* 버튼 부분 */}
      <div className="flex flex-1 w-full items-end gap-[8px] mt-[20px] mb-[12px]">
        {/* Bookmark button */}
        <button
          onClick={event => {
            mixpanel.track(`click_scrap_mentor_mhome_${mentor.uuid}`, {
              view: 'mentoring'
            });
            handleBookmark(event, mentor.isBookmarkedByMe, mentor.uuid);
          }}
          className="bg-gray-20 rounded-[16px] justify-center items-center"
          style={{ width: '56px', height: '56px' }}
        >
          <BookmarkIcon
            width={28}
            height={28}
            className={mentor.isBookmarkedByMe ? 'text-yellow' : 'text-gray-50'}
          />
        </button>
        <button
          onClick={event => {
            event.stopPropagation();
            mixpanel.track(`click_want_mentoring_${mentor.uuid}`, {
              view: 'mentoring'
            });
            router.push(`/mentoring/mentorlist/${mentor.uuid}`);
          }}
          className="flex flex-1 bg-gray-20 h-[56px] rounded-[16px] justify-center items-center text-semibold-16 text-gray-90"
        >
          멘토링 신청하기
        </button>
      </div>
    </div>
  );
}
