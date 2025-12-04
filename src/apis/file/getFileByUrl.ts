import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type GetFileByUrlResponse = components['schemas']['Resource'];

export default async function getFileByUrl(
    s3Url: string
): Promise<ApiResponse<GetFileByUrlResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/files/action/download-by-url?s3Url=${encodeURIComponent(
        s3Url
    )}`;

    try {
        const response = await axios.get(requestUrl, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json'
            },
            responseType: 'blob', // 파일 다운로드 응답 처리
            validateStatus: () => true
        });

        const { status, data } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data: data as GetFileByUrlResponse
            };
        }

        let message = '파일 다운로드에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '파일을 찾을 수 없습니다.';
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
