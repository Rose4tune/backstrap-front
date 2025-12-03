import { ApiResponse } from 'types/ApiResponseType';
import { components } from 'src/types/api';
import axios from 'axios';

type KeywordViewDto = components['schemas']['KeywordViewDto'];

export async function getAllKeywords(
  accessToken?: string
): Promise<ApiResponse<KeywordViewDto[]>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/keyword/get-all`;

  try {
    const response = await axios.get<KeywordViewDto[]>(requestUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200) {
      return {
        success: true,
        data
      };
    }

    let message = '키워드 목록을 불러오지 못했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '서버를 찾을 수 없습니다.';
        break;
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