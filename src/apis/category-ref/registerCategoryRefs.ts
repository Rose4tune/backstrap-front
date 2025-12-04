import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type RegisterCategoryRefsRequest = components['schemas']['CategoryRefRegisterDto'];

export default async function registerCategoryRefs(
    payload: RegisterCategoryRefsRequest,
    accessToken: string
): Promise<ApiResponse<null>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/category-ref/register-multiple`;

    try {
        const response = await axios.post(requestUrl, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: '*/*',
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });

        const { status } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data: null
            };
        }

        let message = '카테고리 다중 등록에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '요청한 리소스를 찾을 수 없습니다.';
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
