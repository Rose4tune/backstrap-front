import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageLayout from "@layouts/PageLayout";
import PostPageLayout from "@layouts/PostPageLayout";
import { PostEditor } from 'src/components/community';
import { useMediaQuery } from '@mui/material';
import SideSection from '../post/SideSection';
import ErrorComponent from 'src/components/community/ErrorComponent';
import useRequireAuth from '../../../src/hooks/useRequireAuth';
import BottomTab from 'src/components/mobile/BottomTab';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const PostEditPage = () => {
    const router = useRouter();
    const { boardUuid } = router.query;
    const isMobile = useMediaQuery('(max-width:550px)');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoading: isAuthLoading, isAuthenticated } = useRequireAuth('/user/sign-in');

    useEffect(() => {
        // 라우터와 boardUuid가 준비되고 인증이 완료되면 로딩 상태 해제
        if (router.isReady && !isAuthLoading && isAuthenticated) {
            if (!boardUuid || typeof boardUuid !== 'string') {
                setError('잘못된 게시글 ID입니다.');
            } else {
                setError(null);
            }
            setIsLoading(false);
        }
    }, [router.isReady, boardUuid, isAuthLoading, isAuthenticated]);

    // 인증 확인 중이거나 로딩 중
    if (isAuthLoading || isLoading) {
        const loadingMessage = isAuthLoading ? '인증을 확인하는 중...' : '페이지를 불러오는 중...';
        return (
            <PageLayout mobileSimple={true}>
                <PostPageLayout>
                    <div className="w-full flex justify-center">
                        <div className="flex flex-col items-center justify-center h-64">
                            <img src="/assets/loading.gif" alt="로딩" className="w-8 h-8 mb-4" />
                            <span className="text-med-16 text-gray-70">{loadingMessage}</span>
                        </div>
                    </div>
                </PostPageLayout>
            </PageLayout>
        );
    }

    // Only render if authenticated
    if (!isAuthenticated) {
        return null;
    }

    // 에러 상태
    if (error) {
        return (
            <ErrorComponent error={error} />
        );
    }

    return isMobile ? (
        <PageLayout mobileSimple={true}>
                <div className="w-full flex flex-col px-5 py-6">
                    <PostEditor
                        mode="edit"
                        boardUuid={boardUuid as string}
                    />
                </div>
            <BottomTab mobileSimple={true} />
        </PageLayout>
    ) : (
        <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
            <GlobalHeader />
            <PostPageLayout>
                <div className="w-full flex flex-row gap-x-[60px] justify-center">
                    <div className="flex flex-col w-full pt-5 pl-5">
                        <PostEditor
                            mode="edit"
                            boardUuid={boardUuid as string}
                        />
                    </div>
                    <div className="max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]">
                        <SideSection categoryUuid={''} />
                    </div>
                </div>
            </PostPageLayout>
            <Footer />
        </div>
    );
};

export default PostEditPage;