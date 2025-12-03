import { useState, useEffect } from "react";
import MedalIcon from "src/assets/icons/grad-onboarding/MedalIcon.svg";
import NewIcon from "src/assets/icons/grad-onboarding/NewIcon.svg";
import { GradYoutubeSectionDesktop } from "src/components/grad-onboarding/desktop/GradYoutubeSectionDesktop";
import { components } from "src/types/api";
import GradMentorSectionDesktop from "src/components/grad-onboarding/desktop/GradMentorSectionDesktop";
import GradNewArticleDesktop from "src/components/grad-onboarding/desktop/GradNewArticleDesktop";
import GradPlannedSectionDesktop from "src/components/grad-onboarding/desktop/GradPlannedSectionDesktop";
import GradOpenArticleDesktop from "src/components/grad-onboarding/desktop/GradOpenArticleDesktop";
import Image from "next/image";
import LeftArrowIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg";
import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg";
import GradBannerDesktop from "src/components/grad-onboarding/desktop/GradBannerDesktop";
import GradKeywordDesktop from "src/components/grad-onboarding/desktop/GradKeywordDesktop";

interface Props {
    youtubeList: string[] | null;
    mentorList: MentorViewDto[] | null;
    tagList: TagEntityViewDto[] | null;
    plannedArticleList: ArticleViewDto[] | null;
    keywordList: TagEntityViewDto[] | null;
    openArticleList: ArticleViewDto[] | null;
    bannerArticleList: ArticleViewDto[] | null;
}

type MentorViewDto = components["schemas"]["MentorViewDto"];
type ArticleViewDto = components["schemas"]["ArticleViewDto"];
type TagEntityViewDto = components["schemas"]["TagEntityViewDto"];

function DesktopGradOnboarding({
    youtubeList,
    mentorList,
    tagList,
    plannedArticleList,
    keywordList,
    openArticleList,
    bannerArticleList,
}: Props) {

    return (
        <div className="flex flex-col w-full max-w-[1920px]">
            {/* <GradBannerDesktop bannerArticleList={bannerArticleList} /> */}
            {/* ---------------- 실시간 인기 키워드 + 가방끈 Open Access ---------------- */}
            <div className="flex pt-12 pb-[40px] gap-[34px] px-[10rem] w-full max-w-[1920px]">
                <GradKeywordDesktop keywordList={keywordList} />
                <GradOpenArticleDesktop openArticleList={openArticleList} />
            </div>

            <div className="flex flex-col w-full max-w-[1920px] px-[10rem] py-[20px]">
                <GradNewArticleDesktop tagList={tagList} />
            </div>

            <div className="flex flex-col max-w-[1920px] px-[10rem] py-[20px] gap-[24px] ">
                <div className="flex w-full gap-[24px] overflow-x-auto">
                    <GradMentorSectionDesktop mentorList={mentorList} />
                </div>
            </div>

            <div className="flex flex-col max-w-[1920px] px-[10rem] py-[20px] gap-[24px] ">
                <GradYoutubeSectionDesktop youtubeList={youtubeList} />
            </div>

            <div className="flex flex-col max-w-[1920px] px-[10rem] pt-[40px] pb-[80px] gap-[24px] w-full">
                <GradPlannedSectionDesktop plannedArticleList={plannedArticleList} />
            </div>
        </div>

    );
}

export default DesktopGradOnboarding;
