import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// API 스키마에서 타입 가져오기
type UserReportRegisterDto = components['schemas']['UserReportRegisterDto'];
type UserReportEntityView = components['schemas']['UserReportEntityView'];

export interface RegisterUserReportParams {
  parentEntityType: 'ARTICLE_REVIEW' | 'ARTICLE' | 'BOARD' | 'CATEGORY_REF' | 'FA_GROUP' | 'REVIEW' | 'ROOM' | 'SCHOOL_BOARD' | 'SCHOOL_REVIEW' | 'SCHOOL_VERIFICATION' | 'TOTI_ANSWER' | 'TOTI_COMMENT' | 'TOTI_MENTOR' | 'TOTI_QUESTION' | 'USER' | 'USER_MESSAGE';
  parentEntityUuid: string;
  reportedUuid: string;
  userReportType: 'ABUSE' | 'EDIT_REQUEST';
  content?: string;
  entityStatus?: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
}

/**
 * 사용자 신고를 등록하는 API 함수
 * @param params - 사용자 신고 등록에 필요한 데이터
 * @param accessToken - 인증 토큰 (optional)
 * @returns Promise<ApiResponse<UserReportEntityView>>
 */
export default async function registerUserReport(
  params: RegisterUserReportParams,
  accessToken?: string
): Promise<ApiResponse<UserReportEntityView>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-report/register`;

  // 필수 필드 유효성 검증
  if (!params.parentEntityType || !params.parentEntityUuid || !params.reportedUuid || !params.userReportType) {
    return {
      success: false,
      messages: '필수 정보가 누락되었습니다.'
    };
  }

  const requestBody: UserReportRegisterDto = {
    parentEntityType: params.parentEntityType,
    parentEntityUuid: params.parentEntityUuid,
    reportedUuid: params.reportedUuid,
    userReportType: params.userReportType,
    content: params.content,
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

    console.log('User report register request:', JSON.stringify(requestBody));

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

    let message = '사용자 신고 등록에 실패했습니다.';

    switch (status) {
      case 400:
        message = '이미 신고한 대상입니다.';
        break;
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '신고 권한이 없습니다.';
        break;
      case 404:
        message = '신고 대상을 찾을 수 없습니다.';
        break;
      case 409:
        message = '이미 신고한 대상입니다.';
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
    console.error('User report register error:', error);

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
 * 사용자 남용 신고 헬퍼 함수
 */
export const reportUserAbuse = (
  parentEntityType: RegisterUserReportParams['parentEntityType'],
  parentEntityUuid: string,
  reportedUuid: string,
  content?: string,
  accessToken?: string
) => {
  return registerUserReport({
    parentEntityType,
    parentEntityUuid,
    reportedUuid,
    userReportType: 'ABUSE',
    content
  }, accessToken);
};

/**
 * 게시글 수정 요청 신고 헬퍼 함수
 */
export const reportEditRequest = (
  parentEntityType: RegisterUserReportParams['parentEntityType'],
  parentEntityUuid: string,
  reportedUuid: string,
  content?: string,
  accessToken?: string
) => {
  return registerUserReport({
    parentEntityType,
    parentEntityUuid,
    reportedUuid,
    userReportType: 'EDIT_REQUEST',
    content
  }, accessToken);
};