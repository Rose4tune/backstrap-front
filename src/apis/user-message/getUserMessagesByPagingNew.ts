import axios from 'axios';
import { ApiResponse } from 'types/ApiResponseType';
import { components } from 'src/types/api';

type UserMessageFetchDto = components['schemas']['UserMessageFetchDto'];
type UserMessagePaginationResultDto = components['schemas']['UserMessageNewPaginationResultDto'];

export default async function getUserMessagesByPaging(
  accessToken: string,
  payload: UserMessageFetchDto
): Promise<ApiResponse<UserMessagePaginationResultDto | null>> {
  const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const requestUrl = `${REST_API_ENDPOINT}/api/v1/user-message/get-by-paging-new`;

  try {
    const response = await axios.post(requestUrl, payload, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    });

    const { status, data } = response;

    if (status === 200 || status === 201) {
      return { success: true, data };
    }

    let message = '메시지 목록을 불러오는데 실패했습니다.';

    switch (status) {
      case 401:
        message = '로그인이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '요청한 데이터를 찾을 수 없습니다.';
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
