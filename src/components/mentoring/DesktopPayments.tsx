import FillButton from '@common/button/FillButton';
import DropdownInput from '@common/input/DropdownInput';
import TextField from '@common/input/TextField';
import useAuthGuardModalDialog from '@hooks/bagstrap/user/useAuthGuardModalDialog.hook';
import PageLayout from '@layouts/PageLayout';
import { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import mixpanel from 'mixpanel-browser';
import { useEffect, useState } from 'react';
import { makeReservation } from 'src/apis/mentor-reservation/makeReservation';
import getMyCoupons from 'src/apis/user-coupon/my';
import getMe from 'src/apis/user/getMe';
import MentorEmojiIcon from 'src/assets/icons/mentoring/[renewal]MentorEmoji.svg';
import { components } from 'src/types/api';
import DiscountPopupWithLogin from './mentoringPaymentsPageComponents/DiscountPopupWithLogin';
import useAccessToken from 'src/hooks/useAcessToken';
import { getParsedMentoringSelection } from 'src/utils/parseMentoringSelection';
import { useRouter } from 'next/router';
import PaymentsLoginAttractionPopup from './mentoringPaymentsPageComponents/PaymentsLoginAttractionPopup';
import GlobalHeader from '../header/GlobalHeader';

// 동적으로 현재 호스트를 감지하여 BASE_URL 설정
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // 서버 사이드에서는 환경 변수 또는 기본값 사용
  return process.env.NEXT_PUBLIC_BASE_URL || 
         (process.env.NODE_ENV === 'development' 
           ? 'http://localhost:3000' 
           : 'https://backstrap-front.vercel.app');
};
const BASE_URL = getBaseUrl();
type MentorViewDto = components['schemas']['MentorViewDto'];

type UserViewDto = components['schemas']['UserViewDto'];
type UserCouponViewDto = components['schemas']['UserCouponViewDto'];

type PaymentPageProps = {
  mentor: MentorViewDto | null;
  widgets: TossPaymentsWidgets | null;
  amount: {
    currency: string;
    value: number;
  };
  setAmount: React.Dispatch<
    React.SetStateAction<{
      currency: string;
      value: number;
    }>
  >;
  ready: boolean;
};
export default function DesktopPaymentPage({
  mentor,
  widgets,
  amount,
  setAmount,
  ready
}: PaymentPageProps) {
  //사용자 주문정보
  const [userInfo, setUserInfo] = useState<UserViewDto | null | undefined>(null);
  const [orderUserName, setOrderUserName] = useState<string>();
  const [orderUserPhone, setOrderUserPhone] = useState<string>();
  const [orderUserEmail, setOrderUserEmail] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false); //수정중 여부, 초기 렌더링 시 무조건 true
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false); //전체 채워짐 여부
  const accessToken = useAccessToken();
  const [coupon, setCoupon] = useState<UserCouponViewDto | null>(null); //coupon 상태 조정
  const [couponList, setCouponList] = useState<UserCouponViewDto[] | null | undefined>(
    null
  );
  const [activeToolTip, setActiveToolTip] = useState<boolean>(true);
  const [AuthModalComponent, openAuthModal, closeAuthModal] = useAuthGuardModalDialog();
  const [isPhoneNumberError, setIsPhoneNumberError] = useState<boolean>(false);
  const [reservationUuid, setReservationUuid] = useState<string | null | undefined>(null);
  const router = useRouter();
  ////날짜 선택 관련 : sessionStorage에서 파싱해오기
  const parsed = getParsedMentoringSelection();
  if (!parsed) {
    router.back();
    return null;
  }
  const { formattedDateStr, formattedDate, formattedTime, startTime, endTime, duration } =
    parsed;

  // coupon 옵션 생성 (DropdownOption[])
  const couponOptions =
    (couponList ?? [])
      .map((u) => u?.coupon?.description)
      .filter((d): d is string => !!d)               // undefined 제거 + 타입 내로잉
      .map((d) => ({ label: d, value: d }));         // DropdownOption 형태로 변환


  //내 정보 저장
  useEffect(() => {
    if (!accessToken) return;

    async function getMyInfo() {
      const myInfo = await getMe(accessToken);
      setUserInfo(myInfo.data);
      setOrderUserName(myInfo.data?.realName);

      //소셜로그인으로 인해 .kakao, .apple로 끝나는 경우만 제외
      const cleanEmail = (email: string | undefined) => {
        if (!email) return '';
        return email.replace(/\.kakao$/, '').replace(/\.apple$/, '');
      };

      setOrderUserEmail(cleanEmail(myInfo.data?.email));
      setOrderUserPhone(myInfo.data?.phone);
    }

    getMyInfo();
  }, [accessToken, setOrderUserName, setOrderUserPhone, setOrderUserEmail, setUserInfo]);

  //초기 렌더링 시 정보가 다 안 차 있으면 editing true
  useEffect(() => {
    if (!isAllFilled) {
      setIsEditing(true);
    }
  }, [isAllFilled]);

  //금액 설정
  useEffect(() => {
    if (widgets == null) {
      return;
    }
    widgets.setAmount(amount);
  }, [widgets, amount]);

  //내 쿠폰 정보 받아오고 가장 높은 애로 할인율 자동 설정
  useEffect(() => {
    async function getMyCoupon() {
      const fetchedCouponList = (await getMyCoupons(accessToken)).data;

      setCouponList(fetchedCouponList); // 리스트 업데이트 먼저

      // 쿠폰 할인율 높은 순대로 고정
      const sortedCouponsByRate = [...(fetchedCouponList ?? [])].sort(
        (a, b) =>
          (b?.coupon?.discountFixedRate || 0) - (a?.coupon?.discountFixedRate || 0)
      );

      const bestCoupon = sortedCouponsByRate[0] || null;
      const bestDiscountRate = bestCoupon?.coupon?.discountFixedRate || 0;

      setCoupon(bestCoupon); //쿠폰 초기 자동 설정
      setAmount({
        currency: 'KRW',
        value: (1 - 0.01 * bestDiscountRate) * (mentor?.originPrice as number) * duration
      });
    }

    if (accessToken) {
      getMyCoupon();
    }
  }, [accessToken, mentor?.originPrice]);

  useEffect(() => {
    setAmount({
      currency: 'KRW',
      value:
        (1 - 0.01 * (coupon?.coupon?.discountFixedRate || 0)) *
        (mentor?.originPrice as number) *
        duration
    });
  }, [coupon, setAmount, duration]);

  //phoneNumber 조절
  useEffect(() => {
    if (!isAllFilled) {
      setIsPhoneNumberError(false);
      return;
    }
    const isValid = /^[0-9]{10,11}$/.test(orderUserPhone || '');
    setIsPhoneNumberError(!isValid);
  }, [orderUserPhone, isAllFilled]);

  //입력창 버튼 status 조절
  useEffect(() => {
    const isActive =
      (orderUserEmail?.length || 0) > 0 &&
      (orderUserName?.length || 0) > 0 &&
      (orderUserPhone?.length || 0) > 0;

    setIsAllFilled(isActive);
  }, [orderUserEmail, orderUserName, orderUserPhone, setIsAllFilled]);

  ///////금액 관련///////////////
  const originPrice = (mentor?.originPrice ?? 0) * duration;
  const discountRate = coupon?.coupon?.discountFixedRate ?? 0;
  const discountAmount = Math.floor((discountRate / 100) * originPrice);
  const formattedDiscount = discountAmount
    ? `-${discountAmount.toLocaleString()}원`
    : null;

  return (
    <>
      {AuthModalComponent}

      <div className="flex flex-col w-full min-w-[1440px] max-w-[1920px] mx-auto">
        <GlobalHeader />
        {/* Body */}
        <div className="w-full flex gap-[40px] px-[40px] pt-[40px] max-w-[1440px] mx-auto">
          <div className="w-full flex flex-1 flex-col mx-auto max-w-[860px]">
            {/* userInfo */}
            <div className="mb-[40px]">
              <p className="text-bold-20 text-black mb-[16px]">신청자 정보</p>
              {!isEditing && (
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-col flex-1">
                    <p className="text-semibold-22 text-black">{orderUserName}</p>
                    <p className="text-med-16 text-gray-60">
                      <p>{orderUserPhone}</p>
                      <p>{orderUserEmail}</p>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-gray-20 border-[1px] border-gray-30 rounded-[8px] px-[12px] py-[8px] text-med-14 text-black"
                    style={{ height: '36px' }}
                  >
                    연락처 수정
                  </button>
                </div>
              )}
              {isEditing && (
                <div className="flex flex-col flex-1 gap-[20px]">
                  <div className="flex flex-col flex-1">
                    <TextField
                      title={'이름'}
                      device={'mobile'}
                      value={orderUserName || ''}
                      onChange={event => setOrderUserName(event)}
                      placeholder="실명을 입력해주세요"
                      onClick={() =>
                        mixpanel.track('input_name', { view: 'mentoring_pay' })
                      }
                    />
                    <TextField
                      title={'전화번호'}
                      device={'mobile'}
                      value={orderUserPhone || ''}
                      onChange={(value: string) => {
                        const onlyNumbers = value.replace(/\D/g, ''); // 숫자만 남김
                        setOrderUserPhone(onlyNumbers);
                      }}
                      placeholder="전화번호를 입력해주세요"
                      isError={isPhoneNumberError}
                      errorMessage="올바른 전화번호를 입력해주세요."
                      inputMode="numeric"
                      onClick={() =>
                        mixpanel.track('input_num', { view: 'mentoring_pay' })
                      }
                    />
                    <TextField
                      title={'이메일'}
                      device={'mobile'}
                      value={orderUserEmail || ''}
                      onChange={event => setOrderUserEmail(event)}
                      placeholder="이메일을 입력해주세요"
                      onClick={() =>
                        mixpanel.track('input_mail', { view: 'mentoring_pay' })
                      }
                    />
                  </div>
                  <FillButton
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    buttonStatus={isAllFilled ? 'active' : 'disable'}
                    size={'XLarge'}
                  >
                    예약 정보 수정하기
                  </FillButton>
                </div>
              )}
            </div>

            {/* OrderInfo */}
            <div className="flex flex-1 flex-col py-[12px] gap-[20px] mb-[40px]">
              <p className="text-bold-20 text-black">주문 상품</p>
              <div className="flex flex-1 justify-between items-center">
                <div className="flex flex-1 gap-[12px]">
                  <MentorEmojiIcon width={80} height={80} />
                  <div className="flex flex-col gap-[4px]">
                    <div className="flex flex-1 gap-[8px] items-center">
                      <p className="text-bold-16 text-gray-90">{mentor?.name}</p>
                      <p className="text-med-16 text-gray-70">{`멘토링 (${duration}시간)`}</p>
                    </div>
                    <p className="text-med-14 text-gray-70">
                      {/* Todo: 쿼리로 날짜 정보 받아야함 */}
                      <p>{formattedDate}</p>
                      <p>{formattedTime}</p>
                    </p>
                  </div>
                </div>
                {/* 쿠폰 가격 표시 */}
                <div className="flex flex-col items-center justify-center">
                  {coupon && (
                    <div className="text-med-16 text-gray-60 line-through">
                      {originPrice.toLocaleString() + '원'}
                    </div>
                  )}
                  <div className="text-semibold-16 text-gray-90">
                    {amount.value?.toLocaleString() + '원'}
                  </div>
                  {coupon && (
                    <div className="text-med-16 text-gray-50">쿠폰 적용가</div>
                  )}
                </div>
              </div>
            </div>
            {/* Coupon */}
            <div className="flex flex-1 flex-col py-[12px] gap-[20px] mb-[40px]">
              <p className="text-bold-20 text-black">쿠폰</p>
              <div
                className="flex flex-1 gap-[8px] items-center justify-center"
                onClick={() => {
                  mixpanel.track('click_coupon_list', { view: 'mentoring_pay' });
                  setActiveToolTip(false);
                }}
              >
                <DropdownInput
                  options={couponOptions}
                  placeholder={'쿠폰을 선택해주세요'}
                  title={''}
                  // Todo: description이 일치하는 경우 대비할 것
                  onChange={selectedDescription => {
                    const selectedCoupon = couponList?.find(
                      coupon => coupon?.coupon?.description === selectedDescription
                    );
                    setCoupon(selectedCoupon || null);
                  }}
                  value={coupon?.coupon?.description || ''}
                />
                <button
                  onClick={() => {
                    mixpanel.track('mentoring_pay', { action: 'click_x_coupon' });
                    setCoupon(null);
                  }}
                  className="h-[56px] px-[12px] py-[8px] text-bold-14 text-gray-90 rounded-[12px] bg-gray-30 whitespace-nowrap"
                >
                  사용 취소
                </button>
              </div>
              {/* 말풍선 */}
              {activeToolTip && coupon && <DiscountPopupWithLogin />}
              {!coupon && !accessToken && (
                <button
                  onClick={() => {
                    mixpanel.track('click_login_get_coupon', {
                      view: 'mentoring_pay'
                    });
                    openAuthModal();
                  }}
                >
                  <PaymentsLoginAttractionPopup />
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col py-[12px] gap-[20px]">
              <p className="text-bold-20 text-black">결제 수단</p>
              <div id="payment-method" />
              <div id="Agreement" />
            </div>
          </div>
          <div
            className="sticky top-[120px] flex h-fit flex-col rounded-[24px] mb-[8px]"
            style={{
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
              width: '400px',
              padding: '28px 24px'
            }}
          >
            <div className="text-bold-20 text-black mb-[12px]">결제 금액</div>
            <div className="w-full flex-1 text-med-16 text-black flex mb-[4px]">
              <div className="flex flex-1">상품 금액</div>
              <div className="flex">{originPrice.toLocaleString() + '원'}</div>
            </div>
            <div className="w-full flex-1 text-med-16 text-black flex mb-[12px]">
              <div className="flex flex-1">할인 금액</div>
              <div
                className={`flex ${coupon !== null ? 'text-red' : 'text-gray-50  '}`}
              >
                {coupon !== null ? formattedDiscount : '0원'}
              </div>
            </div>
            <div
              className="flex text-bold-16 text-black border-b-[1px] border-gray-30"
              style={{ paddingBottom: '24px' }}
            >
              <div className="flex flex-1">총 결제 금액</div>
              <div className="flex gap-[4px]">
                {coupon && <div className="text-red">{'-' + discountRate + '%'}</div>}
                <div> {amount.value?.toLocaleString() + '원'}</div>
              </div>
            </div>
            {/* 결제하기 버튼 */}
            <FillButton
              className="my-[20px] flex-1 w-full"
              buttonStatus={(ready && isAllFilled && !isPhoneNumberError) ? 'active' : 'disable'}
              disabled={!(ready && isAllFilled && !isPhoneNumberError)}
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
              onClick={async () => {
                mixpanel.track('click_pay', { view: 'mentoring_pay' });
                try {
                  if (reservationUuid == null) {
                    const response = await makeReservation({
                      date: formattedDateStr,
                      startTime: startTime,
                      endTime: endTime,
                      userCouponUuid: coupon?.uuid, //nullable
                      userEmail: orderUserEmail,
                      userPhone: orderUserPhone,
                      userName: orderUserName,
                      userUuid: userInfo?.uuid, //nullable
                      mentorUuid: mentor?.uuid,
                      entityStatus: 'ACTIVE'
                    });
                    if (!response.success) {
                      alert(response.messages);
                      return;
                    }
                    setReservationUuid(response.data?.uuid);
                    await widgets?.requestPayment({
                      orderId: response.data?.uuid as string, //고유주문번호
                      orderName: mentor?.name as string,
                      successUrl: `${BASE_URL}/mentoring/payments/success?mentorUuid=${mentor?.uuid}`, // 결제 요청이 성공하면 리다이렉트되는 URL
                      failUrl: `${BASE_URL}/mentoring/payments/fail?mentorUuid=${mentor?.uuid}`, // 결제 요청이 실패하면 리다이렉트되는 URL
                      customerEmail: orderUserEmail,
                      customerName: orderUserName,
                      customerMobilePhone: orderUserPhone // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다.
                    });
                  } else {
                    await widgets?.requestPayment({
                      orderId: reservationUuid as string, //고유주문번호
                      orderName: mentor?.name as string,
                      successUrl: `${BASE_URL}/mentoring/payments/success?mentorUuid=${mentor?.uuid}`, // 결제 요청이 성공하면 리다이렉트되는 URL
                      failUrl: `${BASE_URL}/mentoring/payments/fail?mentorUuid=${mentor?.uuid}`, // 결제 요청이 실패하면 리다이렉트되는 URL
                      customerEmail: orderUserEmail,
                      customerName: orderUserName,
                      customerMobilePhone: orderUserPhone // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다.
                    });
                  }
                } catch (error) {
                  // 에러 처리하기
                  alert(error);
                }
              }}
              size={'Large'}
            >
              <p className="flex gap-[4px]">
                {originPrice !== amount.value && (
                  <p className="text-bold-16 text-white opacity-50% line-through">
                    {originPrice + '원'}
                  </p>
                )}
                <p className="text-bold-16 text-white">
                  {amount.value?.toLocaleString() + '원'}
                </p>
                <p className="text-bold-16 text-white">결제하기</p>
              </p>
            </FillButton>
          </div>
        </div>
      </div>
    </>
  );
}
