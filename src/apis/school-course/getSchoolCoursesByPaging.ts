import { ApiResponse } from 'types/ApiResponseType';
import axios from 'axios';
import { components } from 'src/types/api';

type SearchKeywordType = 'COURSE_NAME' | 'COURSE_PLACE';
type SemesterType = 'FALL' | 'SPRING' | 'SUMMER' | 'WINTER';
type EntityStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'INVALID' | 'SEARCHABLE';
type SortType = 'BOOKING_ASC' | 'BOOKING_DESC' | 'NAME_ASC' | 'NAME_DESC';

type SchoolCourseFetchDto = components['schemas']['SchoolCourseFetchDto']
type GetSchoolCoursesByPagingResponse = components['schemas']['SchoolCoursePaginationResultDto'];

export default async function getSchoolCoursesByPaging(
    payload: SchoolCourseFetchDto,
    accessToken: string
): Promise<ApiResponse<GetSchoolCoursesByPagingResponse | null>> {
    const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    const requestUrl = `${REST_API_ENDPOINT}/api/v1/school-course/get-by-paging`;

    try {
        const response = await axios.post(requestUrl, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            validateStatus: () => true
        });

        const { status, data } = response;

        if (status === 200 || status === 201) {
            return {
                success: true,
                data,
            };
        }

        let message = '학교 강의 목록 조회에 실패했습니다.';

        switch (status) {
            case 401:
                message = '로그인이 필요합니다.';
                break;
            case 403:
                message = '접근 권한이 없습니다.';
                break;
            case 404:
                message = '강의 정보를 찾을 수 없습니다.';
                break;
            default:
                if (typeof data === 'object' && 'message' in data) {
                    message = (data as any).message;
                }
        }

        return {
            success: false,
            messages: message,
        };
    } catch (error: any) {
        return {
            success: false,
            messages: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        };
    }
}
