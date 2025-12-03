import { ApiResponse } from 'types/ApiResponseType';
import type { paths, components } from 'src/types/api';
import axios from 'axios';

type GetMentorsRequestBody = components['schemas']['MentorPaginationRequestDto']; // request body 타입
type GetMentorsResponse =
  paths['/api/v1/mentor/get-by-paging']['post']['responses']['200']['content']['*/*']; // 정확한 응답 타입

export async function getMentorByPaging(
  payload: GetMentorsRequestBody,
  accessToken?: string
): Promise<ApiResponse<GetMentorsResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/mentor/get-by-paging`;
  let headers;
  if (accessToken) {
    headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  } else {
    headers = { Accept: '*/*', 'Content-Type': 'application/json' };
  }
  try {
    const response = await axios.post<GetMentorsResponse>(requestUrl, payload, {
      headers: headers,
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data
      };
    }

    let message = '멘토 목록을 불러오지 못했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '서버를 찾을 수 없습니다.';
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
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}
