import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';

export async function unBookmark(
  mentorUuid: string,
  accessToken: string
): Promise<ApiResponse<void>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/mentor-bookmark/un-bookmark?mentorUuid=${mentorUuid}`;

  try {
    const response = await axios.post<void>(requestUrl, mentorUuid, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    });

    const { status } = response;

    if (status === 200 || status === 201) {
      return {
        success: true
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
