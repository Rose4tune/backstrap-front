import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export async function verifyResetPasswordEmailCode(
  email: string,
  code: string
): Promise<ApiResponse<null>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const REQUEST_URL = `${REST_API_ENDPOINT}/api/v1/mail/send-reset-password-email`;

  try {
    const { status, data } = await axios.post<ApiResponse<null>>(REQUEST_URL, null, {
      params: { email, code },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    if (status === 200 || status === 201) {
      return { success: true };
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
        if (typeof data === 'object' && 'message' in data) {
          message = (data as any).message;
        }
    }

    return {
      success: false,
      messages: message
    };
  } catch (error) {
    return {
      success: false,
      messages: '네트워크 에러입니다. 다시 시도하여 주세요.'
    };
  }
}
