import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg"

export default function DiscountPopupwithoutLogin() {
    return (
        <span className="w-fit flex text-center px-[16px] py-[12px] bg-gray-30 rounded-[8px] text-red relative z-10 justify-center gap-[10px]">
            <span className="text-semibold-14">
                <span className="text-gray-90">회원가입/로그인하고</span>
                <span className="text-red">{" "}20% 할인 혜택</span>
                <span className="text-gray-90">을 만나보세요!</span>
            </span>
            {/* <RightArrowIcon
                className="text-gray-50 mt-[2px]"
                width={20}
                height={20}
            /> */}
            {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-b-[8px] border-b-gray-30" /> */}
            {/* 삼각형 (위쪽 방향) */}
        </span>
    )
}