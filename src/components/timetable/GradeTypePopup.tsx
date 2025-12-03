import TextField from "@common/input/TextField";
import { Dispatch, SetStateAction } from "react";
import DropdownSelection from "../common/DropdownSelection";
interface CalculatorPopupProps {
    title: string;
    gradeTotalTypeNumber: number;
    setGradeTotalTypeNumber: Dispatch<SetStateAction<number>>
    buttonName: string;
    onAction: () => void;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}
export default function GradeTypePopup(props: CalculatorPopupProps) {
    const { title, gradeTotalTypeNumber, setGradeTotalTypeNumber, onAction, setIsOpen, buttonName } = props

    return (
        <>
            {/* 배경 Dim */}
            <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-dim z-[10002]"
            />
            <div className="w-full mx-auto w-[calc(100%-24px)] max-w-[375px] z-[10004] bg-white rounded-[24px] px-5 py-6 gap-5 flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <DropdownSelection title={title} placeholder="총점 평점을 선택해주세요." onChange={(val) => setGradeTotalTypeNumber(Number(val))} options={[4.0, 4.3, 4.5]} value={String(gradeTotalTypeNumber)} optionTextStyle="text-semibold-14" iconSize={24} needGap />
                <button className="bg-normal text-white text-semibold-16 rounded-[16px] py-4"
                    onClick={() => {
                        onAction()
                        setIsOpen(false)
                    }
                    }>
                    {buttonName}
                </button>
            </div>
        </>
    )
}