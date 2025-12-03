import PageLayout from "@layouts/PageLayout";
import { useMediaQuery } from "@mui/material";
import DesktopGradOnboarding from "./DesktopGradOnboarding";
import MobileGradOnboarding from "./MobileGradOnboarding";
import getYoutubeUrls from "@api/home/getYoutubeUrls";
import { GetServerSidePropsContext } from "next";
import { getMentorByPaging } from "@api/mentor/getMentorByPaging";
import { components } from "src/types/api";
import getAllTags from "@api/tag/getAllTags";
import { getArticlesByPaging } from "@api/article/getByPaging";
import getTagsByPaging from "@api/tag/getTagsByPaging";
import { getAccessTokenFromCookies } from "..";
import MobileGradHeader from "src/components/grad-onboarding/mobile/MobileGradHeader";
import MobileGradFooter from "src/components/grad-onboarding/mobile/MobileGradFooter";
import NavigationHeader from "src/components/header/NavigationHeader";
import Footer from "elements/Footer";
import GlobalHeader from "src/components/header/GlobalHeader";

interface Props {
    youtubeList: string[];
    mentorList: MentorViewDto[] | null
    tagList: TagEntityViewDto[] | null
    plannedArticleList: ArticleViewDto[] | null
    keywordList: TagEntityViewDto[] | null
    openArticleList: ArticleViewDto[] | null
    bannerArticleList: ArticleViewDto[] | null
}


type MentorViewDto = components["schemas"]["MentorViewDto"]
type TagEntityViewDto = components['schemas']['TagEntityViewDto']
type ArticleViewDto = components['schemas']['ArticleViewDto']

export default function GradOnboardingPage({ youtubeList, mentorList, tagList, plannedArticleList, keywordList, openArticleList, bannerArticleList }: Props) {
    const isMobile = useMediaQuery('(max-width:550px)');
    return (
        isMobile ?
            <div>
                <MobileGradHeader page={"HOME"} />
                < MobileGradOnboarding
                    keywordList={keywordList}
                    openArticleList={openArticleList}
                    tagList={tagList}
                />
                <MobileGradFooter />
            </div>
            :
            <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
                <GlobalHeader />
                <DesktopGradOnboarding
                    youtubeList={youtubeList}
                    mentorList={mentorList}
                    tagList={tagList}
                    plannedArticleList={plannedArticleList}
                    keywordList={keywordList}
                    openArticleList={openArticleList}
                    bannerArticleList={bannerArticleList}
                />
                <Footer />
            </ div >

    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const accessToken = getAccessTokenFromCookies(context.req);

    const youtubeRes = await getYoutubeUrls()
    const mentorRes = await getMentorByPaging({ count: 10 }, accessToken as string)
    const tagRes = await getAllTags()
    const plannedArticleRes = await getArticlesByPaging({ count: 20, fetchType: 'EXPECTED' }, accessToken as string)
    const keywordRes = await getTagsByPaging({ count: 5, isTop: true })
    const openArticleRes = await getArticlesByPaging({ count: 5, fetchType: "OPEN" }, accessToken as string)
    const bannerArticleRes = await getArticlesByPaging({ count: 20, fetchType: "TOP" }, accessToken as string)
    return {
        props: {
            youtubeList: youtubeRes.success ? youtubeRes.data : [],
            mentorList: mentorRes.success ? mentorRes.data?.data : [],
            tagList: tagRes.success ? tagRes?.data : [],
            plannedArticleList: plannedArticleRes.success ? plannedArticleRes.data?.data : [],
            keywordList: keywordRes.success ? keywordRes?.data?.data : [],
            openArticleList: openArticleRes.success ? openArticleRes.data?.data : [],
            bannerArticleList: bannerArticleRes.success ? bannerArticleRes.data?.data : []
        }
    }
}