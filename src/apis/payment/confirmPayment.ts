import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import type { components, paths } from 'src/types/api';

type paymentConfirmRequest = components['schemas']['PaymentConfirmDto'];
type PaymentConfirmResponse =
  paths['/api/v1/payment/confirm']['post']['responses']['200']['content']['*/*'];

export async function paymentConfirm(
  payload: paymentConfirmRequest
): Promise<ApiResponse<PaymentConfirmResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/payment/confirm`;

  try {
    const response = await axios.post<PaymentConfirmResponse>(requestUrl, payload, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data
      };
    }

    let message = '멘토링 예약에 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '예약 권한이 없습니다.';
        break;
      case 404:
        message = '멘토 또는 사용자 정보를 찾을 수 없습니다.';
        break;
      default:
        if (typeof data === 'object' && 'message' in data) {
          message = (data as any).message;
        }
    }

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
