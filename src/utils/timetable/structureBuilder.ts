import getCategories from "@api/category-ref/getCategories";
import { useStore } from "@stores/useStore.hook";
import { Campus, CategoryItem, College, Major, SchoolCourseType } from "src/types/timetable";

/**
 * 학교의 캠퍼스-단과대학-전공 구조를 재귀적으로 조회하여
 * SchoolCourseType 객체를 생성합니다.
 * @param schoolUuid - 구조를 만들 대상 학교의 UUID
 * @param schoolName - 구조를 만들 대상 학교의 이름
 * @param accessToken - 액세스 토큰
 * @returns {Promise<SchoolCourseType>} 완성된 학교 구조 객체
 */
export async function buildSchoolStructure(schoolUuid: string, schoolName: string, accessToken: string): Promise<SchoolCourseType> {
    try {

        // --- 레벨 1: 캠퍼스 목록 가져오기 ---
        const campusListResult = await getCategories(schoolUuid, accessToken);
        if (!campusListResult.success || !campusListResult.data) {
            throw new Error("캠퍼스 목록을 가져오는 데 실패했습니다.");
        }
        const campusItems: CategoryItem[] = campusListResult.data
            .filter(item => item.uuid && item.name)
            .map(item => ({
                uuid: item.uuid as string,
                name: item.name as string,
            }));

        // --- 레벨 2 & 3: 각 캠퍼스의 단과대학과 전공 목록을 병렬로 가져오기 ---
        // Promise.all을 사용해 모든 캠퍼스의 하위 데이터를 동시에 요청하여 속도를 높입니다.
        const fullyBuiltCampuses: Campus[] = await Promise.all(
            campusItems.map(async (campusItem) => {
                const collegeListResult = await getCategories(schoolUuid, accessToken, campusItem.uuid);
                if (!collegeListResult.success || !collegeListResult.data) {
                    // 한 캠퍼스의 단과대학 로드에 실패해도 전체를 중단시키지 않고, 빈 배열로 처리합니다.
                    console.warn(`[${campusItem.name}]의 단과대학 목록을 가져오지 못했습니다.`);
                    return { uuid: campusItem.uuid, name: campusItem.name, college: [] };
                }
                const collegeItems: CategoryItem[] = collegeListResult.data
                    .filter(item => item.uuid && item.name)
                    .map(item => ({
                        uuid: item.uuid as string,
                        name: item.name as string,
                    }));

                // 각 단과대학의 전공 목록을 병렬로 가져옵니다.
                const fullyBuiltColleges: College[] = await Promise.all(
                    collegeItems.map(async (collegeItem) => {
                        const majorListResult = await getCategories(schoolUuid, accessToken, collegeItem.uuid);
                        if (!majorListResult.success || !majorListResult.data) {
                            console.warn(`[${collegeItem.name}]의 전공 목록을 가져오지 못했습니다.`);
                            return { uuid: collegeItem.uuid, name: collegeItem.name, major: [] };
                        }
                        const majorItems: CategoryItem[] = majorListResult.data
                            .filter(item => item.uuid && item.name)
                            .map(item => ({
                                uuid: item.uuid as string,
                                name: item.name as string,
                            }));

                        // 최종 Major 객체 배열 생성
                        const majors: Major[] = majorItems.map(item => ({ uuid: item.uuid, name: item.name }));

                        // 완성된 College 객체 반환
                        return { uuid: collegeItem.uuid, name: collegeItem.name, major: majors };
                    })
                );

                // 완성된 Campus 객체 반환
                return { uuid: campusItem.uuid, name: campusItem.name, college: fullyBuiltColleges };
            })
        );

        // --- 최종 객체 조립 ---
        const schoolStructure: SchoolCourseType = {
            uuid: schoolUuid,
            name: schoolName,
            campus: fullyBuiltCampuses,
        };

        return schoolStructure;

    } catch (error) {
        console.error("학교 구조 데이터를 만드는 중 심각한 오류가 발생했습니다:", error);
        throw error;
    }
}