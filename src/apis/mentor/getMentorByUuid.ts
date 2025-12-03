import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import type { components, paths } from 'src/types/api';

type GetMentorByUuidResponse = components['schemas']['MentorViewDto'];
//  paths['/api/v1/mentor/get-by-uuid']['post']['responses']['200']['content']['*/*'];

export async function getMentorByUuid(
  uuid: string,
  accessToken?: string
): Promise<ApiResponse<GetMentorByUuidResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/mentor/get-by-uuid?uuid=${encodeURIComponent(uuid)}`;
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
    const response = await axios.post<GetMentorByUuidResponse>(
      requestUrl,
      {},
      {
        headers: headers,
        validateStatus: () => true
      }
    );

    const { status, data } = response;
    console.log('mentorData: ', data);

    if (status === 200 || status === 201) {
      return {
        success: true,
        data,
        messages: '멘토 정보를 성공적으로 불러왔습니다.'
      };
    }

    let message = '멘토 정보를 불러오지 못했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '멘토를 찾을 수 없습니다.';
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
