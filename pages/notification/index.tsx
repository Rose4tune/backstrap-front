import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';
import NotificationList from 'src/components/notification/NotificationList';
import { LoadingState } from '@stores/user.store';

const NotificationPage: React.FC = () => {
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
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-[#c9ced8]">불러오는 중...</div>
      </div>
    );
  }

  // Show error if user fetch failed
  if (UserStore.hasError) {
    return (
      <div className="flex w-full h-full justify-center">
        <div className="text-center">
          <div className="text-[#c9ced8] mb-4">알림을 불러올 수 없습니다</div>
          <button
            onClick={() => UserStore.fetchUser(true)}
            className="px-4 py-2 bg-[#10e4d5] text-white rounded-lg hover:bg-[#0ec5b4] transition-colors"
          >
            에러
          </button>
        </div>
      </div>
    );
  }

  // Show authentication required if not authenticated
  if (!UserStore.isAuthenticated) {
    return (
      <div className="flex w-full h-full justify-center">
        <div className="text-[#c9ced8]">로그인이 필요합니다</div>
      </div>
    );
  }

  // Main content - show notification list
  return (
        <div className="flex w-full justify-center">
          <NotificationList
            userUuid={UserStore.getUserId()}
            accessToken={UserStore.accessToken}
            className="w-full max-w-md"
          />
        </div>
  );
};

export default observer(NotificationPage);