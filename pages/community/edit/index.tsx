import { Router, useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageLayout from "@layouts/PageLayout";
import PostPageLayout from "@layouts/PostPageLayout";
import { PostEditor } from 'src/components/community';
import { useMediaQuery } from '@mui/material';
import SideSection from '../post/SideSection';
import useRequireAuth from '../../../src/hooks/useRequireAuth';
import BottomTab from 'src/components/mobile/BottomTab';
import { useStore } from '@stores/useStore.hook';
import VerificationRequiredPopup from 'src/components/common/VerificationRequiredPopup';
import { useSearchParams } from 'next/navigation';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const PostEditPage = () => {
    const isMobile = useMediaQuery('(max-width:550px)');
    const categoryUuid = useSearchParams().get('categoryUuid');
    const { isLoading, isAuthenticated } = useRequireAuth();
    const { UserStore } = useStore();
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const router = useRouter();

    // UserStore 초기화
    useEffect(() => {
        if (UserStore.isEmpty() && UserStore.loadingState === 'idle') {
            UserStore.fetchUser();
        }
    }, [UserStore]);

    // 로그인 및 학교 인증 상태 체크
    useEffect(() => {
        console.log('Auth and Verification check:', {
            isLoading,
            isAuthenticated,
            userIsLoading: UserStore.isLoading,
            isEmpty: UserStore.isEmpty(),
            isVerified: UserStore.isVerified,
            user: UserStore.user,
            schoolVerificationStatus: UserStore.user?.schoolVerificationStatus
        });

        // 로딩이 끝났을 때 체크
        if (!isLoading) {
            // 로그인이 안되어 있으면 팝업 표시
            if (!isAuthenticated) {
                console.log('Not authenticated - showing popup');
                setShowVerificationPopup(true);
            }
            // 로그인은 되어 있지만 학교 인증이 안되어 있으면 팝업 표시
            else if (isAuthenticated && !UserStore.isLoading && !UserStore.isEmpty() && !UserStore.isVerified) {
                console.log('Authenticated but not verified - showing popup');
                setShowVerificationPopup(true);
            }
        }
    }, [isLoading, isAuthenticated, UserStore.isVerified, UserStore.isLoading, UserStore.isEmpty()]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <PageLayout mobileSimple={true}>
                <PostPageLayout>
                    <div className="w-full flex justify-center">
                        <div className="flex flex-col items-center justify-center h-64">
                            <img src="/assets/loading.gif" alt="로딩" className="w-8 h-8 mb-4" />
                            <span className="text-med-16 text-gray-70">인증을 확인하는 중...</span>
                        </div>
                    </div>
                </PostPageLayout>
            </PageLayout>
        );
    }

    // ... 위의 코드 동일

    // 로그인이 안되어 있거나 학교 인증이 안되어 있으면 팝업만 표시
    if (
        !isAuthenticated ||
        (isAuthenticated && !UserStore.isLoading && !UserStore.isEmpty() && !UserStore.isVerified)
    ) {
        return (
            <>
                <PageLayout mobileSimple={true}>
                    <PostPageLayout>
                        <div className="w-full flex justify-center">
                            <div className="flex flex-col items-center justify-center h-64">
                                <span className="text-med-16 text-gray-70">
                                    {/* {!isAuthenticated ? '로그인이 필요합니다.' : '학교 인증이 필요합니다.'} */}
                                </span>
                            </div>
                        </div>
                    </PostPageLayout>
                </PageLayout>

                {/* 로그인/인증 필요 팝업 */}
                <VerificationRequiredPopup
                    onClick={
                        !isAuthenticated
                            ? () => router.push('/user/sign-in')
                            : () => router.back()
                    }
                    isOpen={showVerificationPopup}
                    onClose={() => setShowVerificationPopup(false)}
                    title={!isAuthenticated ? '로그인 필요' : '학교 인증 필요'}
                    description={
                        !isAuthenticated
                            ? '게시글 작성을 위해서는 로그인이 필요합니다.'
                            : '게시글 작성을 위해서는 학교 인증이 필요합니다.'
                    }
                    actionText={!isAuthenticated ? '로그인하기' : '뒤로 가기'}
                />
            </>
        );
    }

    return isMobile ? (
        <PageLayout mobileSimple={true}>
            <PostPageLayout>
                <div className="w-full flex flex-col px-5 py-6">
                    <PostEditor initialCategory={categoryUuid || undefined} />
                </div>
            </PostPageLayout>
            <BottomTab mobileSimple={true} />
        </PageLayout>
    ) : (
        <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
            <GlobalHeader/>
            <PostPageLayout>
                <div className="w-full flex flex-row gap-x-[60px] justify-center">
                    <div className="flex flex-col w-full pt-5 pl-5">
                        <PostEditor initialCategory={categoryUuid || undefined} />
                    </div>

                    <div className="max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]">
                        <SideSection categoryUuid={''} />
                    </div>
                </div>
            </PostPageLayout>
            <Footer/>
        </div>
    );

};

export default observer(PostEditPage);