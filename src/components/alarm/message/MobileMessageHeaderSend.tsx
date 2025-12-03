import React from "react";
import ArrowLeftIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg";

import { useRouter } from "next/navigation";
import { useStore } from "@stores/useStore.hook";



const MobileMessageHeaderSend: React.FC = () => {
    const {HeaderStore} = useStore()

    return (
        <>
            <div className="fixed top-0 w-full bg-white flex items-center justify-between px-5 pt-[53px] pb-[20px] border-b border-gray-30">
                <button
                    onClick={() => HeaderStore.setIsSendMessageOpen(false)}
                    className="w-[26px] h-[26px] flex items-center justify-center">
                    <ArrowLeftIcon width={20} height={20} className="text-gray-50" />
                </button>

                <div className="flex gap-2 items-center">
                    <span className="text-semibold-16 text-gray-90">{"채팅 시작하기"}</span>
                </div>
                <div className="w-[26px] h-[26px]" />

            </div>
        </>
    );
};

export default MobileMessageHeaderSend;
