import { Dispatch, SetStateAction } from "react";
import { TextButtonType } from "src/types/textbuttonType";

const buttonList: TextButtonType[] = ["IF 높은 끈", "최신순", "댓글순", "핫한 투표"];
interface BestTextButtonProps {
    selectedButton: TextButtonType;
    setSelectedButton: Dispatch<SetStateAction<TextButtonType>>;
}

export default function BestTextButton(props: BestTextButtonProps) {
    const { selectedButton, setSelectedButton } = props
    return (
        <div className="flex items-center space-x-[8px] px-[12px] py-[8px]">
            {buttonList.map((button, index) => (
                <div key={button} className="flex items-center">
                    <button
                        onClick={() => setSelectedButton(button)}
                        className={`text-med-16 ${selectedButton === button ? "text-hover" : "text-gray-50"
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

