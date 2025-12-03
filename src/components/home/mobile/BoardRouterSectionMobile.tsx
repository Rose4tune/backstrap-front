import { useRouter } from "next/router"
import BagIcon from "src/assets/icons/mentoring/[renewal]MentoringBagIcon.svg"
import PencilIcon from "src/assets/icons/home/PencilIcon.svg"
import GlassessIcon from "src/assets/icons/mentoring/[renewal]MentoringReadingGlassesIcon.svg"
import PaperIcon from "src/assets/icons/home/PaperIcon.svg"
import { useStore } from "@stores/useStore.hook"
import MapIcon from "src/assets/icons/mentoring/[renewal]MentoringMapIcon.svg"
import { observer } from "mobx-react"

export function BoardRouterSectionMobile() {
    const router = useRouter();
    const { UserStore } = useStore()
    async function redirectCVMO () {
        await UserStore.fetchUser();
        // router.replace(`http://localhost:3000/mo/home/web/guest?token=${UserStore.getAccessToken()}`);
        router.replace(`https://career.bagstrap.team/mo/home/web/guest?token=${UserStore.getAccessToken()}`);
    }
    return (
        <div className="flex">
            {/* best끈으로 이동 */}
            <div className="flex flex-col flex-1 items-center justify-center gap-1 cursor-pointer"
                onClick={() => router.push('/grad-onboarding')}>
                <BagIcon width={24} height={24} />
                <p className="text-bold-12 text-gray-80">대학원 온보딩</p>
            </div>
            {/* 채용으로 이동 */}
            <div className="flex flex-col flex-1 items-center justify-center gap-1 cursor-pointer"
                onClick={() => redirectCVMO()}>
                <PaperIcon width={24} height={24} />
                <p className="text-bold-12 text-gray-80">CV</p>
            </div>
            {/* 합격수기로 이동 */}
            <div className="flex flex-col flex-1 items-center justify-center gap-1 cursor-pointer"
                onClick={() => router.push('/community/lmokjhhkdr?name=합격수기')}>
                <PencilIcon width={24} height={24} />
                <p className="text-bold-12 text-gray-80">합격수기</p>
            </div>
            {/* 연구실로 이동 */}
            <div className="flex flex-col flex-1 items-center justify-center gap-1 cursor-pointer"
                onClick={() => router.push('/community/hpmnliqkjo?name=연구실')}>
                <GlassessIcon width={24} height={24} />
                <p className="text-bold-12 text-gray-80">연구실</p>
            </div>
            {/* 정보게시끈으로 이동 */}
            <div className="flex flex-col flex-1 items-center justify-center gap-1 cursor-pointer"
                onClick={() => router.push('/community/hifnflwnqw?name=논문팁')}>
                <MapIcon width={24} height={24} />
                <p className="text-bold-12 text-gray-80">논문팁</p>
            </div>
        </div>
    )
}
export default observer(BoardRouterSectionMobile)