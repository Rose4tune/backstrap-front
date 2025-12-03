import { Dispatch, SetStateAction } from "react";
import { TextButtonType } from "src/types/textbuttonType";

const buttonList: TextButtonType[] = ["IF 높은 끈", "최신순", "댓글순", "핫한 투표"];
interface BestTextButtonProps {
    selectedButton: TextButtonType;
    setSelectedButton: Dispatch<SetStateAction<TextButtonType>>;
}

export default function BestTextButtonMobile(props: BestTextButtonProps) {
    const { selectedButton, setSelectedButton } = props
    return (
        <div className="flex items-center space-x-[8px] pt-[8px] pb-[12px]">
            {buttonList.map((button, index) => (
                <div key={button} className="flex items-center">
                    <button
                        onClick={() => setSelectedButton(button)}
                        className={`${selectedButton === button ? "text-hover text-semibold-14" : "text-gray-50 text-med-14"
                            }`}
                    >
                        {button}
                    </button>

                    {/* divider except for the last button */}
                    {index < buttonList.length - 1 && (
                        <div className="w-[1px] h-[16px] bg-gray-20 mx-[8px]" />
                    )}
                </div>
            ))}
        </div>
    )
}

