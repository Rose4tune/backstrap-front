// src/api/school/school-department.api.ts

import axios from 'axios';
import type { ApiResponse } from 'types/ApiResponseType';

export interface SchoolDepartment {
  name: string;
  entityStatus: string;
  uuid: string;
  createdDate: string;
  elapsedCreatedDate: string;
}

export async function getSchoolDepartmentListBySearchKeyword(
  searchKeyword: string
): Promise<ApiResponse<SchoolDepartment[]>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/school-department/list-by-keyword`;

  try {
    const response = await axios.get<SchoolDepartment[]>(requestUrl, {
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

    let message = '학과 목록 조회에 실패했습니다.';

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
      messages: '네트워크 에러입니다. 다시 시도해 주세요.'
    };
  }
}
