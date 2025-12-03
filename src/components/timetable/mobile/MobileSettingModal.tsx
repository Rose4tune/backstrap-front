import { Dispatch, SetStateAction, useState } from "react"
import { components } from "src/types/api";
import EditIcon from "src/assets/icons/common/EditIcon.svg"
import editTimeTable from "@api/time-table/editTimeTable";
import { useStore } from "@stores/useStore.hook";
import { useTimeTableRefetch } from "src/hooks/timetable/useTimeTableRefetch";
import getTimeTables from "@api/time-table/getTimeTables";
import toast from "react-hot-toast";
import FixIcon from "src/assets/icons/common/FixIcon.svg"
import ImageIcon from "src/assets/icons/home/ImageIcon.svg"
import ShareIcon from "src/assets/icons/common/ShareIcon.svg"
import DeleteIcon from "src/assets/icons/common/DeleteIcon.svg"
import { downloadElementAsImage } from "src/utils/timetable/downloadElementAsImage";
import deleteTimeTable from "@api/time-table/deleteTimeTable";
import { observer } from "mobx-react";

type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];

interface MobileSettingProps {
    setIsMobileSettingModalOpen: Dispatch<SetStateAction<boolean>>
    selectedSemester: TimeTableTemplate
    selectedTimeTableEntity: TimeTableEntityView
    setSelectedTimeTableEntity: Dispatch<
        SetStateAction<TimeTableEntityView | undefined>
    >;
    setTimeTableEntityList: Dispatch<SetStateAction<TimeTableEntityView[]>>
    timeTableEntityList: TimeTableEntityView[]
}


const colorOptions: { type: "RED" | "BLUE" | "GREEN" | "PURPLE" | "PASTEL" | "SPRING"; className: string }[] = [
    { type: "RED", className: "bg-timetable-red-10" },
    { type: "BLUE", className: "bg-timetable-blue-30" },
    { type: "GREEN", className: "bg-timetable-green-50" },
    { type: "PURPLE", className: "bg-timetable-purple-50" },
    { type: "PASTEL", className: "bg-[#FF848E]" },
    { type: "SPRING", className: "bg-[#B4D939]" }
];
function MobileSettingModal(props: MobileSettingProps) {
    const { setIsMobileSettingModalOpen, selectedSemester, selectedTimeTableEntity, setSelectedTimeTableEntity, setTimeTableEntityList, timeTableEntityList } = props
    const [newName, setNewName] = useState(selectedTimeTableEntity?.name ?? "");
    const [isEditingName, setIsEditingName] = useState(false);

    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    //refetch 관련
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId()
    const accessToken = UserStore.getAccessTokenFromCookies()
    const { refetch } = useTimeTableRefetch({
        selectedSemester,
        userUuid: UserStore.getUserId(),
        accessToken,
        setSelectedTimeTableEntity,
        selectedTimeTableEntity,
        onError: (m) => { setErrorMessage(m); setIsErrorPopupOpen(true); },
    });

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

    /**현재 선택된 학기 또는 나머지 학기에 대한 고정 함수, 인자가 있는 경우는 나머지 학기에 대한 고정 실행*/
    async function handleFix(uuid: string, isFavorite: boolean) {
        if (!uuid || !isFavorite || !accessToken) {
            return;
        }
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

    /**시간표 이름 수정시 호출 함수 */
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


    //url 공유
    function handleShareUrl() {
        if (!selectedTimeTableEntity?.uuid) {
            return;
        }
        const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/timetable/share/${selectedTimeTableEntity.uuid}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success("URL이 클립보드에 복사되었습니다!");
            })
            .catch(() => {
                toast.error("URL 복사에 실패했습니다.");
            });
    }

    /**색상 변경시 호출되는 함수 */
    async function handleColorChange(colorType: "RED" | "BLUE" | "GREEN" | "PURPLE" | "PASTEL" | "SPRING") {
        if (!selectedTimeTableEntity?.uuid || !accessToken) {
            return;
        }
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

    async function handleDelete(uuid: string) {
        if (!uuid || !accessToken) {
            return;
        }
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


    return (
        <div
            className="fixed inset-0 z-[10001] flex items-end justify-center max-w-[550px] mx-auto"
            onClick={() => setIsMobileSettingModalOpen(false)}
        >
            {/* 배경 딤 */}
            <div className="absolute inset-0 bg-dim" />

            {/* 바텀 모달 */}
            <div className="px-5 py-6 pb-[60px] bg-white z-[100002] w-full rounded-t-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 학기 | 시간표 이름 */}
                <div className="flex flex-col gap-1 mb-[10px]">
                    <label className="text-semibold-12 text-normal">{selectedTimeTableEntity.yearAndSemesterName}</label>
                    <div className="flex gap-1">
                        {isEditingName ? (
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onBlur={handleEdit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleEdit();
                                }}
                                className="border-b border-gray-50 bg-transparent outline-none text-bold-18 text-gray-90 
               flex-shrink max-w-[160px] truncate"
                                autoFocus
                            />
                        ) : (
                            <><span className="text-bold-18 text-gray-90 truncate max-w-[160px]">
                                {selectedTimeTableEntity?.name}
                            </span>
                                <EditIcon
                                    className="w-5 h-5 text-gray-50 cursor-pointer"
                                    onClick={() => {
                                        setNewName(selectedTimeTableEntity?.name ?? "");
                                        setIsEditingName(true);
                                    }} />
                            </>
                        )}
                    </div>
                </div>

                {/* 대표 지정 버튼 */}
                <button
                    onClick={() => {
                        handleFix(selectedTimeTableEntity.uuid as string, selectedTimeTableEntity.isFavorite as boolean)
                        setIsMobileSettingModalOpen(false)
                    }}
                    className="flex gap-2 items-center w-full py-[10px] hover:bg-bagstrap-10 px-2 rounded-[8px]">
                    <FixIcon className="w-5 h-5 text-gray-90" />
                    <div className="text-gray-90 text-med-14">대표로 지정</div>
                </button>

                {/* 이미지로 저장 버튼 */}
                <button
                    onClick={() => {
                        const el = document.getElementById("timetable");
                        if (!el) return;
                        downloadElementAsImage(el, selectedTimeTableEntity?.name || "시간표", { isMobile: true }
                        );
                        setIsMobileSettingModalOpen(false)
                    }} className="flex gap-2 items-center w-full py-[10px] hover:bg-bagstrap-10 px-2 rounded-[8px]">
                    <ImageIcon className="w-5 h-5 text-gray-90" />
                    <div className="text-gray-90 text-med-14">이미지로 저장</div>
                </button>

                {/* URL로 공유 버튼 */}
                <button
                    onClick={() => {
                        handleShareUrl()
                        setIsMobileSettingModalOpen(false)
                    }}
                    className="flex gap-2 items-center w-full py-[10px] hover:bg-bagstrap-10 px-2 rounded-[8px]">
                    <ShareIcon className="w-5 h-5 text-gray-90" />
                    <div className="text-gray-90 text-med-14"
                    >URL로 공유
                    </div>
                </button>

                {/* 색상 변경 패널 */}
                <div className="flex flex-col gap-2 my-[10px] px-2 w-full">
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

                {/* 삭제하기 버튼 */}
                <button
                    onClick={() => {
                        handleDelete(selectedTimeTableEntity.uuid as string)
                        setSelectedTimeTableEntity(sortedTimeTableEntityList.find(timeTable => timeTable.isFavorite) as TimeTableEntityView)
                        setIsMobileSettingModalOpen(false)
                    }}
                    className="flex gap-2 items-center w-full pt-[15px] px-2 rounded-[8px] text-red">
                    <DeleteIcon className="w-5 h-5" />
                    <div className="text-med-14">
                        삭제하기
                    </div>
                </button>
            </div>

        </div >
    )
}

export default observer(MobileSettingModal)