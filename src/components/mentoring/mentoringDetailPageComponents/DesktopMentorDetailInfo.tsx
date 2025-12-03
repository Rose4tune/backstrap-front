import { components } from 'src/types/api';
import MentorEmojiIcon from 'src/assets/icons/mentoring/[renewal]MentorEmoji.svg';
import CrownIcon from 'src/assets/icons/mentoring/[renewal]CrownIcon.svg';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import mixpanel from 'mixpanel-browser';

type MentorViewDto = components['schemas']['MentorViewDto'];
interface MentorDetailInfoProps {
  mentor?: MentorViewDto | null;
  handleBookmark: (
    event: any,
    isBookMarked?: boolean,
    mentorUuid?: string
  ) => Promise<void>;
}
export default function DesktopMentorDetailInfo({
  mentor,
  handleBookmark
}: MentorDetailInfoProps) {
  return (
    <div className="flex flex-col w-full">
      {/* 연구자 name + hastag + icon */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-[4px]">
          <p className="text-bold-24 text-black">{mentor?.name}</p>
          <div className="flex flex-wrap gap-[10px] text-[#4D6CD9] text-med-16 mb-[24px]">
            {mentor?.hashTags?.map((v, idx) => {
              return <p key={v + idx}>{'#' + v}</p>;
            })}
          </div>
        </div>
        {/* Bookmark button */}
        <button
          onClick={event => {
            mixpanel.track('click_scrap_mentor_mdetail', {
              view: `${mentor?.uuid}`
            });
            handleBookmark(event);
          }}
        >
          <div
            className="flex bg-gray-20 rounded-[8px] justify-center items-center"
            style={{ width: '40px', height: '40px' }}
          >
            <BookmarkIcon
              width={24}
              height={24}
              className={mentor?.isBookmarkedByMe ? 'text-yellow' : 'text-gray-50'}
            />
          </div>
        </button>
      </div>
      {/* 연구자 description */}
      <p className="flex text-med-14 text-gray-70 whitespace-pre-line mb-[40px]">
        {mentor?.description}
      </p>
      {/* 연구자 education */}
      <div className="grid grid-cols-2 gap-[40px] mb-[40px]">
        <div className="flex flex-col">
          <div className="flex mb-[16px] text-bold-16 text-black pb-[8px] border-b-[1px] border-gray-20">
            학력
          </div>
          {/* education */}
          {mentor?.educations?.map((v, idx) => {
            return (
              <div className="flex gap-[8px] mb-[8px] items-center" key={idx}>
                {v.iconUrl && (
                  <img
                    src={v.iconUrl}
                    alt="university"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
                <p className="text-med-14 text-gray-90 whitespace-pre-line">
                  {v?.detail}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-[16px]">
          {/* 연구자 experiences */}
          <div className="flex text-bold-16 text-black pb-[8px] border-b-[1px] border-gray-20">
            경력
          </div>
          {/* career */}
          <div className="flex gap-[8px] mb-[8px]">
            <CrownIcon width={24} height={24} />
            <div className="flex flex-col">
              {mentor?.experiences?.map((v, idx) => {
                return (
                  <p key={idx} className="text-med-14 text-gray-90 whitespace-pre-line">
                    {v?.detail}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
