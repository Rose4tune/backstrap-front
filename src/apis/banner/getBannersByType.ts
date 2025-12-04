import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type BannerType = "BIG" | "BIG_MOBILE" | "BOTTOM" | "BOTTOM_MOBILE" | "NONE" | "SMALL"
type BannerResponse = components['schemas']['BannerViewDto'][];

export default async function getBannersByType(
    bannerType: BannerType
): Promise<ApiResponse<BannerResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/banner/get-by-type?bannerType=${bannerType}`;

    try {
        const response = await axios.get(requestUrl, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            validateStatus: () => true,
        });

        const { status, data } = response;

        if (status === 200) {
            return {
                success: true,
                data,
            };
        }

        let message = '배너 정보를 불러오는 데 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '요청한 배너를 찾을 수 없습니다.';
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
