import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type BoardFetchRequest = components['schemas']['BoardFetchDto'];
type BoardPaginationResponse = components['schemas']['BoardPaginationResultDto'];

export default async function getBoardsByPaging(
    payload: BoardFetchRequest
): Promise<ApiResponse<BoardPaginationResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `${REST_API_ENDPOINT}/api/v1/board/get-by-paging`;

    try {
        const response = await axios.post(requestUrl, payload, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
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

        let message = '게시글 목록을 불러오는 데 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '게시글을 찾을 수 없습니다.';
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
