import FillButton from '@common/button/FillButton';
import { useRouter } from 'next/router';
import { paymentConfirm } from 'src/apis/payment/confirmPayment';

type PaymentType = 'NORMAL' | 'BILLING' | 'BRANDPAY';
export default function SuccessPage() {
  const router = useRouter();
  const {
    paymentKey: rawPaymentKey,
    orderId: rawOrderId,
    amount: rawAmount,
    paymentType: rawPaymentType,
    mentorUuid: rawMentorUuid
  } = router.query;

  //타입 변환 안전하게 시행
  const paymentKey = typeof rawPaymentKey === 'string' ? rawPaymentKey : '';
  const orderId = typeof rawOrderId === 'string' ? rawOrderId : '';
  const amount =
    typeof rawAmount === 'string' && !isNaN(Number(rawAmount)) ? Number(rawAmount) : 0;
  const paymentType = typeof rawPaymentType === 'string' ? rawPaymentType : '';
  const mentorUuid = typeof rawMentorUuid === 'string' ? rawMentorUuid : '';
  async function confirmPayment() {
    //서버에서 다시 한번 확인해야 하는 구조임
    try {
      const response = await paymentConfirm({
        payPrice: amount,
        paymentKey: paymentKey,
        paymentType: paymentType as PaymentType,
        targetType: 'RESERVATION',
        targetUuid: orderId
      });
      if (response.success) {
        sessionStorage.removeItem('mentoring-time-selection');
        router.push({
          pathname: '/mentoring/payments/complete',
          query: {
            mentorUuid: mentorUuid
          }
        });
      } else {
        // 실패 응답처리
        router.push({
          pathname: '/mentoring/payments/fail',
          query: {
            errorMessage: response.messages || '결제 승인에 실패했습니다.',
            mentorUuid: mentorUuid
          }
        });
      }
    } catch (error: any) {
      router.push({
        pathname: '/mentoring/payments/fail',
        query: {
          errorMessage: error.message || '알 수 없는 오류가 발생했습니다.',
          mentorUuid: mentorUuid
        }
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col w-full flex-col items-center justify-center min-h-screen max-w-[550px] mx-auto">
      <div className="flex flex-1 flex-col w-full justify-center align-center">
        <div className="flex justify-center mb-[40px]">
          <img
            src="https://static.toss.im/lotties/loading-spot-apng.png"
            width="120"
            height="120"
          />
        </div>
        <div>
          <p className="text-semibold-16 text-gray-90 text-center">
            결제 요청까지 성공했어요.
          </p>
          <p className="text-semibold-16 text-gray-90 text-center">
            결제 승인하고 완료해보세요.
          </p>
        </div>
      </div>
      <div className="flex flex-1 w-full px-[20px]">
        <FillButton size="Large" buttonStatus={'active'} onClick={() => confirmPayment()}>
          결제 승인하기
        </FillButton>
      </div>
    </div>
  );
}
