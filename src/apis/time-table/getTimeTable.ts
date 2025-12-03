import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type GetTimeTableResponse = components['schemas']['TimeTableEntityView'];

export default async function getTimeTable(
    uuid: string,
    accessToken: string
): Promise<ApiResponse<GetTimeTableResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `${REST_API_ENDPOINT}/api/v1/time-table/get-by-uuid?uuid=${uuid}`;

    try {
        const response = await axios.get(requestUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: '*/*',
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });

        const { status, data } = response;

        if (status === 200) {
            return {
                success: true,
                data
            };
        }

        let message = '시간표 조회에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '해당 시간표를 찾을 수 없습니다.';
                break;
            default:
                if (typeof data === 'object' && 'message' in data) {
                    message = (data as any).message;
                }
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
