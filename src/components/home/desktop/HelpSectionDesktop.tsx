import { useRouter } from "next/router";
import SectionHeaderDesktop from "./SectionHeaderDesktop";
import StarIcon from "src/assets/icons/home/StarIcon.svg"
import Image from "next/image"
import MentoringCard from "src/assets/images/home/mentoringCard.png"
import CvMaker from "src/assets/images/home/CvMaker.png"
import { useAICVRedirect } from "src/hooks/useAICVRedirect";
import useAccessToken from "src/hooks/useAcessToken";


export default function HelpSectionDesktop() {
    const router = useRouter()
    const accessToken = useAccessToken()
    const handleAICVRedirect = useAICVRedirect(accessToken)
    return (
        <div className="space-y-4 flex flex-1 flex-col w-full">
            <SectionHeaderDesktop icon={StarIcon}
                content={"대학원 고민, 혼자 하지 마세요"}
            />
            <div className="space-y-3 w-full">
                {/* Mentoring Card - maintains 226px */}
                <div className="cursor-pointer w-full h-[226px]" onClick={() => router.push('/mentoring')}>
                    <Image
                        src={MentoringCard}
                        width={413}
                        height={226}
                        className="object-cover w-full h-full rounded-[16px] object-top"
                        alt={"멘토링카드"} />
                </div>
                {/* CV Maker Card - maintains 226px */}
                <div className="cursor-pointer w-full h-[226px]" onClick={handleAICVRedirect}>
                    <Image
                        src={CvMaker}
                        width={413}
                        height={226}
                        className="object-cover w-full h-full rounded-[16px] object-top"
                        alt={"오픈채팅방카드"} />
                </div>
            </div>
        </div>



    )
}