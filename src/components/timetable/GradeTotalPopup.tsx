import TextField from "@common/input/TextField";
import { Dispatch, SetStateAction } from "react";
interface CalculatorPopupProps {
    title: string;
    value: number | string;
    setValue: Dispatch<SetStateAction<string | number>>
    buttonName: string;
    onAction: () => void;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}
export default function GradeTotalPopup(props: CalculatorPopupProps) {
    const { title, value, setValue, onAction, setIsOpen, buttonName } = props
    return (
        <>
            {/* 배경 Dim */}
            <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-dim z-[10002]"
            />
            <div className="w-full mx-auto w-[calc(100%-24px)] max-w-[375px] z-[10004] bg-white rounded-[24px] px-5 py-6 gap-5 flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <TextField title={title} device={"mobile"} value={String(value)} onChange={(val) => setValue(val)
                } />
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