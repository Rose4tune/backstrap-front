import PageLayout from '@layouts/PageLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import RightArrowIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg';
import { useEffect, useState } from 'react';
import { getMentorByPaging } from 'src/apis/mentor/getMentorByPaging';
import { components } from 'src/types/api';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import { bookmark } from 'src/apis/mentor-book-mark/bookmark';
import { unBookmark } from 'src/apis/mentor-book-mark/un-bookmark';
import { useCookies } from 'react-cookie';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { getMentorReviewbyPaging } from 'src/apis/mentor-review/getMentorReviewByPaging';
import checkPopUp from 'src/apis/coupon/checkPopUp';
import { issueMyCoupon } from 'src/apis/user-coupon/issueMyCoupon';
import ErrorPopup from '@common/ErrorPopup';
import getCookieValue from 'src/utils/getCookieValue';
import {
  MobileCardBanner,
  MobileMentoringProcessSection,
  MobileMentorReviewCard,
  MobileMentoringFAQSection,
  MobileMentorCard,
  MobileBanner,
  DesktopBanner,
  DesktopMentorCard,
  DesktopCardBanner,
  DesktopMentorReviewCard,
  DesktopMentoringProcessSection,
  DesktopMentoringDescriptionSection,
  DesktopMentoringFAQSection,
  MentoringCouponPopup
} from 'src/components/mentoring/mentoringIndexPageComponents';
import { HASHTAG } from 'src/types/mentorHashtag';
import DesktopHashtagSelector from 'src/components/mentoring/mentoringIndexPageComponents/DesktopHashtagSelector';
import mixpanel from 'mixpanel-browser';
import { NextSeo } from 'next-seo';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

type MentorViewDto = components['schemas']['MentorViewDto'][];
type MentorReviewViewDto = components['schemas']['MentorReviewViewDto'];
type CouponViewDto = components['schemas']['CouponViewDto'];

export default function MentoringPage() {
  const router = useRouter();
  const [mentorList, setMentorList] = useState<MentorViewDto | undefined>();
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  const [cookies] = useCookies();
  const [reviewList, setReviewList] = useState<MentorReviewViewDto[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isPopupHiddenOneday, setIsPopupHiddenOneday] = useState<boolean>(false); //팝업 하루 동안 안보이게 처리
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState<boolean>(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState<string>('');
  const [coupon, setCoupon] = useState<CouponViewDto[] | null>(null); //발급받을 수 있는 쿠폰 정보 저장
  const [isCouponIssueLoading, setIsCouponIssueLoading] = useState<boolean>(false);
  const [hashtagSelected, setHashtagSelected] = useState<HASHTAG>('전체');

  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

  const isMobile = useMediaQuery('(max-width:550px)');

  //멘토 리뷰 불러오기
  useEffect(() => {
    async function getMentorReviewList() {
      const reviewResponseList = (
        await getMentorReviewbyPaging({
          count: 20
        })
      ).data?.data;
      setReviewList(reviewResponseList || null);
    }
    getMentorReviewList();
  }, []);

  //믹스패널 페이지 정보
  useEffect(() => {
    mixpanel.track('View_Mentoring');
  }, []);

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

  //팝업 오픈 여부 체크
  useEffect(() => {
    async function popUpCheck() {
      const response = await checkPopUp('MENTORING', accessToken);
      if (response.data && response.data.length > 0) {
        setIsPopupOpen(true);
        setCoupon(response.data);
        mixpanel.track('popup_coupon');
      }
    }
    popUpCheck();
  }, [setIsPopupOpen, setCoupon]);

  //쿠키 체크해 팝업 오픈 여부 확인
  useEffect(() => {
    const isHidden = getCookieValue('hidePopup');
    if (isHidden === 'true') {
      setIsPopupHiddenOneday(true);
    }
  }, [setIsPopupHiddenOneday]);

  //팝업오픈시 스크롤 막기
  useEffect(() => {
    if (isPopupOpen && !isPopupHiddenOneday) {
      document.body.style.overflow = 'hidden'; // 스크롤 막기
    } else {
      document.body.style.overflow = ''; // 원래대로 복구
    }

    // 컴포넌트 언마운트 시 복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPopupOpen, isPopupHiddenOneday]);

  /**쿠키에 담아 popup 숨김여부 결정 */
  function notSeeToday() {
    const now = new Date();
    const expires = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 // 자정까지
    );
    document.cookie = `hidePopup=true; path=/; expires=${expires.toUTCString()}`; // 쿠키 명세 상 UTC 문자열로 저장
    setIsPopupOpen(false);
  }

  // Todo: UseDebounce 적용하기
  // Bookmark/Unbookmark api 호출 함수
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
        // 선반영
        if (isBookMarked) {
          await unBookmark(mentorUuid, accessToken);
        } else {
          await bookmark(mentorUuid, accessToken);
        }
      } catch (e) {
        // 오류 시 롤백
        setMentorList(prevMentorList);
      }
    }
  }

  //쿠폰 발급 api 호출 함수
  async function issueCoupon() {
    setIsCouponIssueLoading(true); //쿠폰 중복 눌림 방지
    //로그인 안된 상태
    if (!accessToken) {
      openAuthModal();
      setIsCouponIssueLoading(false); //쿠폰 중복 눌림 방지
      return;
    }
    if (coupon && coupon[0]?.uuid) {
      console.log('다운로드', coupon);
      const response = await issueMyCoupon(coupon[0].uuid as string, accessToken);
      if (response.success) {
        alert('쿠폰 발급이 완료되었습니다.'); //ErrorPopup 넣기
      } else {
        setIsErrorPopupOpen(true);
        setErrorPopupMessage(response.messages as string);
      }
    }
    setIsCouponIssueLoading(false); //쿠폰 중복 눌림 방지
    setIsPopupOpen(false);
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

  const filteredMentorList = mentorList?.filter(mentor => {
    if (hashtagSelected === '전체') return true;

    const allowedMentors = hashtagMentorMap[hashtagSelected];
    return allowedMentors?.includes(mentor?.name || '');
  });

  return (
    <>
      <NextSeo
        title="가방끈 | 멘토링"
        description="멘토링으로 대학원 궁금증 해소해요"
        canonical="https://www.bagstrap.team/mentoring"
        openGraph={{
          type: 'website',
          url: 'https://www.bagstrap.team/mentoring',
          title: '가방끈 멘토링',
          description: '멘토링으로 대학원 궁금증 해소해요',
          images: [
            {
              url: 'https://www.bagstrap.team/logos/mentoringPreview.png',
              alt: '가방끈 멘토링',
            },
          ],
          site_name: 'Bagstrap',
        }}
      />
      {isMobile ?
        < div className="max-w-[550px] mx-auto w-full">
          <MobileBanner />
          {/* Mobile MentorList Section */}
          <div className="w-full flex flex-col gap-[8px] ">
            {/* MentorList Header */}
            <div className="flex w-full h-[30px] justify-between mt-[16px] px-[20px] items-center">
              <div className="text-bold-20 text-gray-90">멘토 리스트</div>
              <div>
                <button
                  onClick={() => router.push('/mentoring/mentorlist')}
                  className="text-gray-50 flex items-center justify-center pl-[8px] pr-[4px] py-[6px] gap-[4px]"
                >
                  <p>전체보기</p>
                  <RightArrowIcon width={12} height={12}></RightArrowIcon>
                </button>
              </div>
            </div>
            {/* MentorCard Summary*/}
            <div className="flex align-top space-x-[10px] overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-[20px]">
              {mentorList?.map(mentor => (
                <MobileMentorCard
                  key={mentor.uuid}
                  mentor={mentor}
                  handleBookmark={handleBookmark}
                />
              ))}
            </div>
          </div>
          {/* Mobile: MentorReview Section */}
          <div className="max-w-[550px] mx-auto w-full flex flex-col gap-[8px] ">
            {/* MentorReview Header */}
            <div className="flex w-full h-[30px] mt-[16px] px-[20px] items-center">
              <div className="text-bold-20 text-gray-90">멘토 리뷰</div>
            </div>
            {/* MentorReviewCard */}
            <div className="inline-block space-x-[12px] overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-[20px] flex">
              {reviewList &&
                reviewList.length > 0 &&
                reviewList.map((review, idx) => (
                  <MobileMentorReviewCard
                    key={review.uuid ?? `mobile-review-${idx}`}
                    review={review} />
                ))}
            </div>
          </div>
          <MobileMentoringProcessSection />
          <div className="flex flex-col gap-[18px]">
            <MobileMentoringFAQSection />
            <MobileCardBanner />
          </div>
        </div >
        :
        <div className="flex flex-col w-full min-w-[1440px] max-w-[1920px] mx-auto">
          <GlobalHeader />
          <DesktopBanner />
          <div className="flex flex-col gap-[96px]">
            {/* Dekstop MentorList Section*/}
            <div className="flex flex-col justify-center items-center">
              <div className="mt-[68px] mx-auto mb-[32px] text-bold-24">
                현직 대학원생에게 직접 듣는 대학원/연구실 라이프!
              </div>
              <DesktopHashtagSelector
                hashtagSelected={hashtagSelected}
                setHashtagSelected={setHashtagSelected}
              />
              <div className="flex flex-col gap-[24px]">
                <div className="grid grid-cols-4 gap-x-[16px] gap-y-[24px] px-[80px]">
                  {filteredMentorList?.map(mentor => (
                    <DesktopMentorCard
                      key={mentor.uuid}
                      mentor={mentor}
                      handleBookmark={handleBookmark}
                    />
                  ))}
                </div>
                <DesktopCardBanner />
              </div>
            </div>

            {/* MentorReview Section:Desktop */}
            <div>
              <div className="text-med-14 text-gray-70 text-center">
                가방끈에서만 들을 수 있는 이야기
              </div>
              <div className="text-bold-24 text-gray-90 text-center">
                끈끈하게 이어진 생생한 리뷰
              </div>

              <div className="w-screen max-w-[1920px] mt-[32px] relative left-1/2 -translate-x-1/2 flex-col gap-[8px]">
                {/* MentorReviewCard */}
                <div className="space-x-[16px] overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar px-[20px] flex">
                  {reviewList &&
                    reviewList.length > 0 &&
                    reviewList.map((review, idx) => (
                      <DesktopMentorReviewCard
                        key={review.uuid ?? `review-${idx}`}
                        review={review}
                      />
                    ))}
                </div>
              </div>
            </div>
            <DesktopMentoringDescriptionSection />
            <DesktopMentoringProcessSection />
            <DesktopMentoringFAQSection />
          </div>
          <Footer />
        </div>
      }
      {/* Modal & Popup */}
      {AuthModalComponent}
      {/* Popup */}
      {
        isPopupOpen && !isPopupHiddenOneday && (
          <MentoringCouponPopup
            setIsPopupOpen={setIsPopupOpen}
            issueCoupon={issueCoupon}
            notSeeToday={notSeeToday}
            isCouponIssueLoading={isCouponIssueLoading}
          />
        )
      }
      {/* Error Popup */}
      <>
        {isErrorPopupOpen && (
          <ErrorPopup
            isOpen={isErrorPopupOpen}
            setIsOpen={setIsErrorPopupOpen}
            errorMessage={errorPopupMessage}
          />
        )}
      </>
    </>
  );
}
