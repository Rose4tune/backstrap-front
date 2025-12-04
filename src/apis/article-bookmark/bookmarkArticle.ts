import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';

export default async function bookmarkArticle(
    articleUuid: string,
    accessToken: string
): Promise<ApiResponse<null>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/article-bookmark/bookmark?articleUuid=${articleUuid}`;

    try {
        const response = await axios.post(
            requestUrl,
            {},
            {
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                validateStatus: () => true,
            }
        );

        const { status, data } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data: null,
            };
        }

        let message = '북마크 등록에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '아티클을 찾을 수 없습니다.';
                break;
            default:
                if (typeof data === 'object' && data && 'message' in data) {
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
