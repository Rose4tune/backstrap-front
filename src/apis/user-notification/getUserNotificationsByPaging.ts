import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type UserNotificationPaginationRequest = components['schemas']['UserNotificationPaginationRequestDto'];
type UserNotificationByPagingResponse = components['schemas']['UserNotificationPaginationResultDto'];

export default async function getUserNotificationByPaging(
  requestBody: UserNotificationPaginationRequest,
  accessToken: string
): Promise<ApiResponse<UserNotificationByPagingResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-notification/get-by-paging`;

  try {
    const response = await axios.post(requestUrl, requestBody, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Access Token 추가
      },
      validateStatus: () => true,
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data,
      };
    }

    let message = '알림 조회에 실패했습니다.';

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

    return { success: false, messages: message };
  } catch (error: any) {
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
