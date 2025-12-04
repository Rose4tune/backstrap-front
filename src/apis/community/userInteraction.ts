import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// API 스키마에서 타입 가져오기
type UserInteractionRegisterDto = components['schemas']['UserInteractionRegisterDto'];
type UserInteractionDeleteDto = components['schemas']['UserInteractionDeleteDto'];
type UserInteractionResponse = components['schemas']['UserInteractionResponse'];

export interface UserInteractionParams {
  parentEntityType: 'ARTICLE' | 'ARTICLE_REVIEW' | 'BOARD' | 'CATEGORY_REF' | 'FA_GROUP' | 'REVIEW' | 'ROOM' | 'SCHOOL_BOARD' | 'SCHOOL_REVIEW' | 'SCHOOL_VERIFICATION' | 'TOTI_ANSWER' | 'TOTI_COMMENT' | 'TOTI_MENTOR' | 'TOTI_QUESTION' | 'USER' | 'USER_MESSAGE';
  parentEntityUuid: string;
  userInteractionType: 'BLOCK' | 'FOLLOW' | 'LIKE' | 'NOTIFY' | 'SCRAP' | 'VIEW';
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
}

export interface UserInteractionDeleteParams {
  parentEntityType: 'ARTICLE_REVIEW' | 'ARTICLE' | 'BOARD' | 'CATEGORY_REF' | 'FA_GROUP' | 'REVIEW' | 'ROOM' | 'SCHOOL_BOARD' | 'SCHOOL_REVIEW' | 'SCHOOL_VERIFICATION' | 'TOTI_ANSWER' | 'TOTI_COMMENT' | 'TOTI_MENTOR' | 'TOTI_QUESTION' | 'USER' | 'USER_MESSAGE';
  parentEntityUuid?: string;
  userInteractionType: 'BLOCK' | 'FOLLOW' | 'LIKE' | 'NOTIFY' | 'SCRAP' | 'VIEW';
  userInteractionUuids?: string[];
  userUuid?: string;
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
}

/**
 * 사용자 상호작용을 등록하는 API 함수
 * @param params - 사용자 상호작용 등록에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<UserInteractionResponse>>
 */
export default async function registerUserInteraction(
  params: UserInteractionParams,
  accessToken?: string
): Promise<ApiResponse<UserInteractionResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-interaction/register`;

  // 필수 필드 유효성 검증
  if (!params.parentEntityType || !params.parentEntityUuid || !params.userInteractionType) {
    return {
      success: false,
      messages: '필수 정보가 누락되었습니다.'
    };
  }

  const requestBody: UserInteractionRegisterDto = {
    parentEntityType: params.parentEntityType,
    parentEntityUuid: params.parentEntityUuid,
    userInteractionType: params.userInteractionType,
    entityStatus: params.entityStatus || 'ACTIVE'
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

    console.log('User interaction register request:', JSON.stringify(requestBody));

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

    let message = '사용자 상호작용 등록에 실패했습니다.';

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
        message = '대상을 찾을 수 없습니다.';
        break;
      case 409:
        message = '이미 등록된 상호작용입니다.';
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
    console.error('User interaction register error:', error);

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

/**
 * 사용자 상호작용을 삭제하는 API 함수
 * @param params - 사용자 상호작용 삭제에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<void>>
 */
export async function deleteUserInteraction(
  params: UserInteractionDeleteParams,
  accessToken?: string
): Promise<ApiResponse<void>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-interaction/delete`;

  // 필수 필드 유효성 검증
  if (!params.parentEntityType || !params.userInteractionType) {
    return {
      success: false,
      messages: '필수 정보가 누락되었습니다.'
    };
  }

  const requestBody: UserInteractionDeleteDto = {
    parentEntityType: params.parentEntityType,
    parentEntityUuid: params.parentEntityUuid,
    userInteractionType: params.userInteractionType,
    userInteractionUuids: params.userInteractionUuids,
    userUuid: params.userUuid,
    entityStatus: params.entityStatus || 'ACTIVE'
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

    console.log('User interaction delete request:', JSON.stringify(requestBody));

    const response = await axios.post(requestUrl, requestBody, {
      headers,
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: undefined
      };
    }

    let message = '사용자 상호작용 삭제에 실패했습니다.';

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
        message = '삭제할 상호작용을 찾을 수 없습니다.';
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
    console.error('User interaction delete error:', error);

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

/**
 * 좋아요 등록 헬퍼 함수
 */
export const registerLike = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'LIKE'
  }, accessToken);
};

/**
 * 스크랩 등록 헬퍼 함수
 */
export const registerScrap = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'SCRAP'
  }, accessToken);
};

/**
 * 팔로우 등록 헬퍼 함수
 */
export const registerFollow = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'FOLLOW'
  }, accessToken);
};

/**
 * 차단 등록 헬퍼 함수
 */
export const registerBlock = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'BLOCK'
  }, accessToken);
};

/**
 * 조회 등록 헬퍼 함수
 */
export const registerView = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'VIEW'
  }, accessToken);
};

/**
 * 알림 등록 헬퍼 함수
 */
export const registerNotify = (
  parentEntityType: UserInteractionParams['parentEntityType'],
  parentEntityUuid: string,
  accessToken?: string
) => {
  return registerUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'NOTIFY'
  }, accessToken);
};

/**
 * 좋아요 삭제 헬퍼 함수
 */
export const deleteLike = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'LIKE',
    userInteractionUuids
  }, accessToken);
};

/**
 * 스크랩 삭제 헬퍼 함수
 */
export const deleteScrap = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'SCRAP',
    userInteractionUuids
  }, accessToken);
};

/**
 * 팔로우 삭제 헬퍼 함수
 */
export const deleteFollow = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'FOLLOW',
    userInteractionUuids
  }, accessToken);
};

/**
 * 차단 삭제 헬퍼 함수
 */
export const deleteBlock = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'BLOCK',
    userInteractionUuids
  }, accessToken);
};

/**
 * 조회 삭제 헬퍼 함수
 */
export const deleteView = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'VIEW',
    userInteractionUuids
  }, accessToken);
};

/**
 * 알림 삭제 헬퍼 함수
 */
export const deleteNotify = (
  parentEntityType: UserInteractionDeleteParams['parentEntityType'],
  parentEntityUuid?: string,
  userInteractionUuids?: string[],
  accessToken?: string
) => {
  return deleteUserInteraction({
    parentEntityType,
    parentEntityUuid,
    userInteractionType: 'NOTIFY',
    userInteractionUuids
  }, accessToken);
};