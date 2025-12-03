import { useRouter } from "next/router";
import SectionHeaderDesktop from "./SectionHeaderDesktop";
import LoveLetterIcon from "src/assets/icons/common/LoveLetterIcon.svg";
import { useEffect, useState } from "react";
import getGuides from "src/apis/home/getGuides";
import { components } from "src/types/api";
import Image from "next/image"; // ✅ 추가

type GuideDto = components["schemas"]["GuideDto"];

export default function LabGuideSectionDesktop() {
    const router = useRouter();
    const [schoolList, setSchoolList] = useState<GuideDto[] | null>(null);

    useEffect(() => {
        async function getSchoolList() {
            try {
                const response = await getGuides();
                if (response.success) {
                    setSchoolList(response.data ?? []);
                }
            } catch (error) {
                console.error("새로고침해주세요: ", error);
            }
        }
        getSchoolList();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-4">
            <SectionHeaderDesktop
                icon={LoveLetterIcon}
                content="대학원별 합격가이드"
                navigateText="더보기"
                onClick={() => router.push("/board/lmokjhhkdr")}
            />
            <div className="flex flex-1 overflow-x-scroll" style={{scrollbarWidth:'none'}}>
                {schoolList?.slice(0,6).map((item, idx) => (
                    <div className="flex flex-1 flex-col gap-2">
                        <div
                            key={item.postUuid}
                            className="w-[80px] rounded-[12px] overflow-hidden cursor-pointer"
                            onClick={() => window.open(item.webUrl)}
                        >
                            <Image
                                src={item.iconUrl as string}
                                alt="guide-icon"
                                width={80}
                                height={80}
                                className="object-cover w-[80px] h-[80px] rounded-[12px]"
                            />
                            <p className="text-semibold-16 text-gray-90 truncate text-center mt-[8px]">
                                {item.schoolName}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div >
    );
}
