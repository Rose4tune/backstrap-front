import PageLayout from "@layouts/PageLayout";
import { useMediaQuery } from "@mui/material";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import MobileGradOnboardingList from "./MobileGradOnboardingList";
import DesktopGradOnboardingList from "./DesktopGradOnboardingList";
import { GetServerSidePropsContext } from "next";
import getAllTags from "@api/tag/getAllTags";
import { components } from "src/types/api";
import MobileGradFooter from "src/components/grad-onboarding/mobile/MobileGradFooter";
import MobileGradHeader from "src/components/grad-onboarding/mobile/MobileGradHeader";
import GlobalHeader from "src/components/header/GlobalHeader";
import Footer from "elements/Footer";

type TagEntityViewDto = components['schemas']['TagEntityViewDto']

interface Props {
    tagList: TagEntityViewDto[]
}

function GradListPage({ tagList }: Props) {
    const isMobile = useMediaQuery('(max-width:550px)');
    const router = useRouter();

    //query parsing
    const { tagUuid } = router.query;
    const tagUuidValue = Array.isArray(tagUuid) ? tagUuid[0] : tagUuid;

    return (

        isMobile ?
            <div>
                <MobileGradHeader page={"LIST"} />
                < MobileGradOnboardingList tagList={tagList} />
                <MobileGradFooter />
            </div> :
            <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
                <GlobalHeader />
                <DesktopGradOnboardingList tagList={tagList} tagUuidValue={tagUuidValue} />
                <Footer />
            </ div >

    )
}

export default observer(GradListPage)


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const tagRes = await getAllTags()
    return {
        props: {
            tagList: tagRes.success ? tagRes?.data : [],
        }
    }
}