import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

// Response 타입 정의
type GetArticleResponse = components['schemas']['ArticleViewDto'] | null;

export default async function getArticle(
    uuid: string, accessToken?: string
): Promise<ApiResponse<GetArticleResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/article/get-by-uuid?uuid=${uuid}`;

    try {
        const response = await axios.get(requestUrl, {
            headers: accessToken ?
                {
                    Authorization: `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json'
                }

                : {
                    Accept: '*/*',
                    'Content-Type': 'application/json'
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

        let message = '게시글 조회에 실패했습니다.';

        switch (status) {
            case 400:
                message = '존재하지 않는 아티클입니다.';
                break;
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
                if (typeof data === 'string') {
                    message = data; // 서버에서 text/plain 에러 메시지 반환하는 경우 처리
                } else if (typeof data === 'object' && data && 'message' in data) {
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
