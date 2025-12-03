import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import PageLayout from "@layouts/PageLayout";
import PostPageLayout from "@layouts/PostPageLayout";
import Post from '../../../src/components/community/post/Post';
import SideSection from './SideSection';
import getBoard from '../../../src/apis/community/getBoard';
import { components } from '../../../src/types/api';
import {
    COOKIE_NS,
    COOKIE_NS_APPLE_OAUTH,
    COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';
import { Best, Recent, Similar } from 'src/components/community';
import { useSearchParam } from 'react-use';
import { useMediaQuery } from '@mui/material';
import Notice from 'src/components/community/box/Notice';
import Popular from 'src/components/community/box/Popular';
import TopReviewCount from 'src/components/community/box/TopReviewCount';
import { Category } from 'src/components/community/box/Category';
import Post404 from '../../../src/components/error/Post404';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

type BoardEntityView = components['schemas']['BoardEntityView'];

const PostPage = () => {
    const isMobile = useMediaQuery('(max-width:550px)');
    const router = useRouter();
    const { boardUuid } = router.query;
    const source = useSearchParam('source');
    const [boardData, setBoardData] = useState<BoardEntityView | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [cookies] = useCookies();

    // 액세스 토큰 추출
    const accessToken =
        cookies[COOKIE_NS]?.authPayload?.access_token ||
        cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
        cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

    // console.log(source);

    // boardUuid가 변경될 때 데이터 초기화
    useEffect(() => {
        setBoardData(null);
        setError(null);
        setRefreshTrigger(0);
    }, [boardUuid]);

    // 데이터 로딩 - boardUuid나 refreshTrigger가 변경될 때만 실행
    useEffect(() => {
        if (!router.isReady || !boardUuid || typeof boardUuid !== 'string') {
            return;
        }

        const loadBoardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getBoard({ uuid: boardUuid }, accessToken);

                if (response.success && response.data) {
                    setBoardData(response.data);
                    setError(null);
                } else {
                    setError(response.messages || '게시글을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Failed to load board data:', error);
                setError('게시글을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadBoardData();
    }, [router.isReady, boardUuid, refreshTrigger, accessToken]);

    // 새로고침 핸들러
    const handleRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // 로딩 상태 (라우터 준비 중 또는 데이터 로딩 중)
    // if (!router.isReady || !boardUuid || typeof boardUuid !== 'string' || isLoading) {
    //     return (
    //         <PageLayout>
    //             <PostPageLayout>
    //                 <div className="flex justify-center items-center py-8">
    //                     <img src="/assets/loading.gif" alt="로딩" className="w-8 h-8" />
    //                 </div>
    //             </PostPageLayout>
    //         </PageLayout>
    //     );
    // }

    // 에러 상태 처리
    if (error) {
        // 404/410 에러 (게시글이 없거나 삭제된 경우)
        if (error === '게시글을 찾을 수 없습니다.' || error === '삭제된 게시글입니다.') {
            return (
                <PageLayout>
                    <PostPageLayout>
                        <Post404 />
                    </PostPageLayout>
                </PageLayout>
            );
        }

        // 기타 에러
        return (
            <PageLayout>
                <PostPageLayout>
                    <div className="flex flex-col justify-center items-center p-8">
                        <div className="text-red-500 text-center mb-4">
                            <span className="text-2xl mb-2 block">⚠️</span>
                            <span className="text-med-16">{error}</span>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </PostPageLayout>
            </PageLayout>
        );
    }
    if (!boardData) return (<></>)
    // 메인 컨텐츠 렌더링 (boardData가 있는 경우)
    if (!boardData) return <></>;

    // 메인 컨텐츠 렌더링 (boardData가 있는 경우)
    return isMobile ? (
        <PageLayout mobileTab={false}>
                <div className="w-full flex flex-col px-5 py-6 gap-y-4">
                    <Post
                        boardData={boardData}
                        accessToken={accessToken}
                        onRefresh={handleRefresh}
                    />
                </div>
        </PageLayout>
    ) : (
        <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
            <GlobalHeader />
            <PostPageLayout>
                <div className="w-full flex flex-row gap-x-[60px] justify-center min-w-[728px]">
                    {/* 왼쪽: 본문 + 추천 섹션들 */}
                    <div className="flex flex-col w-full pt-5 pl-5 min-w-[404px] gap-y-4">
                        <Post
                            boardData={boardData}
                            accessToken={accessToken}
                            onRefresh={handleRefresh}
                        />

                        <div className="flex flex-wrap flex-row gap-y-6 py-5 w-full min-w-[722px]">
                            <div className="w-full min-w-[360px]">
                                <Similar
                                    boardUuid={(boardUuid as string) || ''}
                                    categoryUuid={source || ''}
                                    title="유사한 끈 추천"
                                />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <Best />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <Notice title="끈지기 공지" uuid="qohnwionlr" />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <Popular title="가장 핫한 인기글" />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <TopReviewCount title="최근 댓글이 많이 달린 글" />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <Recent simple={true} />
                            </div>
                            <div className="w-1/2 min-w-[360px]">
                                <Category uuid="iqdnddonoj" title="자유게시끈" />
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 사이드 섹션 */}
                    <div className="max-w-[260px] w-full lg:max-w-[280px] 4xl:max-w-[356px]">
                        <SideSection categoryUuid={boardData?.category?.uuid || null} />
                    </div>
                </div>
            </PostPageLayout>
            <Footer />
        </div>
    );

};

export default PostPage;