import { useEffect, useState } from "react";
import SectionHeaderDesktop from "./SectionHeaderDesktop";
import SchoolIcon from "src/assets/icons/common/SchoolIcon.svg";
import getUserCounts from "src/apis/school-type/getUserCounts";
import Image from "next/image";
import Medal1 from "src/assets/icons/home/medal1.svg";
import Medal2 from "src/assets/icons/home/medal2.svg";
import Medal3 from "src/assets/icons/home/medal3.svg";
import { components } from "src/types/api";

type SchoolItem = components["schemas"]["SchoolTypeUserCountDto"]

export default function SchoolUserLankDesktop() {
    const [schoolList, setSchoolList] = useState<SchoolItem[]>();

    useEffect(() => {
        async function getUserLank() {
            try {
                const response = await getUserCounts();
                setSchoolList(response.data);
            } catch (error) {
                console.error("새로고침해주세요: ", error);
            }
        }
        getUserLank();
    }, []);

    const renderRankIcon = (index: number) => {
        if (index === 0) return <Medal1 width={20} height={20} />;
        if (index === 1) return <Medal2 width={20} height={20} />;
        if (index === 2) return <Medal3 width={20} height={20} />;
        return (
            <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-bold-16 text-gray-50">
                {index + 1}
            </div>
        );
    };

    return (
        <div className="flex flex-1 flex-col space-y-4">
            <SectionHeaderDesktop icon={SchoolIcon} content="실시간 학교별 유저 순위" />
            <div className="grid grid-flow-col grid-rows-3 gap-y-1 gap-x-2">
                {schoolList?.slice(0, 9).map((item, index) => (
                    <div key={item.schoolTypeName} className="flex px-[4px] py-[11px] w-[203px] items-center gap-[8px]">
                        {renderRankIcon(index)}

                        {/* 학교 로고가 있을 경우 */}
                        {item.iconUrl && (
                            <div className="w-[20px] h-[20px] rounded-full overflow-hidden">
                                <Image
                                    src={item.iconUrl}
                                    alt={`${item.schoolTypeName} 로고`}
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <p className="flex whitespace-nowrap gap-[7px] text-gray-90 text-semibold-14">
                            {item.schoolTypeName ?? "-"}{" "}
                            <span>{item.userCount?.toLocaleString() ?? 0}명</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
