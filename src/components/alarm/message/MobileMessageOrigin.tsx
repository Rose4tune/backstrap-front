import React from "react";
import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg";
import DocumentIcon from "src/assets/icons/common/DocumentIcon.svg";

interface Props {
    uuid: string;
    title: string;
    link: string;
}

const MobileMessageOrigin: React.FC<Props> = ({ uuid, title, link }) => {
    return (
        <div className="flex w-full items-center pl-3 pr-2 py-2 rounded-[8px] bg-white">
            <a
                href={link}
                className="flex items-center gap-2 w-full text-semibold-12 text-gray-90"
            >
                <DocumentIcon width={24} height={24} className="flex-shrink-0" />
                <span className="flex">
                    <span>
                        "
                    </span>
                    <div className="flex-1 min-w-0">
                        <span className="truncate block">
                            {title}
                        </span>
                    </div>
                    <span>
                        ”에서 시작된 대화입니다.
                    </span>
                </span>
                <RightArrowIcon
                    width={16}
                    height={16}
                    className="flex-shrink-0 text-gray-50"
                />
            </a>
        </div>
    );
};

export default MobileMessageOrigin;
