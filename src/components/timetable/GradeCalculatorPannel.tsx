import { useEffect, useState } from "react"
import EditIcon from "src/assets/icons/common/EditIcon.svg"
import { useDimScrollForbidden } from "src/hooks/useDimScrollForbidden";
import GradeCalculatorModal from "./GradeCalculatorModal";
import getTimeTableInfo from "@api/time-table/getTimeTableInfo";
import { useStore } from "@stores/useStore.hook";
import ErrorPopup from "@common/ErrorPopup";
import getMe from "@api/user/getMe";
import { observer } from "mobx-react";

function GradeCalculatorPannel() {
    //취득학점의 평균
    const [averageGrade, setAverageGrade] = useState<number>(0)
    //총 학점 평점
    const [gradeTotalTypeNumber, setGradeTotalTypeNumber] = useState<number>(4.5)
    const gradeTotalEnumMap = {
        "FOUR": 4.0,
        "FOURTHREE": 4.3,
        "FOURFIVE": 4.5
    }


    //현재까지 취득한 학점
    const [acquiredGrade, setAcquiredGrade] = useState<number>(0)
    //졸업학점
    const [totalGrade, setTotalGrade] = useState<number | string>(0)

    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    // ErrorPopup 상태
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { UserStore } = useStore()
    const accessToken = UserStore.getAccessTokenFromCookies();

    useDimScrollForbidden(isCalculatorOpen)

    async function refreshUserGradeInfo() {
        if (!accessToken) return;
        try {
            const res = await getTimeTableInfo(accessToken);
            if (res.success && res.data) {
                setAverageGrade(res.data.averageGrade || 0);
                setAcquiredGrade(res.data.acquiredGrades || 0);
            }
            return { averageGrade: res.data?.averageGrade, acquiredGrade: res.data?.acquiredGrades }
        } catch (e: unknown) {
            let msg = "네트워크 오류가 발생했습니다.";
            if (e instanceof Error) msg = e.message;
            else if (typeof e === "string") msg = e;
            else if (e && typeof e === "object" && "message" in e) msg = String((e as any).message);
            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
        }
    }



    useEffect(() => {
        if (!accessToken) return;
        async function getUserGradeInfo() {
            try {
                const res = await getTimeTableInfo(
                    accessToken
                );
                if (res.success && res.data) {
                    setAverageGrade(res.data.averageGrade || 0)
                    setAcquiredGrade(res.data.acquiredGrades || 0)
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
        getUserGradeInfo()
    }, [accessToken])



    useEffect(() => {
        if (!accessToken) return;
        async function getTotalGradeInfo() {
            try {
                const res = await getMe(
                    accessToken
                );
                if (res.success && res.data) {
                    setGradeTotalTypeNumber(gradeTotalEnumMap[res.data.gradeTotalType || "FOURFIVE"] || 4.5)
                    setTotalGrade(res.data.totalGrade || 0)
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
        getTotalGradeInfo()
    }, [accessToken])

    return (
        < div className="flex flex-col gap-3 p-[18px] rounded-[12px] bg-gray-20" >
            <div className="flex items-center justify-between">
                <span className="text-bold-16 text-gray-90">학점 계산기</span>
                <button onClick={() => setIsCalculatorOpen(true)}>
                    <EditIcon className="w-[24px] h-[24px] text-gray-50" />
                </button>
            </div>
            <div className="flex gap-3 items-center">
                <span className="text-gray-90 text-semibold-14">평균 학점</span>
                <span className="text-gray-50 text-semibold-12">
                    <span className="text-normal text-semibold-14">{averageGrade}</span> / {gradeTotalTypeNumber}
                </span>
            </div>
            <div className="flex gap-3 items-center">
                <span className="text-gray-90 text-semibold-14">취득 학점</span>
                <span className="text-gray-50 text-semibold-12">
                    <span className="text-normal text-semibold-14">{acquiredGrade}</span> / {totalGrade}
                </span>
            </div>
            {isCalculatorOpen &&
                <GradeCalculatorModal
                    averageGrade={averageGrade}
                    setAverageGrade={setAverageGrade}
                    gradeTotalTypeNumber={gradeTotalTypeNumber}
                    setGradeTotalTypeNumber={setGradeTotalTypeNumber}
                    acquiredGrade={acquiredGrade}
                    setAcquiredGrade={setAcquiredGrade}
                    totalGrade={totalGrade}
                    setTotalGrade={setTotalGrade}
                    setIsCalculatorOpen={setIsCalculatorOpen}
                    refreshUserGradeInfo={refreshUserGradeInfo}
                />
            }
            {isErrorPopupOpen && (
                <ErrorPopup
                    isOpen={isErrorPopupOpen}
                    setIsOpen={setIsErrorPopupOpen}
                    errorMessage={errorMessage}
                />
            )}
        </div >

    )
}

export default observer(GradeCalculatorPannel)