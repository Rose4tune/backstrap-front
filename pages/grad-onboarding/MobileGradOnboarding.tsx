import { useEffect, useState } from "react";
import { components } from "src/types/api";
import NewIcon from "src/assets/icons/grad-onboarding/NewIcon.svg";
import { useRouter } from "next/router";
import ArrowUpIcon from "src/assets/icons/common/ArrowUpIcon.svg";
import ArrowDownIcon from "src/assets/icons/common/ArrowDownIcon.svg";
import GradKeywordMobile from "src/components/grad-onboarding/mobile/GradKeywordMobile";
import GradOpenArticleMobile from "src/components/grad-onboarding/mobile/GradOpenArticleMobile";
import GradNewArticleMobile from "src/components/grad-onboarding/mobile/GradNewArticleMobile";

type TagEntityViewDto = components["schemas"]["TagEntityViewDto"];
type ArticleViewDto = components["schemas"]["ArticleViewDto"];

interface Props {
    tagList: TagEntityViewDto[] | null;
    keywordList: TagEntityViewDto[] | null;
    openArticleList: ArticleViewDto[] | null;
}

export default function MobileGradOnboarding({
    tagList,
    keywordList,
    openArticleList,
}: Props) {

    return (
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
            {/* 실시간 키워드 영역 */}
            <GradKeywordMobile keywordList={keywordList} />
            <GradOpenArticleMobile openArticleList={openArticleList} />
            <GradNewArticleMobile tagList={tagList} />
        </div>
    );
}
