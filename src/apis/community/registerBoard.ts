import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

export interface RegisterBoardParams {
  title: string;
  content: string;
  categoryUuid?: string;
  isAnonymous?: boolean;
  boardType?: 'TOTY';
  keywordUuids?: string[];
  files?: components['schemas']['FAEntityFileRegisterDto'][];
  voteRegisterDto?: components['schemas']['VoteRegisterDto'];
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
  version?: number;
}

type RegisterBoardResponse = components['schemas']['BoardEntityView'];

/**
 * 게시글을 등록하는 API 함수
 * @param params - 게시글 등록에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<RegisterBoardResponse>>
 */
export default async function registerBoard(
  params: RegisterBoardParams,
  accessToken?: string
): Promise<ApiResponse<RegisterBoardResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/board/register`;
  // 필수 필드 유효성 검증
  if (!params.title || !params.content) {
    return {
      success: false,
      messages: '제목과 내용은 필수 입력 항목입니다.'
    };
  }

  // title과 content 길이 검증
  if (params.title.trim().length === 0) {
    return {
      success: false,
      messages: '제목을 입력해주세요.'
    };
  }

  if (params.content.trim().length === 0) {
    return {
      success: false,
      messages: '내용을 입력해주세요.'
    };
  }

  // 제목 길이 제한 (일반적으로 100자 내외)
  if (params.title.length > 100) {
    return {
      success: false,
      messages: '제목은 100자 이내로 입력해주세요.'
    };
  }

  // 내용 길이 제한 (일반적으로 10000자 내외)
  if (params.content.length > 10000) {
    return {
      success: false,
      messages: '내용은 10000자 이내로 입력해주세요.'
    };
  }

  const requestBody: components['schemas']['BoardRegisterDto'] = {
    title: params.title.trim(),
    content: params.content.trim(),
    categoryUuid: params.categoryUuid,
    isAnonymous: params.isAnonymous ?? false,
    boardType: params.boardType,
    keywordUuids: params.keywordUuids,
    files: params.files,
    voteRegisterDto: params.voteRegisterDto,
    entityStatus: params.entityStatus ?? 'ACTIVE',
    version: params.version ?? 1
  };

  try {
    const headers: Record<string, string> = {
      Accept: '*/*',
      'Content-Type': 'application/json'
    };
    console.log(JSON.stringify(requestBody))
    // 인증 토큰이 있는 경우 헤더에 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
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

    let message = '게시글 등록에 실패했습니다.';

    switch (status) {
      case 400:
        message = '입력한 정보를 다시 확인해주세요.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '게시글 작성 권한이 없습니다.';
        break;
      case 404:
        message = '서버를 찾을 수 없습니다.';
        break;
      case 413:
        message = '파일 크기가 너무 큽니다.';
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
    console.error('Board registration error:', error);

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