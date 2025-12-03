import { FC, SVGProps, ReactNode } from "react";
import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg";

interface SectionHeaderProps {
    icon: FC<SVGProps<SVGElement>>;
    content: ReactNode;
    navigateText?: string;
    onClick?: () => void;
    subtitle?: string;
}

const SectionHeaderMobile: FC<SectionHeaderProps> = ({ icon: Icon, content, navigateText, onClick, subtitle }) => {
    return (
        <div className="flex flex-col gap-[1px]">
            <div className="flex items-center justify-between w-full">
                {/* Left: 아이콘 + 텍스트 */}
                <div className="flex items-center gap-1">
                    <div className="w-[24px] h-[24px]">
                        <Icon className="w-full h-full" />
                    </div>
                    <div className="text-gray-80 text-bold-16">{content}</div>
                </div>

                {/* Right: 전체보기 버튼 */}
                {navigateText && <button onClick={onClick} className="flex px-[8px] py-[10px] items-center gap-[4px] text-med-12 text-gray-50">
                    {navigateText}
                    <RightArrowIcon className="w-[12px] h-[12px]" />
                </button>}
            </div>
            <div className="text-semibold-12 text-gray-70">
                {subtitle}
            </div>
        </div>
    );
};

export default SectionHeaderMobile;
