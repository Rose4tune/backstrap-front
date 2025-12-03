import { useEffect, useState } from "react";
import EditIcon from "src/assets/icons/common/EditIcon.svg";
import DeleteIcon from "src/assets/icons/common/DeleteIcon.svg";
import PlusIcon from "src/assets/icons/common/PlusIcon.svg";
import FixIcon from "src/assets/icons/common/FixIcon.svg";
import { components } from "src/types/api";
import { Dispatch, SetStateAction } from "react";
import editTimeTable from "@api/time-table/editTimeTable";
import useAccessToken from "src/hooks/useAcessToken";
import { downloadElementAsImage } from "src/utils/timetable/downloadElementAsImage";
import toast from "react-hot-toast";
import registerTimeTable from "@api/time-table/registerTimeTable";
import { useStore } from "@stores/useStore.hook";
import getTimeTables from "@api/time-table/getTimeTables";
import deleteTimeTable from "@api/time-table/deleteTimeTable";
import { useTimeTableRefetch } from "src/hooks/timetable/useTimeTableRefetch";
import { observer } from "mobx-react";
import TimeTable from "./TimeTable";

type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];


interface TimeTableControlPannelProps {
    selectedTimeTableEntity: TimeTableEntityView;
    setSelectedTimeTableEntity: Dispatch<
        SetStateAction<TimeTableEntityView | undefined>
    >;
    selectedSemester: TimeTableTemplate
    timeTableEntityList: TimeTableEntityView[]
    setTimeTableEntityList: Dispatch<SetStateAction<TimeTableEntityView[]>>
}

const colorOptions: { type: "RED" | "BLUE" | "GREEN" | "PURPLE" | "PASTEL" | "SPRING"; className: string }[] = [
    { type: "RED", className: "bg-timetable-red-10" },
    { type: "BLUE", className: "bg-timetable-blue-30" },
    { type: "GREEN", className: "bg-timetable-green-50" },
    { type: "PURPLE", className: "bg-timetable-purple-50" },
    { type: "PASTEL", className: "bg-[#FF848E]" },
    { type: "SPRING", className: "bg-[#B4D939]" }
];

function TimeTableControlPannel({
    selectedTimeTableEntity,
    setSelectedTimeTableEntity,
    selectedSemester,
    timeTableEntityList,
    setTimeTableEntityList
}: TimeTableControlPannelProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(selectedTimeTableEntity?.name ?? "");

    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //refetch 관련
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId()
    const accessToken = UserStore.getAccessToken()
    const { refetch } = useTimeTableRefetch({
        selectedSemester,
        userUuid: UserStore.getUserId(),
        accessToken,
        setSelectedTimeTableEntity,
        selectedTimeTableEntity,
        onError: (m) => { setErrorMessage(m); setIsErrorPopupOpen(true); },
    });

    //url 공유
    function handleShareUrl() {
        if (!selectedTimeTableEntity?.uuid) return;
        const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/timetable/share/${selectedTimeTableEntity.uuid}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success("URL이 클립보드에 복사되었습니다!");
            })
            .catch(() => {
                toast.error("URL 복사에 실패했습니다.");
            });
    }


    /**현재 선택된 학기 또는 나머지 학기에 대한 고정 함수, 인자가 있는 경우는 나머지 학기에 대한 고정 실행*/
    async function handleFix(uuid: string, isFavorite: boolean) {
        try {
            const res = await editTimeTable(
                {
                    isFavorite: !isFavorite,
                    uuid: uuid,
                },
                accessToken
            );
            if (res.success) {
                await refetch()
                await fetchTimeTables();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

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

    async function handleEdit() {
        if (!newName.trim()) return;
        try {
            const res = await editTimeTable(
                {
                    name: newName,
                    uuid: selectedTimeTableEntity?.uuid as string,
                },
                accessToken
            );
            if (res.success) {
                await refetch();
                await fetchTimeTables()
                setIsEditingName(false);
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    async function handleColorChange(colorType: "RED" | "BLUE" | "GREEN" | "PURPLE" | "PASTEL" | "SPRING") {
        if (!selectedTimeTableEntity?.uuid) return;
        try {
            const res = await editTimeTable(
                {
                    representativeColorType: colorType,
                    uuid: selectedTimeTableEntity.uuid,
                },
                accessToken
            );
            if (res.success) {
                await refetch();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }


    /**시간표 추가하기 버튼 눌렀을 때 */
    async function handleAddTimeTable() {
        if (!selectedTimeTableEntity?.uuid) return;
        try {
            const res = await registerTimeTable(
                {
                    name: "시간표",
                    semester: selectedSemester.semester!,
                    year: Number(String(selectedSemester.year)),
                    representativeColorType: "RED",
                    entityStatus: "ACTIVE"
                },
                accessToken
            );
            if (res.success && res.data) {
                await fetchTimeTables()
                setSelectedTimeTableEntity(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(uuid: string) {
        try {
            const res = await deleteTimeTable(
                uuid,
                accessToken
            );
            if (res.success) {
                await fetchTimeTables();
            }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";

            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);

            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }

    /**고정된 애를 상단으로 빼고 timeTable 리스트업 */
    const sortedTimeTableEntityList = timeTableEntityList.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) {
            return -1
        } else if (!a.isFavorite && b.isFavorite) {
            return 1
        } else {
            return 0
        }
    })

    return (
        <div className="flex flex-col gap-3">
            {sortedTimeTableEntityList.map((timeTable) => {
                const isSelected = timeTable.uuid === selectedTimeTableEntity.uuid
                return (
                    isSelected ? (
                        <div className="flex flex-col gap-4 p-5 bg-gray-20 rounded-[16px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <FixIcon
                                        onClick={() => handleFix(selectedTimeTableEntity.uuid as string, selectedTimeTableEntity.isFavorite as boolean)}
                                        className={`w-[24px] h-[24px] cursor-pointer ${selectedTimeTableEntity?.isFavorite
                                            ? "text-red"
                                            : "text-gray-50"
                                            }`}
                                    />
                                    {isEditingName ? (
                                        <input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={handleEdit}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleEdit();
                                            }}
                                            className="border-b border-gray-50 bg-transparent outline-none text-bold-20 text-gray-90 
               flex-shrink max-w-[160px] truncate"
                                            autoFocus
                                        />
                                    ) : (
                                        <><span className="text-bold-20 text-gray-90 truncate max-w-[160px]">
                                            {selectedTimeTableEntity?.name}
                                        </span>
                                            <EditIcon
                                                className="w-[24px] h-[24px] text-gray-50 cursor-pointer"
                                                onClick={() => {
                                                    setNewName(selectedTimeTableEntity?.name ?? "");
                                                    setIsEditingName(true);
                                                }} />
                                        </>
                                    )}
                                </div>
                                <DeleteIcon
                                    onClick={() => {
                                        handleDelete(selectedTimeTableEntity.uuid as string)
                                        setSelectedTimeTableEntity(sortedTimeTableEntityList.find(timeTable => timeTable.isFavorite) as TimeTableEntityView)
                                    }
                                    }
                                    className="w-[24px] h-[24px] text-red cursor-pointer" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-med-14 text-gray-90">색상 변경</span>
                                <div className="flex items-center gap-4">
                                    {colorOptions.map((color) => (
                                        <div
                                            key={color.type}
                                            className={`w-6 h-6 rounded-full cursor-pointer ${color.className} 
                ${selectedTimeTableEntity?.representativeColorType === color.type ? "ring-2 ring-offset-2 ring-normal" : ""}`}
                                            onClick={() => handleColorChange(color.type)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="flex flex-1 items-center justify-center w-full py-2 text-semibold-14 bg-gray-40 rounded-[8px] text-gray-90"
                                    onClick={() => {
                                        const el = document.getElementById("timetable");
                                        if (!el) return;
                                        downloadElementAsImage(el, selectedTimeTableEntity?.name || "시간표");
                                    }}
                                >
                                    이미지로 저장
                                </button>
                                <button
                                    className="flex flex-1 items-center justify-center w-full py-2 text-semibold-14 bg-gray-40 rounded-[8px] text-gray-90"
                                    onClick={handleShareUrl}
                                >
                                    URL로 공유
                                </button>

                            </div>

                            <button
                                onClick={handleAddTimeTable}
                                className="w-full flex gap-2 bg-normal text-white rounded-[16px] py-[12px] items-center justify-center h-[48px]">
                                <PlusIcon className="w-[20px] h-[20px]" />
                                <span className="text-semibold-16">시간표 추가하기</span>
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setSelectedTimeTableEntity(timeTable)}>
                            <div className="flex gap-1 p-5 rounded-[16px] bg-gray-20">
                                <FixIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFix(timeTable.uuid as string, timeTable.isFavorite as boolean)
                                    }}
                                    className={`w-[24px] h-[24px] cursor-pointer ${timeTable?.isFavorite
                                        ? "text-red"
                                        : "text-gray-50"
                                        }`}
                                />
                                <span className="text-bold-20 text-gray-90">{timeTable.name}</span>
                            </div>
                        </button>
                    )

                )
            })}
        </div>
    );
}

export default observer(TimeTableControlPannel)