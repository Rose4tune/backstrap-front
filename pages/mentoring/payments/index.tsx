// 주문할 mentor의 페이지 라우터로 uuid를 받아야함.
import DropdownInput from '@common/input/DropdownInput';
import { GetServerSideProps } from 'next';
import {
  ANONYMOUS,
  loadTossPayments,
  TossPaymentsWidgets,
  WidgetAgreementWidget,
  WidgetPaymentMethodWidget
} from '@tosspayments/tosspayments-sdk';
import React, { useEffect, useState } from 'react';
import { components } from 'src/types/api';
import { getMentorByUuid } from 'src/apis/mentor/getMentorByUuid';
import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { useCookies } from 'react-cookie';
import getMe from 'src/apis/user/getMe';
import { useMediaQuery } from '@mui/material';
import DesktopPaymentPage from 'src/components/mentoring/DesktopPayments';
import MobilePaymentPage from 'src/components/mentoring/MobilePayments';
import mixpanel from 'mixpanel-browser';

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
type MentorViewDto = components['schemas']['MentorViewDto'];

type UserViewDto = components['schemas']['UserViewDto'];
type PaymentPageProps = {
  mentor: MentorViewDto | null;
  date: string;
  time: string;
};

export const getServerSideProps: GetServerSideProps<PaymentPageProps> = async context => {
  const { uuid: _uuid, date: _date, time: _time } = context.query;

  const uuid = Array.isArray(_uuid) ? _uuid[0] : _uuid || '';
  const dateStr = Array.isArray(_date) ? _date[0] : _date || '';
  const time = Array.isArray(_time) ? _time[0] : _time || '';

  const mentor = (await getMentorByUuid(uuid)).data ?? null;

  return {
    props: {
      mentor,
      date: typeof dateStr === 'string' ? dateStr : '', // fallback 처리
      time: typeof time === 'string' ? time : ''
    }
  };
};

const TOSS_CLIENT_KEY = process.env.NODE_ENV === "development" ? "test_gck_DnyRpQWGrN5q6k6jBYLgVKwv1M9E" : "live_gck_LlDJaYngrojlEWO2PndmVezGdRpX";
export default function WidgetCheckoutPage({ mentor, date, time }: PaymentPageProps) {
  const isMobile = useMediaQuery('(max-width: 550px)');
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [cookies] = useCookies();
  //사용자 주문정보
  const [userInfo, setUserInfo] = useState<UserViewDto | null | undefined>(null);
  const [ready, setReady] = useState(false); //tosspayments 결제 준비 상태
  const accessToken =
    cookies[COOKIE_NS]?.authPayload?.access_token ||
    cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;
  const [paymentMethodWidget, setPaymentMethodWidget] =
    useState<WidgetPaymentMethodWidget | null>(null);
  const [agreementWidget, setAgreementWidget] = useState<WidgetAgreementWidget | null>(
    null
  );
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: mentor?.originPrice as number
  }); // toss payments 가격 상태  //내 정보 저장

  useEffect(() => {
    mixpanel.track(`View_Mentoring_Pay_${mentor?.uuid}`)
  })
  useEffect(() => {
    if (!accessToken) return;

    async function getMyInfo() {
      const myInfo = await getMe(accessToken);
      setUserInfo(myInfo.data);
    }

    getMyInfo();
  }, [accessToken, setUserInfo]);

  useEffect(() => {
    async function fetchWidgets() {
      if (widgets) return;
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      const newWidgets = tossPayments.widgets({
        customerKey: accessToken ? userInfo?.uuid || ANONYMOUS : ANONYMOUS
      });

      setWidgets(newWidgets);
    }

    fetchWidgets();
  }, [accessToken, userInfo, setWidgets]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;

      // 기존 위젯이 존재하면 먼저 destroy하고 초기화
      if (paymentMethodWidget || agreementWidget) {
        if (paymentMethodWidget) {
          await paymentMethodWidget.destroy();
          setPaymentMethodWidget(null);
        }
        if (agreementWidget) {
          await agreementWidget.destroy();
          setAgreementWidget(null);
        }
      }

      // 위젯이 없는 상태에서만 render
      await widgets.setAmount(amount);

      const newPaymentMethodWidget = await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT'
      });
      const newAgreementWidget = await widgets.renderAgreement({
        selector: '#Agreement',
        variantKey: 'DEFAULT'
      });

      setPaymentMethodWidget(newPaymentMethodWidget);
      setAgreementWidget(newAgreementWidget);
      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, isMobile]);

  return (
    <>
      {isMobile ? (
        <MobilePaymentPage
          mentor={mentor}
          date={date}
          time={time}
          widgets={widgets}
          amount={amount}
          setAmount={setAmount}
          ready={ready}
        />
      ) : (
        <DesktopPaymentPage
          mentor={mentor}
          widgets={widgets}
          amount={amount}
          setAmount={setAmount}
          ready={ready}
        />
      )}
    </>
  );
}
