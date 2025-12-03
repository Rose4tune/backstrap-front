// src/api/school/school-type.api.ts

import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export interface SchoolType {
  code: string;
  name: string;
  region: string;
  entityStatus: string;
  uuid: string;
  createdDate: string;
  elapsedCreatedDate: string;
}

export async function getSchoolTypeListBySearchKeyword(
  searchKeyword: string
): Promise<ApiResponse<SchoolType[]>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/school-type/list-by-keyword`;

  try {
    const response = await axios.get<SchoolType[]>(requestUrl, {
      params: { searchKeyword },
      headers: {
        Accept: '*/*'
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 && Array.isArray(data)) {
      return { success: true, data };
    }

    let message = '학교 목록 조회에 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '요청한 리소스를 찾을 수 없습니다.';
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
  } catch (error: any) {
    return {
      success: false,
      messages: '네트워크 에러입니다. 다시 시도하여 주세요.'
    };
  }
}
