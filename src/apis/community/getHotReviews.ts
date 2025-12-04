import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// API 스키마에서 타입 가져오기
type ReviewViewDtoRes = components['schemas']['ReviewViewDtoRes'];

export interface GetHotReviewsParams {
  count?: number; // 조회할 인기 댓글 수 (선택사항)
}

/**
 * 인기 댓글/리뷰를 가져오는 API 함수
 * @param params - 인기 댓글 조회에 필요한 파라미터
 * @param accessToken - 인증 토큰 (선택사항)
 * @returns Promise<ApiResponse<ReviewViewDtoRes[]>>
 */
export default async function getHotReviews(
  params?: GetHotReviewsParams,
  accessToken?: string
): Promise<ApiResponse<ReviewViewDtoRes[]>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/review/get-hot-reviews`;

  try {
    const headers: Record<string, string> = {
      Accept: '*/*',
      'Content-Type': 'application/json',
    };

    // accessToken이 있으면 Authorization 헤더 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Query parameters 구성
    const queryParams = new URLSearchParams();
    if (params?.count !== undefined) {
      queryParams.append('count', params.count.toString());
    }

    const finalUrl = queryParams.toString() 
      ? `${requestUrl}?${queryParams.toString()}`
      : requestUrl;

    console.log('Hot reviews request URL:', finalUrl);

    const response = await axios.get(finalUrl, {
      headers,
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200) {
      return {
        success: true,
        data: data
      };
    }

    let message = '인기 댓글을 불러오는데 실패했습니다.';

    switch (status) {
      case 400:
        message = '요청 정보를 다시 확인해주세요.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '권한이 없습니다.';
        break;
      case 404:
        message = '인기 댓글 정보를 찾을 수 없습니다.';
        break;
      case 429:
        message = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        break;
      case 500:
        message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        break;
      default:
        if (typeof data === 'object' && data && 'message' in data) {
          message = (data as any).message;
        }
    }

    return {
      success: false,
      messages: message
    };
  } catch (error: any) {
    console.error('Get hot reviews error:', error);

    // 네트워크 오류 상세 처리
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return {
        success: false,
        messages: '네트워크 연결을 확인해주세요.'
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        messages: '요청 시간이 초과되었습니다. 다시 시도해주세요.'
      };
    }

    return {
      success: false,
      messages: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}