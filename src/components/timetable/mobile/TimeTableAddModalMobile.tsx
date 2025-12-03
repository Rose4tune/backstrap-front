import getTimeTables from "@api/time-table/getTimeTables";
import registerTimeTable from "@api/time-table/registerTimeTable";
import FillButton from "@common/button/FillButton";
import DropdownInput from "@common/input/DropdownInput";
import TextField from "@common/input/TextField";
import { useStore } from "@stores/useStore.hook";
import { observer } from "mobx-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { components } from "src/types/api";
import { formatSemesterLabel } from "src/utils/timetable/formatSemesterLabel";
import TimeTable from "../TimeTable";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];

interface TImeTableAddProps {
    setIsTTAddModal: Dispatch<SetStateAction<boolean>>;
    templateList: TimeTableTemplate[];
    selectedTimeTableEntity: TimeTableEntityView
    setTimeTableEntityList: Dispatch<SetStateAction<TimeTableEntityView[]>>;
    setRefreshKey: Dispatch<SetStateAction<number>>
}

function TimeTableAddModalMobile(props: TImeTableAddProps) {
    const { setIsTTAddModal, templateList, setTimeTableEntityList, selectedTimeTableEntity, setRefreshKey } = props;

    const [ttName, setTtName] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<TimeTableTemplate | null>(null);

    const isFormValid =
        ttName.trim() !== "" &&
        selectedSemester !== null
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId();
    const accessToken = UserStore.getAccessTokenFromCookies();


    // 시간표 재조회 함수
    async function fetchTimeTables() {
        if (!userUuid || !accessToken || !selectedSemester) return;

        try {
            const response = await getTimeTables(
                { semesterType: selectedSemester.semester, userUuid, year: selectedSemester.year },
                accessToken
            );
            if (response.success && response.data) {
                setTimeTableEntityList(response.data);
            }
        } catch (error) {
            toast.error("시간표를 가져오는 데 실패했습니다.");
        }
    }

    /**시간표 추가하기 버튼 눌렀을 때 */
    async function handleAddTimeTable() {
        try {
            const res = await registerTimeTable(
                {
                    name: ttName,
                    semester: selectedSemester?.semester!,
                    year: Number(String(selectedSemester?.year)),
                    representativeColorType: "RED",
                    entityStatus: "ACTIVE"
                },
                accessToken
            );
            if (res.success && res.data) {
                await fetchTimeTables()
                setRefreshKey((k) => (k + 1))
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[10001] flex items-end justify-center"
            onClick={() => setIsTTAddModal(false)}
        >
            <div className="absolute inset-0 bg-dim max-w-[550px] mx-auto" />

            <div
                className="relative bg-white px-[20px] pt-[24px] pb-[60px] rounded-t-[24px] w-full max-w-[550px] mx-auto space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-semibold-16 text-gray-90 w-full text-center">새 시간표 만들기</div>
                <TextField
                    title="시간표 이름"
                    device="mobile"
                    value={ttName}
                    onChange={setTtName}
                    placeholder="시간표 이름을 입력해주세요"
                />

                <DropdownInput
                    title="학기"
                    placeholder="학기를 선택해주세요."
                    options={templateList.map(formatSemesterLabel)}
                    value={selectedSemester ? formatSemesterLabel(selectedSemester) : ""} // ← 안전하게
                    onChange={(val) => {
                        const found = templateList.find((t) => formatSemesterLabel(t) === val) || null;
                        if (!found) return;
                        if (found.year === selectedSemester?.year && found.semester === selectedSemester?.semester) return;
                        setSelectedSemester(found);
                    }}
                    needGap
                />
                <div className="flex flex-1 pt-3">
                    <FillButton
                        text="추가하기"
                        size="Large"
                        buttonStatus={isFormValid ? "active" : "disable"}
                        onClick={() => {
                            handleAddTimeTable()
                            setIsTTAddModal(false)
                        }
                        }
                    />
                </div>

            </div>
        </div>
    );
}

export default observer(TimeTableAddModalMobile)