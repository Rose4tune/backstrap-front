import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { components } from "src/types/api";
import DropdownSelection from "../common/DropdownSelection";
import getTimeTables from "@api/time-table/getTimeTables";
import { observer } from "mobx-react";
import { useStore } from "@stores/useStore.hook";
import ErrorPopup from "@common/ErrorPopup";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEntityView = components["schemas"]["TimeTableEntityView"];

interface LoadedTimePopupProps {
    title: string;
    selectedSemester: TimeTableTemplate | undefined;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    buttonName: string;
    onAction: (uuid: string) => void;
}

// 화면 표시용 텍스트: 이름 + (대표)
function buildDisplayName(t: TimeTableEntityView) {
    const name = t.name ?? "(이름 없음)";
    return t.isFavorite ? `${name} (대표)` : name;
}

/** 보이지 않는 문자들 */
const HIDDEN_SEP = "\u2063"; // Invisible Separator
const ZW0 = "\u200B";        // Zero Width Space (0)
const ZW1 = "\u200C";        // Zero Width Non-Joiner (1)

/** index를 '완전 보이지 않는' 토큰으로 인코딩: SEP + [0/1을 ZW0/ZW1로 치환한 이진문자열] + SEP */
function encodeIndexToInvisibleToken(index: number): string {
    if (!Number.isInteger(index) || index < 0) return "";
    const bits = index.toString(2); // e.g., 13 -> "1101"
    const payload = bits.split("").map((b) => (b === "0" ? ZW0 : ZW1)).join("");
    return `${HIDDEN_SEP}${payload}${HIDDEN_SEP}`;
}

/** 문자열 끝의 보이지 않는 토큰을 찾아 index로 복구 */
function decodeInvisibleTokenToIndex(val: string): number | null {
    // 마지막 SEP 이후에 payload가 오고, 그 이전에 또 SEP가 있는 형태를 기대
    const lastSep = val.lastIndexOf(HIDDEN_SEP);
    if (lastSep < 0) return null;

    // 마지막 SEP 이전의 SEP를 찾음 (토큰은 SEP로 감싸져 있음)
    const prevSep = val.lastIndexOf(HIDDEN_SEP, lastSep - 1);
    if (prevSep < 0) return null;

    const payload = val.slice(prevSep + 1, lastSep);
    if (!payload) return null;

    // payload는 ZW0/ZW1만으로 구성됨 → 0/1로 역치환
    let bits = "";
    for (const ch of payload) {
        if (ch === ZW0) bits += "0";
        else if (ch === ZW1) bits += "1";
        else return null; // 예상치 못한 문자
    }
    if (!bits) return null;

    const num = parseInt(bits, 2);
    return Number.isFinite(num) ? num : null;
}

function LoadedTimePopup(props: LoadedTimePopupProps) {
    const { title, setIsOpen, onAction, buttonName, selectedSemester } = props;
    const [selectedTimeTable, setSelectedTimeTable] = useState<TimeTableEntityView>();
    const [timeTableList, setTimeTableList] = useState<TimeTableEntityView[]>([]);
    const { UserStore } = useStore();
    const userUuid = UserStore.getUserId();
    const accessToken = UserStore.getAccessTokenFromCookies();

    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function getSemesterTimeTableList() {
            try {
                const result = await getTimeTables(
                    {
                        year: selectedSemester?.year,
                        semesterType: selectedSemester?.semester,
                        userUuid: userUuid,
                    },
                    accessToken
                );
                if (result?.success && result.data) {
                    const list = result.data;
                    setTimeTableList(list);

                    // 대표 시간표로 초기 선택 (없으면 첫 번째)
                    const fav = list.find((v) => v.isFavorite);
                    setSelectedTimeTable(fav ?? list[0]);
                } else {
                    setTimeTableList([]);
                    setSelectedTimeTable(undefined);
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
        getSemesterTimeTableList();
    }, [selectedSemester, userUuid, accessToken]);

    /**
     * 옵션 문자열: "표시이름 + (보이지 않는 SEP + 보이지 않는 payload + 보이지 않는 SEP)"
     * - 화면/복사/스크린리더 어디에도 숫자나 uuid가 드러나지 않음
     * - 내부적으로는 payload를 디코딩하여 index 복구
     */
    const optionStrings = useMemo(() => {
        return timeTableList.map((t, idx) => {
            const display = buildDisplayName(t);
            return `${display}${encodeIndexToInvisibleToken(idx)}`;
        });
    }, [timeTableList]);

    /**
     * 현재 선택값도 동일한 규칙의 문자열이어야 함
     * - selectedTimeTable의 index를 찾아 같은 방식으로 인코딩
     */
    const selectedValue = useMemo(() => {
        if (!selectedTimeTable) return "";
        const idx = timeTableList.findIndex((t) => t.uuid === selectedTimeTable.uuid);
        if (idx < 0) return "";
        return `${buildDisplayName(selectedTimeTable)}${encodeIndexToInvisibleToken(idx)}`;
    }, [selectedTimeTable, timeTableList]);

    /**
     * 드롭다운 변경: 보이지 않는 토큰을 디코딩하여 index 추출 → 엔티티 매핑
     */
    const handleChange = (val: string) => {
        const idx = decodeInvisibleTokenToIndex(val);
        if (idx !== null && idx >= 0 && idx < timeTableList.length) {
            setSelectedTimeTable(timeTableList[idx]);
            return;
        }
        // 혹시 토큰 파싱이 실패하면 라벨 매칭(중복 시 첫 번째)으로 폴백
        const pureLabel = val.split(HIDDEN_SEP)[0];
        const found = timeTableList.find((t) => buildDisplayName(t) === pureLabel);
        if (found) setSelectedTimeTable(found);
    };

    const onClickAction = () => {
        const uuid = selectedTimeTable?.uuid;
        if (uuid) onAction(uuid);
        setIsOpen(false);
    };

    return (
        <>
            {/* 배경 Dim */}
            <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-dim z-[10002]" />

            <div className="w-full mx-auto max-w-[375px] w-[calc(100%-24px)] z-[10004] bg-white rounded-[24px] px-5 py-6 gap-5 flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <DropdownSelection
                    title={title}
                    placeholder="불러올 시간표를 선택해주세요."
                    options={optionStrings}   // "라벨 + (보이지 않는 토큰)"
                    value={selectedValue}     // 동일 규칙 문자열
                    onChange={handleChange}   // 토큰 디코딩으로 안전 매핑
                    optionTextStyle="text-semibold-14"
                    iconSize={24}
                    needGap
                />

                <button
                    className="bg-normal text-white text-semibold-16 rounded-[16px] py-4 disabled:opacity-50"
                    onClick={onClickAction}
                    disabled={!selectedTimeTable?.uuid}
                >
                    {buttonName}
                </button>
            </div>

            <ErrorPopup
                isOpen={isErrorPopupOpen}
                setIsOpen={setIsErrorPopupOpen}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default observer(LoadedTimePopup);
