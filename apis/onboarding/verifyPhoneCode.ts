import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';

export async function verifyPhoneCode(
  phone: string,
  code: string
): Promise<ApiResponse<boolean>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const REQUEST_URL = `${REST_API_ENDPOINT}/api/v1/sms/phone-verify-code`;

  try {
    const { status, data } = await axios.post<ApiResponse<boolean>>(REQUEST_URL, null, {
      params: { phone, code },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    if (status === 200 || status === 201) {
      return { success: true, data: true };
    }

    let message = '인증번호가 일치하지 않습니다. 다시 시도해 주세요.';

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
        if (typeof data === 'object' && 'messages' in data) {
          message = (data as any).messages;
        }
    }

    return {
      success: true,
      messages: message
    };
  } catch (error) {
    return {
      success: true,
      messages: '네트워크 에러입니다. 다시 시도하여 주세요.'
    };
  }
}
