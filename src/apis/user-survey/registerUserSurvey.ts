import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type RegisterUserSurveyRequest = components['schemas']['UserSurveyRegisterDto']; // 실제 이름 다를 경우 알려줘
type RegisterUserSurveyResponse = null; // 응답이 바디 없이 200/201만 반환됨

export default async function registerUserSurvey(
    payload: RegisterUserSurveyRequest
): Promise<ApiResponse<RegisterUserSurveyResponse>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `/api/v1/user-survey/register`;

    try {
        const response = await axios.post(requestUrl, payload, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
            withCredentials: true, // ✅ 쿠키 필요
            validateStatus: () => true,
        });

        const { status } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data: null,
            };
        }

        let message = '설문 등록에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '리소스를 찾을 수 없습니다.';
                break;
            default:
                if (typeof response.data === 'object' && 'message' in response.data) {
                    message = (response.data as any).message;
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
