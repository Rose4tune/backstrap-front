import { useEffect, useState } from "react";
import { components } from "src/types/api";
import getTimeTableTemplates from "@api/time-table/getTimeTableTemplate";
import useAccessToken from "src/hooks/useAcessToken";
import { useStore } from "@stores/useStore.hook";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];

export function useSemesterList() {
    const [templateList, setTemplateList] = useState<TimeTableTemplate[]>([]);

    // 현재 날짜 기반 semesterType 계산
    const now = new Date();
    const month = now.getMonth() + 1;
    let semesterType: "SPRING" | "FALL";
    if (month >= 1 && month <= 6) {
        semesterType = "SPRING";
    } else {
        semesterType = "FALL";
    }

    // 초기 선택 학기
    const [selectedSemester, setSelectedSemester] = useState<TimeTableTemplate>({
        year: now.getFullYear(),
        semester: semesterType
    });

    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId();
    const accessToken = useAccessToken();

    useEffect(() => {
        if (!userUuid || !accessToken) return;

        async function getTimeTableSemesterList() {
            try {
                const response = await getTimeTableTemplates(
                    { semesterType, userUuid, year: now.getFullYear() },
                    accessToken
                );

                if (response.success && response.data) {
                    const order = ["WINTER", "FALL", "SUMMER", "SPRING"];
                    const sorted = [...response.data].sort((a, b) => {
                        const yearA = a.year ?? 0;
                        const yearB = b.year ?? 0;

                        if (yearA !== yearB) {
                            return yearB - yearA; // 최신 연도 먼저
                        }
                        return order.indexOf(a.semester ?? '') - order.indexOf(b.semester ?? '');
                    });
                    setTemplateList(sorted);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getTimeTableSemesterList();
    }, [userUuid, accessToken]);

    return {
        templateList,
        selectedSemester,
        setSelectedSemester
    };
}
