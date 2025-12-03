import getTimeTableTemplates from "@api/time-table/getTimeTableTemplate";
import getTimeTables from "@api/time-table/getTimeTables";
import getMe from "@api/user/getMe";
import { getAccessTokenFromCookies } from "@pages/index";
import TimeTableIndexPage from "src/components/timetable/TimeTableIndexPage";
import { components } from "src/types/api";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];

export async function getServerSideProps(context) {
    const accessToken = getAccessTokenFromCookies(context.req);

    if (!accessToken) {
        return {
            redirect: {
                destination: "/user/sign-in",
                permanent: false,
            },
        };
    }

    const userInfoRes = await getMe(accessToken);
    const user = userInfoRes.data
    const userUuid = userInfoRes.data?.uuid;

    if (!userUuid) {
        return {
            redirect: {
                destination: "/user/sign-in",
                permanent: false,
            },
        };
    }

    // SSR 변수 타입 지정
    let templateList: TimeTableTemplate[] = [];
    let timeTableEntityList: TimeTableEntityView[] = [];
    let selectedTimeTableEntity: TimeTableEntityView | null = null;
    // 현재 날짜 기반 학기 계산
    const now = new Date();
    const month = now.getMonth() + 1;
    const semesterType = month >= 1 && month <= 6 ? "SPRING" : "FALL";
    const year = now.getFullYear();

    // 학기 리스트
    const templateRes = await getTimeTableTemplates(
        { semesterType, userUuid, year },
        accessToken
    );

    if (templateRes.success && templateRes.data) {
        const order = ["WINTER", "FALL", "SUMMER", "SPRING"];
        templateList = [...templateRes.data].sort((a, b) => {
            const yearA = a.year ?? 0;
            const yearB = b.year ?? 0;
            if (yearA !== yearB) return yearB - yearA;
            return order.indexOf(a.semester ?? "") - order.indexOf(b.semester ?? "");
        });
    }

    // 현재 학기 시간표 데이터
    const timeTableRes = await getTimeTables(
        { semesterType, userUuid, year },
        accessToken
    );

    if (timeTableRes.success && timeTableRes.data) {
        timeTableEntityList = timeTableRes.data;
        selectedTimeTableEntity = timeTableEntityList.find(
            (entity) => entity.year === year && entity.semester === semesterType && entity.isFavorite
        ) || null;
    }

    return {
        props: {
            initialUser: user,
            templateList,
            selectedSemester: { year, semester: semesterType },
            timeTableEntityList,
            selectedTimeTableEntity,
        },
    };
}

export default TimeTableIndexPage;