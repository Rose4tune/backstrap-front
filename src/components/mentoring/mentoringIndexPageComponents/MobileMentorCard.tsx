import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import CrownIcon from 'src/assets/icons/mentoring/[renewal]CrownIcon.svg';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import MentorEmojiIcon from 'src/assets/icons/mentoring/[renewal]MentorEmoji.svg';
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

export default function MobileMentorCard({ mentor, handleBookmark }: MentorCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        mixpanel.track(`click_see_mentor_${mentor.uuid}`, {
          view: 'mentoring'
        });
        router.push(`/mentoring/mentorlist/${mentor.uuid}`);
      }}
      className="text-left"
    >
      <div
        key={mentor.uuid + 'a'}
        className="align-top inline-block space-x-[10px] rounded-[20px] bg-white border-[1px] border-gray-30 pt-[20px] px-[20px] pb-[8px]"
        style={{ width: '310px' }}
      >
        {/* 첫번째 row: name, hastags, images */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="text-bold-14 text-gray-90">{mentor.name}</p>
            <div className="flex flex-wrap flex-1 gap-[4px] text-[#4D6CD9] text-med-12 mb-[8px]">
              {mentor.hashTags?.map((v, idx) => {
                return <p key={v + idx}>{'#' + v}</p>;
              })}
            </div>
          </div>
          <MentorEmojiIcon width={42} height={42} />
        </div>
        {/* crown + description */}
        <div className="flex gap-[8px] mb-[8px]">
          <CrownIcon width={24} height={24} />
          <div className="flex flex-col gap-[2px] h-[76px] items-start">
            <div className="line-clamp-4 text-ellipsis overflow-hidden">
              {mentor.experiences?.slice(0, 4).map((v, idx) => {
                return (
                  <p
                    key={v.detail || '' + idx}
                    className={`whitespace-pre-line ${v.isBold ? 'text-semibold-14 text-[#4D6CD9]' : 'text-reg-14 text-gray-90'}`}
                  >
                    {v?.detail}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
        {/* 버튼 부분 */}
        <div className="flex gap-[8px] mt-[20px] mb-[12px]">
          {/* Bookmark button */}
          <button
            onClick={event => {
              mixpanel.track(`click_scrap_mentor_mhome_${mentor.uuid}`, {
                view: 'mentoring'
              });
              handleBookmark(event, mentor.isBookmarkedByMe, mentor.uuid);
            }}
            className="flex w-[52px] h-[48px] bg-gray-20 rounded-[16px] justify-center items-center"
          >
            <BookmarkIcon
              width={20}
              height={20}
              className={mentor.isBookmarkedByMe ? 'text-yellow' : 'text-gray-50'}
            />
          </button>
          <button
            className="flex flex-1 bg-gray-20 h-[48px] rounded-[16px] justify-center items-center text-semibold-16 text-gray-90"
            onClick={event => {
              event.stopPropagation();
              mixpanel.track(`click_want_mentoring_${mentor.uuid}`, {
                view: 'mentoring'
              });
              router.push(`/mentoring/mentorlist/${mentor.uuid}`);
            }}
          >
            멘토링 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
