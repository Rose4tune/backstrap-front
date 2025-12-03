import HotComment from "src/components/community/box/HotComment";
import ProfileBox from "src/components/community/ProfileBox";
import Side from "src/components/community/box/Side";
import SideHome from "src/components/community/box/SideHome";
import { useMediaQuery } from "@mui/material";

interface SideSectionProps {
    categoryUuid?: string | null;
    isHome?: boolean
}

export default function SideSection({ categoryUuid, isHome=false }: SideSectionProps) {
    const up1920 = useMediaQuery('(min-width:1920px)');
    // 카테고리 정보가 있는 경우
    {
        return (
            <div className="flex flex-col gap-y-8 bg-white h-full">
                <ProfileBox/>
                {isHome&&up1920?
                    <SideHome sortType="MONTHLY_POPULAR"/>
                    : <Side uuid={categoryUuid||' '} title="게시판 추천글" sortType="MONTHLY_POPULAR"/>
                }
                <HotComment title="가장 핫한 댓글"/>
            </div>
        );
    }
}