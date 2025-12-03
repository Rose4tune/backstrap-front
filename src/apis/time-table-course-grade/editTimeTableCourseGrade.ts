import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type TimeTableCourseGradeEditDto =
    components['schemas']['TimeTableCourseGradeEditDto'];
type TimeTableCourseGradeViewDto =
    components['schemas']['TimeTableCourseGradeViewDto'];

export default async function editTimeTableCourseGrade(
    dto: TimeTableCourseGradeEditDto,
    accessToken: string
): Promise<ApiResponse<TimeTableCourseGradeViewDto | null>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `${REST_API_ENDPOINT}/api/v1/timetable-course-grade/edit`;

    try {
        const response = await axios.post(requestUrl, dto, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            validateStatus: () => true
        });

        const { status, data } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data
            };
        }

        let message = '시간표 과목 성적 수정에 실패했습니다.';

        switch (status) {
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
