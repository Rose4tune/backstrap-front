import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

//유저 쿠폰 발행
export async function issueMyCoupon(
  couponUuid: string,
  accessToken: string
): Promise<ApiResponse<void>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-coupon/issue-my-coupon?couponUuid=${couponUuid}`;

  try {
    const response = await axios.post(
      requestUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      }
    );

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: undefined,
        messages: '쿠폰이 성공적으로 발급되었습니다.'
      };
    }

    let message = data || '쿠폰 발급에 실패했습니다.';
    if (data == '재발급 가능한 쿠폰이 아닙니다.') message = '이미 발급받은 쿠폰입니다.';

    return {
      success: false,
      messages: message
    };
  } catch (error: any) {
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}
