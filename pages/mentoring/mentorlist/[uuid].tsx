import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LeftArrowIcon from 'src/assets/icons/common/[renewal]LeftArrowIcon.svg';
import BookmarkIcon from 'src/assets/icons/mentoring/[renewal]BookmarkIcon.svg';
import MentorEmojiIcon from 'src/assets/icons/mentoring/[renewal]MentorEmoji.svg';
import UniversityImage from 'src/assets/images/mentoring/university/[renewal]TuftsUniversity.png';
import MentorRatingIcon from 'src/assets/icons/mentoring/[renewal]MentoringRatingStar.svg';
import MentorCalendarIcon from 'src/assets/icons/mentoring/[renewal]MentoringCalendarIcon.svg';
import MentorGlassesIcon from 'src/assets/icons/mentoring/[renewal]MentoringReadingGlassesIcon.svg';
import MentorSpringIcon from 'src/assets/icons/mentoring/[renewal]MentoringSpringIcon.svg';
import MentorDesktopIcon from 'src/assets/icons/mentoring/[renewal]MentoringDesktopIcon.svg';
import MentorThinkingIcon from 'src/assets/icons/mentoring/[renewal]MentoringThinkingFaceIcon.svg';
import MentorMapIcon from 'src/assets/icons/mentoring/[renewal]MentoringMapIcon.svg';
import MentorBagIcon from 'src/assets/icons/mentoring/[renewal]MentoringBagIcon.svg';
import RightArrowIcon from 'src/assets/icons/common/[renewal]RightArrowIcon.svg';
import { useEffect, useState } from 'react';
import ModalCalendar from 'src/components/mentoring/ModalCalendar';
import { getMentorByUuid } from 'src/apis/mentor/getMentorByUuid';
import { components, paths } from 'src/types/api';
import CrownIcon from 'src/assets/icons/mentoring/[renewal]CrownIcon.svg';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { unBookmark } from 'src/apis/mentor-book-mark/un-bookmark';
import { bookmark } from 'src/apis/mentor-book-mark/bookmark';
import { useCookies } from 'react-cookie';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import getMyCoupons from 'src/apis/user-coupon/my';
import { getMentorReviewbyPaging } from 'src/apis/mentor-review/getMentorReviewByPaging';
import PageLayout from '@layouts/PageLayout';
import Calendar from 'src/components/mentoring/Calendar';
import cookie from 'cookie';
import DesktopMentorDetailInfo from 'src/components/mentoring/mentoringDetailPageComponents/DesktopMentorDetailInfo';
import DesktopMentorRecommendationSection from 'src/components/mentoring/mentoringDetailPageComponents/DesktopMentorRecommendationSection';
import DesktopMentorReviewSection from 'src/components/mentoring/mentoringDetailPageComponents/DesktopMentorReviewSection';
import MobilePaymentButtonSection from 'src/components/mentoring/mentoringDetailPageComponents/MobilePaymentButtonSection';
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

type MentorViewDto = components['schemas']['MentorViewDto'];
type MentorReviewViewDto = components['schemas']['MentorReviewViewDto'];

type MentorViewDetailProps = {
  mentor: MentorViewDto | null | undefined;
};

// 먼저 서버사이드렌더링 이후 props 넘겨줌
export const getServerSideProps: GetServerSideProps<
  MentorViewDetailProps
> = async context => {
  const uuid = context.query.uuid as string;
  // 쿠키 파싱
  const rawCookie = context.req.headers.cookie || '';
  const parsedCookies = cookie.parse(rawCookie);

  // 예시: accessToken만 추출
  const accessToken = parsedCookies['accessToken']; // key는 상황에 맞게 변경
  console.log('accessToken', accessToken);
  let mentor;
  if (accessToken) {
    mentor = (await getMentorByUuid(uuid, accessToken)).data;
  } else {
    mentor = (await getMentorByUuid(uuid)).data;
  }
  console.log('mentor', mentor);
  return {
    props: {
      mentor: mentor ?? null
    }
  };
};

export default function MentorDetailPage({ mentor }: MentorViewDetailProps) {
  const router = useRouter();
  const [cookies] = useCookies();
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false); //결제 모달 오픈 여부 관리
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  //북마크 리렌더링 유발을 위해서 mentorState라는 상태 도입
  const [mentorState, setMentorState] = useState<MentorViewDto | null | undefined>(
    mentor
  );
  const [price, setPrice] = useState<number>(mentor?.originPrice as number); //최대 한개의 쿠폰 적용 가능
  const [reviewList, setReviewList] = useState<MentorReviewViewDto[] | null>(null);
  const isMobile = useMediaQuery('(max-width:550px)');

  //북마크 재렌더링 유발을 위한 멘토정보 상태관리
  useEffect(() => {
    setMentorState(mentor);
  }, [setMentorState]);

  //믹스패널 페이지 정보
  useEffect(() => {
    mixpanel.track('View_Mentoring');
  }, []);

  useEffect(() => {
    async function getMentorReviewList() {
      const reviewResponseList = (
        await getMentorReviewbyPaging({
          count: 10,
          mentorUuid: mentor?.uuid
        })
      ).data?.data;
      setReviewList(reviewResponseList || null);
    }
    getMentorReviewList();
  }, []);

  useEffect(() => {
    async function getMyCoupon() {
      const coupons = (await getMyCoupons(accessToken)).data ?? [];

      const discountRates = coupons
        .map(c => c.coupon?.discountFixedRate)
        .filter((rate): rate is number => typeof rate === 'number'); //undefined 제거

      const bestDiscountRate = discountRates.length > 0 ? Math.max(...discountRates) : 0;

      setPrice((1 - 0.01 * bestDiscountRate) * (mentor?.originPrice as number));
      //setPrice 할인율
    }

    if (accessToken) {
      getMyCoupon();
    }
  });

  async function handleBookmark(event: React.MouseEvent) {
    event.stopPropagation();
    const accessToken =
      cookies[COOKIE_NS]?.authPayload?.access_token ||
      cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
      cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

    if (!accessToken || !mentorState?.uuid) {
      openAuthModal();
      return;
    }

    const prev = { ...mentorState };

    // optimistic update
    setMentorState(prev =>
      prev
        ? {
          ...prev,
          isBookmarkedByMe: !prev.isBookmarkedByMe
        }
        : prev
    );

    try {
      if (mentorState.isBookmarkedByMe) {
        await unBookmark(mentorState.uuid, accessToken);
      } else {
        await bookmark(mentorState.uuid, accessToken);
      }
    } catch (e) {
      setMentorState(prev);
    }
  }

  return (
    <>
      <NextSeo
        title={`가방끈 멘토 ${mentor?.name}`}
        description="멘토링으로 대학원 궁금증 해소해요"
        canonical={`https://www.bagstrap.team/mentoring/mentorlist/${mentor?.uuid}`}
        openGraph={{
          type: 'website',
          url: `https://www.bagstrap.team/mentoring/mentorlist/${mentor?.uuid}`,
          title: `가방끈 멘토 ${mentor?.name}`,
          description: '멘토링으로 대학원 궁금증 해소해요',
          images: [
            {
              url: 'https://www.bagstrap.team/logos/mentoringPreview.png',
              alt: `가방끈 멘토 ${mentor?.name}`,
            },
          ],
          site_name: 'Bagstrap',
        }}
      />
      {isMobile ? (
        < div className="w-full max-w-[550px] mx-auto pt-[53px]">
          {/* 헤더 */}
          <div className="flex px-[20px] pb-[20px] border-b-[1px] border-gray-30">
            <div className="flex w-full justify-between">
              <button onClick={() => router.back()}>
                <LeftArrowIcon width={20} height={20} className="text-gray-50" />
              </button>
              <p className="text-semibold-16 text-gray-90">{''}</p>
              {/* Bookmark button */}
              <button
                onClick={event => {
                  mixpanel.track('click_scrap_mentor_mdetail', {
                    view: `${mentor?.uuid}`
                  });
                  handleBookmark(event);
                }}
                className="w-[20px] h-[20px]"
              >
                <BookmarkIcon
                  width={20}
                  height={20}
                  className={
                    mentorState?.isBookmarkedByMe ? 'text-yellow' : 'text-gray-50'
                  }
                />
              </button>
            </div>
          </div>
          {/* 연구자 detail info */}
          <div className="flex flex-col w-full pt-[24px] px-[20px] gap-[20px]">
            {/* 연구자 name + hastag + icon */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-[4px]">
                <p className="text-bold-20 text-black">{mentorState?.name}</p>
                <div className="flex flex-wrap gap-[4px] text-[#4D6CD9] text-semibold-14 mb-[8px]">
                  {mentorState?.hashTags?.map((v, idx) => {
                    return <p key={v + idx}>{'#' + v}</p>;
                  })}
                </div>
              </div>
              <MentorEmojiIcon width={48} height={48} />
            </div>
            {/* 연구자 description */}
            <p className="flex text-med-70 text-gray-70 whitespace-pre-line">
              {mentorState?.description}
            </p>
            {/* 연구자 education */}
            <div className="flex flex-col">
              <div className="flex text-bold-16 text-black pb-[8px] mb-[8px] border-b-[1px] border-gray-20">
                학력
              </div>
              {/* education */}
              {mentorState?.educations?.map((v, idx) => {
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
                    <p className="text-reg-14 text-gray-90 whitespace-pre-line">
                      {v?.detail}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* 연구자 experiences */}
            <div className="mb-[24px]">
              <div className="flex text-bold-16 text-black mb-[8px] pb-[8px] border-b-[1px] border-gray-20">
                경력
              </div>
              {/* career */}
              <div className="flex gap-[8px] mb-[8px]">
                {mentorState?.experiences && <CrownIcon width={24} height={24} />}
                <div className="flex flex-col">
                  {mentorState?.experiences?.map((v, idx) => {
                    return (
                      <p
                        key={idx}
                        className="text-reg-14 text-gray-90 whitespace-pre-line"
                      >
                        {v?.detail}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* recommendation */}
          <div className="flex flex-col gap-[16px] bg-gray-20 px-[20px] pt-[28px]">
            <div className="flex flex-1 text-bold-16 text-black pb-[8px] border-b-[1px] border-gray-20">
              이런 분들에게 추천드려요
            </div>
            <div className="w-full flex flex-col gap-[8px]">
              {/* RecommendationCard */}
              {/* 1번 카드 */}
              <div className="flex flex justify-between w-full p-[20px] bg-white rounded-[20px]">
                <div className="flex gap-[4px] text-bold-16 mb-[8px]">
                  <p className="text-gray-60">01</p>
                  <p className="text-gray-90">진로 고민</p>
                </div>
                <MentorThinkingIcon width={40} height={40} />
              </div>
              {/* 2번 카드 */}
              <div className="flex flex justify-between w-full p-[20px] bg-white rounded-[20px]">
                <div className="flex gap-[4px] text-bold-16 mb-[8px]">
                  <p className="text-gray-60">02</p>
                  <p className="text-gray-90">커리어 상담</p>
                </div>
                <MentorMapIcon width={40} height={40} />
              </div>
              {/* 3번 카드 */}
              <div className="flex flex justify-between w-full p-[20px] bg-white rounded-[20px]">
                <div className="flex gap-[4px] text-bold-16 mb-[8px]">
                  <p className="text-gray-60">03</p>
                  <p className="text-gray-90">CV 이력서 작성</p>
                </div>
                <MentorSpringIcon width={40} height={40} />
              </div>
              {/* 4번 카드 */}
              <div className="flex flex justify-between w-full p-[20px] bg-white rounded-[20px]">
                <div className="flex gap-[4px] text-bold-16 mb-[8px]">
                  <p className="text-gray-60">04</p>
                  <p className="text-gray-90">석박사 취업 상담</p>
                </div>
                <MentorBagIcon width={40} height={40} />
              </div>
            </div>
          </div>
          {/* review */}
          <div className="flex flex-col gap-[16px] bg-gray-20 px-[20px] pt-[28px] pb-[32px]">
            <div className="flex flex-1 text-bold-16 text-black pb-[8px] border-b-[1px] border-gray-20">
              참여후기
            </div>
            {/* MentorReviewCard */}
            {/* TOdo: 멘토에따른 리뷰 데이터셋으로 전환 */}
            <div className="w-full gap-[8px] flex flex-col">
              {reviewList &&
                reviewList.length > 0 &&
                reviewList.map((review, idx) => (
                  <div
                    key={review.uuid || idx}
                    className="flex flex-col px-[20px] pt-[16px] pb-[20px] rounded-[20px] bg-white"
                  >
                    {/* 별점 및 리뷰 작성 날짜 라인 */}
                    <div className="flex gap-[8px] items-center mb-[12px]">
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
                ))}
            </div>
          </div>
        </div>
      )
        : (
          <div className="flex flex-col w-full min-w-[1440px] max-w-[1920px] mx-auto">
            <GlobalHeader />
            <div className='px-[80px] pt-[40px] flex w-[1440px] gap-[80px] mx-auto'>
              <div className="w-full flex-1 flex-col">
                <DesktopMentorDetailInfo
                  mentor={mentorState}
                  handleBookmark={handleBookmark}
                />
                <DesktopMentorRecommendationSection />
                <DesktopMentorReviewSection reviewList={reviewList} />
              </div>
              <div
                className="sticky top-[120px] flex h-fit w-[400px] px-[32px] py-[40px] rounded-[24px] flex"
                style={{ boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)' }}
              >
                <Calendar
                  mentorInfo={mentorState}
                  price={price}
                  originPrice={mentorState?.originPrice as number}
                />
              </div>
            </div>

            <Footer />
          </div>
        )
      }
      {/* 하단 고정 & 1024px까지만 */}
      {isMobile && !isPaymentOpen && (
        <div
          style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)' }}
          className="fixed flex bottom-0 left-0 w-full bg-white px-[24px] pt-[16px] pb-[32px] justify-between z-[500]"
        >
          {/* 설명 및 가격 */}
          <div>
            <p className="text-semibold-12 text-gray-70">멘토링 1회권 (60분)</p>
            <div className="flex gap-[4px] items-center">
              {/* Todo: 로그인 여부, 쿠폰 소유 여부에 따라 할인가 띄우기 */}
              {mentor?.originPrice !== price && (
                <p className="text-semibold-16 text-gray-50 line-through">
                  {mentor?.originPrice?.toLocaleString() + '원'}
                </p>
              )}
              <p className="text-bold-16 text-gray-90">
                {price?.toLocaleString() + '원'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="bg-normal px-[28px] py-[12px] text-white text-bold-16 rounded-[12px]"
          >
            신청하기
          </button>
        </div>
      )}
      <ModalCalendar
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        mentorInfo={mentorState}
        price={price}
        originPrice={mentor?.originPrice as number}
      />
      {AuthModalComponent}
    </>
  );
}
