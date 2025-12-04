import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export async function sendPhoneVerifyCode(
  phoneNumber: string
): Promise<ApiResponse<void>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/sms/send-phone-verify-code`;
  try {
    const response = await axios.get<boolean>(requestUrl, {
      params: { phone: phoneNumber },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if ((status === 200 || status === 201) && data === true) {
      return { success: true };
    }

    let message = '인증번호 발송에 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '요청한 리소스를 찾을 수 없습니다.';
        break;
      default:
        // 서버가 에러 메시지를 준 경우
        if (typeof data === 'object' && 'message' in data) {
          message = (data as any).message;
        }
    }

    return {
      success: false,
      messages: message
    };
  } catch (error: any) {
    // 여기서 네트워크 문제만 처리
    return {
      success: false,
      messages: '네트워크 에러입니다. 다시 시도하여 주세요.'
    };
  }
}
