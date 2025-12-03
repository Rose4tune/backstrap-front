import PageLayout from "@layouts/PageLayout";
import { useMediaQuery } from "@mui/material";
import { observer } from "mobx-react";
import { GetServerSidePropsContext } from "next";
import { components } from "src/types/api";
import getArticle from "@api/article/getByUuid";
import MobileArticleDetail from "./MobileArticleDetail";
import DesktopArticleDetail from "./DesktopArticleDetail";
import MobileGradHeader from "src/components/grad-onboarding/mobile/MobileGradHeader";
import { getAccessTokenFromCookies } from "@pages/index";
import { NextSeo } from 'next-seo';
import GlobalHeader from "src/components/header/GlobalHeader";
import Footer from "elements/Footer";

type ArticleViewDto = components['schemas']['ArticleViewDto']

interface Props {
    article: ArticleViewDto
}

function ArticleDetailPage({ article }: { article: ArticleViewDto }) {
    const isMobile = useMediaQuery('(max-width:550px)');
    return (
        <>
            <NextSeo
                title={article.title}
                description={article.smallTitle}
                canonical={`https://www.bagstrap.team/grad-onboarding/detail/${article.uuid}`}
                openGraph={{
                    type: 'website',
                    url: `https://www.bagstrap.team/grad-onboarding/detail/${article.uuid}`,
                    title: article.title,
                    description: article.smallTitle,
                    images: [
                        {
                            url: article.imageUrlM as string,
                            alt: article.title,
                        },
                    ],
                    site_name: 'Bagstrap',
                }}
            />

            {isMobile ?
                <div>
                    <MobileGradHeader page={"DETAIL"} article={article} />
                    < MobileArticleDetail article={article} />
                </div> :
                <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
                    <GlobalHeader />
                    <DesktopArticleDetail article={article} />
                    <Footer />
                </ div >

            }
        </>

    )
}

export default observer(ArticleDetailPage)


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { uuid } = context.query
    const accessToken = getAccessTokenFromCookies(context.req);

    const uuidValue = Array.isArray(uuid) ? uuid[0] : uuid
    const articleRes = await getArticle(uuidValue as string, accessToken as string)
    return {
        props: {
            article: articleRes.success ? articleRes?.data : {}
        }
    }
}