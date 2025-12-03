import { useRouter } from 'next/router';
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg';
import { useEffect, useState } from 'react';
import MentorEmojiIcon from 'src/assets/icons/mentoring/[renewal]MentorEmoji.svg';
import CrownIcon from 'src/assets/icons/mentoring/[renewal]CrownIcon.svg';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import MentoringCardBannerMobile from 'src/assets/icons/mentoring/[renewal]MentorCardBannerMobile.svg';
import { getMentorByPaging } from 'src/apis/mentor/getMentorByPaging';
import { components } from 'src/types/api';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { useCookies } from 'react-cookie';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { unBookmark } from 'src/apis/mentor-book-mark/un-bookmark';
import { bookmark } from 'src/apis/mentor-book-mark/bookmark';
import { HASHTAG, HASHTAGS_LIST } from 'src/types/mentorHashtag';
import mixpanel from 'mixpanel-browser';

type MentorViewDto = components['schemas']['MentorViewDto'][];

export default function MentorListPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<HASHTAG>('전체');
  const [mentorList, setMentorList] = useState<MentorViewDto | undefined>();
  const [cookies] = useCookies();
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

  ///멘토리스트 불러오기
  useEffect(() => {
    async function getMentorList() {
      let mentorListResponse;
      if (accessToken) {
        mentorListResponse = (await getMentorByPaging({ count: 20 }, accessToken)).data
          ?.data;
      } else {
        mentorListResponse = (await getMentorByPaging({ count: 20 })).data?.data;
      }
      setMentorList(mentorListResponse);
    }
    getMentorList();
  }, []);

  // Todo: UseDebounce 적용하기
  // Bookmark 조절하는 함수
  async function handleBookmark(event: any, isBookMarked?: boolean, mentorUuid?: string) {
    event.stopPropagation();

    //로그인 상태 아니면 로그인부터 시키기
    if (!accessToken) {
      openAuthModal();
      return;
    }

    // Todo: useDebounce 적용
    if (mentorUuid && accessToken && mentorList) {
      const prevMentorList = [...mentorList]; // 백업

      // Optimistic Update
      setMentorList(prev =>
        prev?.map(m =>
          m.uuid === mentorUuid ? { ...m, isBookmarkedByMe: !isBookMarked } : m
        )
      );

      try {
        // 정상반영
        if (isBookMarked) {
          await unBookmark(mentorUuid, accessToken);
        } else {
          await bookmark(mentorUuid, accessToken);
        }
      } catch (e) {
        // 롤백
        setMentorList(prevMentorList);
      }
    }
  }

  //일단 하드코딩, uuid로 바꾸거나 백엔드에서 관리하게 해야함
  const hashtagMentorMap: Record<string, string[]> = {
    '#유학': ['연구자 J', '연구자 P', 'CV SOP 첨삭 입시 전문가', '연구자 A', '연구자 L'],
    '#인공지능': ['연구자 T', '연구자 O', '연구자 D', '연구자 K'],
    '#연세대': ['연구자 M', '연구자 S', '연구자 W'],
    '#재료': ['연구자 M', '연구자 S'],
    '#삼성전자': ['연구자 W', '연구자 A'],
    '#데이터사이언스': ['연구자 O', '연구자 J'],
    '#영문교정/컨설팅': ['CV SOP 첨삭 입시 전문가']
  };

  //믹스패널을 위한 객체
  const actionMap: Record<HASHTAG, string> = {
    '#유학': 'click_filter_abr',
    '#인공지능': 'click_filter_ai',
    '#재료': 'click_filter_res',
    '#데이터사이언스': 'click_filter_data',
    '#영문교정/컨설팅': 'click_filter_com',
    '#삼성전자': 'click_filter_sam',
    '#연세대': 'click_filter_ys',
    전체: 'click_filter_whole'
  };

  const filteredMentorList = mentorList?.filter(mentor => {
    if (selected === '전체') return true;

    const allowedMentors = hashtagMentorMap[selected];
    return allowedMentors?.includes(mentor?.name || '');
  });

  // TOdo: Mentorlist에서 mentor.hastag.has(selected)이면 띄우고 아니면 렌더링 하지 않게 하기
  return (
    <div className="max-w-[550px] mx-auto">
      <div className="pt-[53px] pb-[80px]">
        {/* 헤더 */}
        <div className="flex px-[20px] pb-[20px]">
          <div className="flex w-full justify-between">
            <button onClick={() => router.push('/mentoring')}>
              <LeftArrowIcon width={20} height={20} className="text-gray-50" />
            </button>
            <p className="text-semibold-16 text-gray-90">멘토 리스트</p>
            <div className="w-[20px] h-[20px]" />
          </div>
        </div>
        {/* 카드 배너 섹션: mobile - 640px까지 */}
        <a
          href="https://walla.my/v/raiBQBxxHOYdDVPSD5Su"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            mixpanel.track('click_tobe_mentor_mlist', { view: 'mentorlist_mobileweb' });
          }}
        >
          <div className="w-full relative bg-[#8FA4FF] overflow-hidden">
            <MentoringCardBannerMobile className="object-cover max-h-[256px]" />
            <p className="absolute top-[23px] left-[20px] text-semibold-14 text-[#465DC2]">
              대학원 경험 나누고 수익창출!
            </p>
            <p className="absolute top-[43px] left-[20px] text-bold-20 text-white">
              나도 멘토가 될 수 있어요
            </p>
          </div>
        </a>
        {/* TagSelector */}
        <div className="flex gap-[20px] w-full pt-[20px] px-[20px] overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar mb-[28px]">
          {HASHTAGS_LIST.map((v, idx) => (
            <div
              key={v + idx}
              className={`pb-[4px] ${selected === v ? 'border-b-[2px] border-gray-90 text-bold-14 text-gray-90' : 'text-semibold-14 text-gray-50'}`}
              onClick={() => {
                if (selected === v) return;
                setSelected(v);
                const action = actionMap[v as HASHTAG];
                if (action) {
                  mixpanel.track(action, { view: 'mentoring' });
                }
              }}
            />
          ))}
        </div>
        {/* MentorDetailCard */}
        <div className="flex flex-col gap-[10px] px-[20px]">
          {filteredMentorList?.map(mentor => (
            <div
              key={mentor.uuid}
              className="flex flex-col w-full rounded-[20px] bg-white border-[1px] border-gray-30 pt-[20px] px-[20px] pb-[8px]"
              onClick={() => {
                mixpanel.track(`click_see_mentor_mlist_${mentor.uuid}`, {
                  view: 'mentorlist_mobileweb'
                });
                router.push(`/mentoring/mentorlist/${mentor.uuid}`);
              }}
            >
              {/* 첫번째 row: name, hastags, images */}
              <div className="flex justify-between">
                <div className="flex flex-col gap-[4px]">
                  <p className="text-bold-14 text-gray-90">{mentor.name}</p>
                  <div className="flex gap-[4px] text-[#4D6CD9] text-med-12 mb-[8px]">
                    {mentor.hashTags?.map((v, idx) => {
                      return <p key={v + idx}>{'#' + v}</p>;
                    })}
                  </div>
                </div>
                <MentorEmojiIcon width={42} height={42} />
              </div>
              {/* education */}
              <div className="flex flex-col gap-[4px] mb-[4px]">
                {/* Todo: 일단 하드코딩 추후 변경 필요 */}
                {mentor.educations?.map((v, idx) => {
                  return (
                    <div
                      className="flex gap-[8px] items-start"
                      key={v.detail || '' + idx}
                    >
                      {v.iconUrl && (
                        <img
                          src={v.iconUrl}
                          alt="university"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      )}
                      <p className="text-reg-14 text-gray-90 whitespace-pre-line">
                        {v?.detail}
                      </p>
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
                      <p
                        key={v.detail || '' + idx}
                        className="text-reg-14 text-gray-90 whitespace-pre-line"
                      >
                        {v?.detail}
                      </p>
                    );
                  })}
                </div>
              </div>
              {/* 버튼 부분 */}
              <div className="flex gap-[8px] mt-[20px] mb-[12px]">
                {/* Bookmark button */}
                <button
                  onClick={event => {
                    mixpanel.track(`mentoring_scrap_mentor_mlist_${mentor.uuid}`, {
                      view: 'mentorlist_mobileweb'
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
                  onClick={event => {
                    event.stopPropagation();
                    mixpanel.track(`click_want_mentoring_mlist_${mentor.uuid}`, {
                      view: 'mentorlist_mobileweb'
                    });
                    router.push(`/mentoring/mentorlist/${mentor.uuid}`);
                  }}
                  className="flex flex-1 bg-gray-20 h-[48px] rounded-[16px] justify-center items-center text-semibold-16 text-gray-90"
                >
                  멘토링 신청하기
                </button>
              </div>
            </div>
          ))}
        </div>
        {AuthModalComponent}
      </div>
    </div>
  );
}
