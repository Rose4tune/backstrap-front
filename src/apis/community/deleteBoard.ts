import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';

export interface DeleteBoardParams {
  uuid: string;
}

/**
 * 게시글을 삭제하는 API 함수
 * @param params - 삭제할 게시글 UUID
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<void>>
 */
export default async function deleteBoard(
  params: DeleteBoardParams,
  accessToken?: string
): Promise<ApiResponse<void>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/board/delete`;

  // UUID 유효성 검증
  if (!params.uuid) {
    return {
      success: false,
      messages: '게시글 UUID가 필요합니다.'
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

    console.log('Board delete request:', params.uuid);

    const response = await axios.post(requestUrl, null, {
      headers,
      params: {
        uuid: params.uuid
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: undefined
      };
    }

    let message = '게시글 삭제에 실패했습니다.';

    switch (status) {
      case 400:
        message = '잘못된 요청입니다. 게시글 정보를 확인해주세요.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '게시글 삭제 권한이 없습니다.';
        break;
      case 404:
        message = '삭제할 게시글을 찾을 수 없습니다.';
        break;
      case 409:
        message = '이미 삭제된 게시글입니다.';
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
    console.error('Board delete error:', error);

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