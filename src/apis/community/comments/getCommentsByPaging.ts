import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// API 스키마에서 타입 가져오기
type ReviewPaginationResultDto = components['schemas']['ReviewPaginationResultDto'];

export interface GetCommentsByPagingParams {
  parentEntityUuid: string;
  parentEntityType: 'BOARD' | 'REVIEW' | 'ARTICLE';
  reviewType?: 'BOARD' | 'REVIEW';
  sortType?: 'RECENT' | 'LIKE' | 'OLDEST';
  page: number;
  count: number;
  cursor?: string;
}

/**
 * 댓글 목록을 페이징으로 조회하는 API 함수
 * @param params - 댓글 조회에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<ReviewPaginationResultDto>>
 */
export default async function getCommentsByPaging(
  params: GetCommentsByPagingParams,
  accessToken?: string
): Promise<ApiResponse<ReviewPaginationResultDto>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/review/get-by-paging`;

  // 필수 필드 유효성 검증
  if (!params.parentEntityUuid || !params.parentEntityType || params.page < 0 || params.count <= 0) {
    return {
      success: false,
      messages: '필수 정보가 누락되었거나 올바르지 않습니다.'
    };
  }

  try {
    const headers: Record<string, string> = {
      Accept: '*/*',
      'Content-Type': 'application/json'
    };

    // 인증 토큰이 있는 경우 헤더에 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // ReviewFetchDto 구조에 맞춰 paginationRequestDto 사용
    const requestBody = {
      parentEntityUuid: params.parentEntityUuid,
      parentEntityType: params.parentEntityType,
      reviewType: params.reviewType || 'BOARD',
      sortType: params.sortType || 'RECENT',
      paginationRequestDto: {
        page: params.page,
        count: params.count,
        ...(params.cursor && { cursor: params.cursor })
      }
    };

    // console.log('Comments paging request:', JSON.stringify(requestBody));

    const response = await axios.post(requestUrl, requestBody, {
      headers,
      validateStatus: () => true
    });
    // console.log(JSON.stringify(response.data))
    const { status, data } = response;

    if (status === 200) {
      return {
        success: true,
        data: data
      };
    }

    let message = '댓글 목록 조회에 실패했습니다.';

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
        message = '게시글을 찾을 수 없습니다.';
        break;
      case 422:
        message = '입력한 데이터가 올바르지 않습니다.';
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
    console.error('Comments paging error:', error);

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