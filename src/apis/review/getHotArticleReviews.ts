import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type ReviewResponse = components['schemas']['ReviewViewDtoRes'][] | null;

/**
 * 인기 아티클 리뷰 조회 API
 * @param count 가져올 리뷰 개수 (기본 10)
 */
export default async function getHotArticleReviews(
    count: number = 10
): Promise<ApiResponse<ReviewResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/review/get-hot-article-reviews?count=${count}`;

    try {
        const response = await axios.get(requestUrl, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json'
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

        let message = '인기 리뷰 조회에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '리뷰 데이터를 찾을 수 없습니다.';
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
            messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
        };
    }
}
