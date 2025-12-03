import OnlyBagstrapIcon from "src/assets/icons/mentoring/OnlyBagstrapIcon.svg"
export default function CouponPopupOnlyMembership() {
    return (
        <div className="flex w-fit items-center justify-center space-x-[10px] text-semibold-16 px-[20px] py-[12px] bg-bagstrap-10 rounded-[8px] text-gray-90 relative z-10">
            <OnlyBagstrapIcon width={100} />
            <p>최저가 쿠폰 적용 중!</p>
        </div>
    )
}