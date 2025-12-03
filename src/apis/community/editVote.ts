import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// API 스키마에서 타입 가져오기
type VoteEditDto = components['schemas']['VoteEditDto'];
type VoteEntityView = components['schemas']['VoteEntityView'];

export interface EditVoteParams {
  uuid: string;
  selectedContentUuids?: string[];
  isDone?: boolean;
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
  changeLog?: string;
}

type EditVoteResponse = VoteEntityView;

/**
 * 투표를 수정하는 API 함수
 * @param params - 투표 수정에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<EditVoteResponse>>
 */
export default async function editVote(
  params: EditVoteParams,
  accessToken?: string
): Promise<ApiResponse<EditVoteResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/vote/edit`;

  // 필수 필드 유효성 검증
  if (!params.uuid) {
    return {
      success: false,
      messages: '투표 UUID가 필요합니다.'
    };
  }

  const requestBody: VoteEditDto = {
    uuid: params.uuid,
    selectedContentUuids: params.selectedContentUuids,
    isDone: params.isDone,
    entityStatus: params.entityStatus,
    changeLog: params.changeLog
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

    console.log('Edit vote request:', JSON.stringify(requestBody));

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

    let message = '투표 수정에 실패했습니다.';

    switch (status) {
      case 400:
        message = '투표 수정 정보를 다시 확인해주세요.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '투표 수정 권한이 없습니다.';
        break;
      case 404:
        message = '투표를 찾을 수 없습니다.';
        break;
      case 409:
        message = '투표가 이미 수정되었거나 충돌이 발생했습니다.';
        break;
      case 422:
        message = '투표 수정 데이터가 올바르지 않습니다.';
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
    console.error('Edit vote error:', error);

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