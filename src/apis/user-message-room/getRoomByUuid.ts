import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type RoomViewDto = components['schemas']['RoomViewDto'];

/**
 * 채팅방 UUID로 채팅방 정보 조회
 * @param roomUuid 채팅방 UUID
 * @param accessToken Bearer Access Token
 */
export default async function getRoomByUuid(
  roomUuid: string,
  accessToken: string
): Promise<ApiResponse<RoomViewDto | null>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `/api/v1/user-message-room/get-by-uuid?roomUuid=${roomUuid}`;

  try {
    const response = await axios.get(requestUrl, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data,
      };
    }

    let message = '채팅방 정보를 불러오지 못했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '채팅방을 찾을 수 없습니다.';
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
