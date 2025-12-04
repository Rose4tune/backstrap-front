import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { headers } from 'next.config';
import { components } from 'src/types/api';

type UserEntityView = components['schemas']['UserEntityView'];

export default async function getMe(
  accessToken: string
): Promise<ApiResponse<UserEntityView>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user/get-me`;

  try {
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });
    // console.log(JSON.stringify(response.data))

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data
      };
    }
    let message = '회원정보 조회에 실패했습니다.';
    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '회원정보 조회 권한이 없습니다.';
        break;
      case 404:
        message = '회원정보를 조회할 수 없습니다.';
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
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}
