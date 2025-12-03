import { observer } from "mobx-react";
import { useRouter } from "next/router";

export default function MobileGradFooter() {
    return (
        <div onClick={() => window.open("https://walla.my/v/w85vkot13KvHY4eYMJ6t", '_blank')} className="w-full p-5 bg-[#8FA4FF] text-white cursor-pointer">
            <span className="flex text-bold-16 mb-[2px]">듣고 싶은 이야기가 있나요?</span>
            <span className="flex text-semibold-12">아티클로 보고 싶은 주제들을 가방끈팀에게 알려주세요!</span>
        </div>
    )
}