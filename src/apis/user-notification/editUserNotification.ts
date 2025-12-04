import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type EditUserNotificationResponse = components['schemas']['UserNotificationViewDtoRes'];
type EditUserNotification = components['schemas']['UserNotificationEditDto'];

export default async function editUserNotification(
  params: EditUserNotification,
  accessToken?: string
): Promise<ApiResponse<EditUserNotificationResponse>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-notification/edit`;

  const requestBody: EditUserNotification = {
    uuid:params.uuid,
    isRead:params.isRead,
    entityStatus:params.entityStatus,
    changeLog:params.changeLog,
  };

  try {
    const response = await axios.post(requestUrl, requestBody, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      validateStatus: () => true
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: data
      };
    }

    let message = '알림 읽음 처리 실패';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '사용자를 찾을 수 없습니다.';
        break;
      case 400:
        message = '잘못된 요청입니다.';
        break;
      default:
        if (typeof data === 'object' && data && 'message' in data) {
          message = (data as any).message;
        }
    }

    return { success: false, messages: message };
  } catch (error: any) {
    console.error('editUserNotification error:', error);
    return {
      success: false,
      messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
}