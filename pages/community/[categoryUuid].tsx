import PageLayout from "@layouts/PageLayout";
import PostPageLayout from "@layouts/PostPageLayout";
import { useRouter } from "next/router";
import { Best, MainList } from "src/components/community";
import SideSection from "./post/SideSection";
import Notice from "src/components/community/box/Notice";
import { useMediaQuery } from "@mui/material";
import DropdownArrowIcon from '@assets/icons/community/chevron-left.svg';
import CommunityNavigatorMobile from "src/components/mobile/community/CommunityNavigator.mobile";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BottomTab from "src/components/mobile/BottomTab";
import PostEditPopup from "src/components/community/PostEditPopup";
import GlobalHeader from "src/components/header/GlobalHeader";
import Footer from "elements/Footer";

const CommunityWithUuid = () => {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:550px)');
    let { categoryUuid } = router.query;
    const NO_UUID_LIST = ['recent', 'topComment', 'popular'];
    const categoryName = useSearchParams().get('name');
    const initialPage = useSearchParams().get('page');
    const sortType = useSearchParams().get('sortType') as "LIKE" | "MONTHLY_COMMENT_POPULAR" | "MONTHLY_IF_POPULAR" | "MONTHLY_POPULAR" | "MONTHLY_VOTE_POPULAR" | "POPULAR" | "RECENT" | "COMMENT" | null;
    if (router.isReady && typeof categoryUuid === 'string') {
        const validCategoryUuid: string | undefined = NO_UUID_LIST.includes(categoryUuid) ? undefined : categoryUuid;
        if (isMobile) {
            return (
                <PageLayout mobileSimple={true} postEditPopup={true}>
                        <CommunityNavigatorMobile type="dropdown" categoryUuid={validCategoryUuid} sortType={sortType ?? 'RECENT'}>
                            <div className="flex px-5 pb-2 gap-x-1 w-full items-center">
                                <div className="text-bold-20 text-gray-90">{categoryName}</div>
                                <DropdownArrowIcon className="w-5 h-5 rotate-90 text-gray-50" />
                            </div>
                        </CommunityNavigatorMobile>
                </PageLayout>
            )
        }
        else return (
            <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
                <GlobalHeader />
                <PostPageLayout>
                    <PostEditPopup />
                    <div className='w-full flex flex-row gap-x-6 lg:gap-x-10 xl:gap-x-12 2xl:gap-x-16 justify-center min-w-[1020px] px-4'>
                        {/* <div className='w-full flex flex-row gap-x-6 lg:gap-x-10 xl:gap-x-12 2xl:gap-x-16 justify-center px-4'> */}
                        {/* Main content area - responsive width */}
                        <div className='flex flex-col gap-y-8 w-full min-w-[574px]'>
                            {/* Top section - Best and Notice */}
                            <div className="flex flex-row gap-x-4 w-full min-w-[608px]">
                                <div className='w-1/2 min-w-[287px]'>
                                    <Best />
                                </div>
                                <div className='w-1/2 min-w-[287px]'>
                                    <Notice title='끈지기 공지' uuid='qohnwionlr' />
                                </div>
                            </div>
                            {/* Main list */}
                            <MainList
                                categoryUuid={validCategoryUuid}
                                sortType={sortType || undefined}
                                title={categoryName || ''}
                                pageSize={20}
                                showWriteButton={true}
                                initialPage={Number(initialPage) || 1}
                            />
                        </div>
                        {/* Sidebar - responsive width */}
                        <div className='max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]'>
                            <SideSection
                                categoryUuid={validCategoryUuid}
                            />
                        </div>
                    </div>
                </PostPageLayout>
                <Footer />
            </div>
        )
    }
    else return (
        <></>
    )
}

export default CommunityWithUuid;