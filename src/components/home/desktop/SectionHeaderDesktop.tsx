import { FC, SVGProps, ReactNode } from "react";
import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg";

interface SectionHeaderProps {
    icon: FC<SVGProps<SVGElement>>;
    content: ReactNode;
    navigateText?: string;
    onClick?: () => void;
    subtitle?: string;
}

const SectionHeaderDesktop: FC<SectionHeaderProps> = ({ icon: Icon, content, navigateText, onClick, subtitle }) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between w-full">
                {/* Left: 아이콘 + 텍스트 */}
                <div className="flex items-center gap-2">
                    <Icon width={32} height={32} />
                    <div className="flex text-black text-bold-20">{content}</div>
                </div>

                {/* Right: 전체보기/더보기 버튼 */}
                {navigateText && <button onClick={onClick} className="flex px-[8px] py-[10px] items-center gap-[4px] text-meidum-16 text-gray-50 flex-shrink-0">
                    {navigateText}
                    <RightArrowIcon className="w-[16px] h-[16px]" />
                </button>}
            </div>
            <p className="text-gray-70 text-semibold-16">{subtitle}</p>

        </div>
    );
};

export default SectionHeaderDesktop;
