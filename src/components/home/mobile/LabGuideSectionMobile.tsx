import { useRouter } from "next/router";
import LoveLetterIcon from "src/assets/icons/common/LoveLetterIcon.svg";
import { useEffect, useState } from "react";
import getGuides from "src/apis/home/getGuides";
import { components } from "src/types/api";
import Image from "next/image"; // ✅ 추가
import SectionHeaderMobile from "./SectionHeaderMobile";

type GuideDto = components["schemas"]["GuideDto"];

export default function LabGuideSectionMobile() {
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
        <div className="w-full space-y-4">
            <SectionHeaderMobile
                icon={LoveLetterIcon}
                content="대학원별 합격가이드"
                navigateText="더보기"
                onClick={() => router.push("/community/lmokjhhkdr?name=대학원별 합격가이드")}
            />
            <div className="w-full flex">
                {schoolList?.slice(0, 6)?.map((item, idx) => (
                    <div className="space-y-3 flex flex-1 mb-[24px]">
                        <div
                            key={item.postUuid}
                            className="flex flex-col flex-1 items-center rounded-[8px]  cursor-pointer"
                            onClick={() => window.open(item.webUrl)}
                        >
                            <Image
                                src={item.iconUrl as string}
                                alt="guide-icon"
                                width={40}
                                height={40}
                                className="object-cover w-[40px] h-[40px] rounded-[8px] border-gray-20 border-[1px] "
                            />
                            <p className="text-semibold-12 text-gray-90 text-center mt-[8px]">
                                {item.schoolName}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div >
    );
}
