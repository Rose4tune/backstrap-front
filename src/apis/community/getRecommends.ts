import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// Use the proper API types
type BoardEntityView = components['schemas']['BoardEntityView'];

export type { BoardEntityView as RecommendPost };

export default async function getRecommends(boardUuid?: string): Promise<ApiResponse<BoardEntityView[]>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/board/get-recommends`;

  try {
    const response = await axios.get(requestUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: boardUuid ? { boardUUid: boardUuid } : undefined,
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data
      };
    }

    let message = '유사한 끈 추천을 불러오는데 실패했습니다.';
    switch (status) {
      case 404:
        message = '추천 데이터를 찾을 수 없습니다.';
        break;
      case 500:
        message = '서버 오류가 발생했습니다.';
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