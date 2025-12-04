import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export async function sendResetPasswordEmail(
  name: string,
  email: string
): Promise<ApiResponse<boolean>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user/send-reset-password-email`;

  try {
    const response = await axios.post<boolean>(requestUrl, null, {
      params: {
        name,
        email
      },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if ((status === 200 || status === 201) && data === true) {
      return { success: true, data };
    }

    let message = '비밀번호 재설정 메일 발송에 실패했습니다.';

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
  } catch (error: any) {
    return {
      success: false,
      messages: '네트워크 에러입니다. 다시 시도하여 주세요.'
    };
  }
}
