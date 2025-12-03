export default function DiscountPopupwithLogin() {
    return (
        <span className="w-fit text-semibold-16 text-center px-[12px] py-[8px] bg-red-10 rounded-[8px] text-red relative z-10">
            최저가 할인 쿠폰 적용중!
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-b-[8px] border-b-red-10" />
            {/* 삼각형 (위쪽 방향) */}
        </span>
    )
}