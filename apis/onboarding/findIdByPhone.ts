import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export async function findIdByPhone(
  name: string,
  phone: string
): Promise<ApiResponse<boolean>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const REQUEST_URL = `/api/v1/user/find-id-by-phone`;

  try {
    const { status, data } = await axios.post<boolean>(REQUEST_URL, null, {
      params: { name, phone },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    if ((status === 200 || status === 201) && data === true) {
      return { success: true, data };
    }

    let message = '입력하신 정보와 일치하는 계정을 찾을 수 없습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '현재 가방끈에 등록되어 있지 않은 번호에요.';
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
