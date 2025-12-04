import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

export interface VoteActionParams {
  voteUuid: string;
  voteItemUuids: string[];
}

type VoteActionResponse = components['schemas']['VoteEntityView'];

/**
 * 투표를 실행하는 API 함수
 * @param params - 투표 실행에 필요한 데이터 (투표 UUID, 선택한 항목 UUIDs)
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<VoteActionResponse>>
 */
export default async function voteAction(
  params: VoteActionParams,
  accessToken?: string
): Promise<ApiResponse<VoteActionResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/vote/action`;

  // 필수 필드 유효성 검증
  if (!params.voteUuid || !params.voteItemUuids || params.voteItemUuids.length === 0) {
    return {
      success: false,
      messages: '투표 정보가 올바르지 않습니다.'
    };
  }

  const requestBody = {
    voteUuid: params.voteUuid,
    voteItemUuids: params.voteItemUuids
  };

  try {
    const headers: Record<string, string> = {
      Accept: '*/*',
      'Content-Type': 'application/json'
    };

    // 인증 토큰이 있는 경우 헤더에 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('Vote action request:', JSON.stringify(requestBody));

    const response = await axios.post(requestUrl, requestBody, {
      headers,
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data
      };
    }

    let message = '투표에 실패했습니다.';

    switch (status) {
      case 400:
        message = '투표 정보를 다시 확인해주세요.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '투표 권한이 없습니다.';
        break;
      case 404:
        message = '투표를 찾을 수 없습니다.';
        break;
      case 409:
        message = '이미 투표한 항목입니다.';
        break;
      case 422:
        message = '선택한 투표 항목이 올바르지 않습니다.';
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
    console.error('Vote action error:', error);

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