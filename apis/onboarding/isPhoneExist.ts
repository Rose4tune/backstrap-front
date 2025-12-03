import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export async function isPhoneExist(phone: string): Promise<ApiResponse<boolean>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/user/is-exist-phone`;

  try {
    const response = await axios.get<boolean>(requestUrl, {
      params: { phone },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true // HTTP 상태코드에 상관없이 응답 처리
    });

    const { status, data } = response;

    if (status === 200) {
      return {
        success: true,
        data
      };
    }

    let message = '이메일 존재 여부 확인에 실패했습니다.';

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
