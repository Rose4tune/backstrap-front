import getTimeTable from "@api/time-table/getTimeTable";
import { access } from "fs";
import { useCallback } from "react";
import { components } from "src/types/api";

type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];

interface UseTimeTableRefetchParams {
    selectedSemester?: TimeTableTemplate;
    userUuid?: string;
    accessToken?: string;
    setSelectedTimeTableEntity: (tt?: TimeTableEntityView) => void;
    selectedTimeTableEntity: TimeTableEntityView
    onError?: (msg: string) => void;
}

export function useTimeTableRefetch({
    selectedSemester,
    userUuid,
    accessToken,
    setSelectedTimeTableEntity,
    selectedTimeTableEntity,
    onError,
}: UseTimeTableRefetchParams) {
    const refetch = useCallback(async () => {
        if (!selectedSemester || !userUuid || !accessToken) {
            console.log('"refetch"', 'userUuid:', userUuid, 'selectedSemeseter:', selectedSemester, 'accessToken:', accessToken)
            return;
        }

        const resp = await getTimeTable(
            selectedTimeTableEntity.uuid as string,
            accessToken
        );

        if (resp.success && resp.data) {
            const list = resp.data as TimeTableEntityView[]; // API 타입에 맞게 조정
            setSelectedTimeTableEntity(resp.data);
        } else {
            onError?.(resp.messages ?? "시간표를 불러오지 못했습니다.");
        }
    }, [
        selectedSemester?.semester,
        selectedSemester?.year,
        userUuid,
        accessToken,
        setSelectedTimeTableEntity,
        selectedTimeTableEntity,
        onError,
    ]);

    return { refetch };
}
