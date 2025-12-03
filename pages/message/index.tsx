import React, { useEffect } from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react';

import PageLayout from '@layouts/PageLayout';
import { useStore } from '@stores/useStore.hook';
import { LoadingState } from '@stores/user.store';

const MessagePage: React.FC = () => {
  const { UserStore } = useStore();

  // Auto-fetch user data on mount
  useEffect(() => {
    if (UserStore.isEmpty() && UserStore.loadingState === LoadingState.IDLE) {
      UserStore.fetchUser();
    }
  }, [UserStore]);

  // Show loading while fetching user data
  if (UserStore.isLoading) {
    return (
      <PageLayout loading={true}>
        <Head>
          <title>메시지 - 백스트랩</title>
          <meta name="description" content="백스트랩 메시지함에서 다른 사용자들과 소통하세요." />
        </Head>
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-[#c9ced8]">사용자 정보를 불러오는 중...</div>
        </div>
      </PageLayout>
    );
  }

  // Show error if user fetch failed
  if (UserStore.hasError) {
    return (
      <PageLayout>
        <Head>
          <title>메시지 - 백스트랩</title>
        </Head>
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[#c9ced8] mb-4">사용자 정보를 불러올 수 없습니다</div>
            <button
              onClick={() => UserStore.fetchUser(true)}
              className="px-4 py-2 bg-[#10e4d5] text-white rounded-lg hover:bg-[#0ec5b4] transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show authentication required if not authenticated
  if (!UserStore.isAuthenticated) {
    return (
      <PageLayout authRequired={true}>
        <Head>
          <title>메시지 - 백스트랩</title>
        </Head>
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-[#c9ced8]">로그인이 필요합니다</div>
        </div>
      </PageLayout>
    );
  }

  // Main content - show message list
  return (
    <PageLayout authRequired={true}>
      <Head>
        <title>메시지 - 백스트랩</title>
        <meta name="description" content="백스트랩 메시지함에서 다른 사용자들과 소통하세요." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#464d57] mb-2">메시지</h1>
          <p className="text-[#a7adb6]">
            안녕하세요, {UserStore.displayName}님! 받은 메시지를 확인해보세요.
          </p>
        </div>

        <div className="flex justify-center">
          {/* <MessageList
            userUuid={UserStore.user.uuid}
            accessToken={UserStore.accessToken}
            className="w-full max-w-md"
          /> */}
        </div>
      </div>
    </PageLayout>
  );
};

export default observer(MessagePage);