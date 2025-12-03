import axios from 'axios';
import { ApiResponse } from 'types/ApiResponseType';

export async function bookmarkRecruitment(
  recruitmentUuid: string,
  accessToken?: string
): Promise<ApiResponse<any>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/recruitment-bookmark/bookmark`;

  try {
    const response = await axios.post(requestUrl, null, {
      params: {
        recruitmentUuid
      },
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: null
      };
    }

    let message = '북마크 추가에 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '채용공고를 찾을 수 없습니다.';
        break;
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

export default bookmarkRecruitment;