import { useStore } from "@stores/useStore.hook";
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import SchoolIcon from '@assets/icons/community/school.svg';
import EditIcon from '@assets/icons/community/profile-pencil.svg';
import HeartIcon from '@assets/icons/community/profile-heart.svg';
import CommentIcon from '@assets/icons/community/profile-comment.svg';
import BookmarkIcon from '@assets/icons/community/profile-scrap.svg';
import getUserCounts from "src/apis/community/getUserCounts";
import Link from "next/link";

interface ProfileBoxProps {
  className?: string;
  /** Custom handler for login button click. If not provided, redirects to /login */
  onLoginClick?: () => void;
}

export default observer(function ProfileBox({ className, onLoginClick }: ProfileBoxProps) {
  const { UserStore } = useStore();
  const [userCounts, setUserCounts] = useState({
    likeCount: 0,
    myPostCount: 0,
    myReviewPostCount: 0,
    scrapCount: 0
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  useEffect(() => {
    async function fetchUserCounts() {
      // Only fetch counts if user is authenticated
      if (!UserStore.isAuthenticated || !UserStore.accessToken) {
        return;
      }

      setIsLoadingCounts(true);
      try {
        const response = await getUserCounts(UserStore.accessToken);
        if (response.success && response.data) {
          setUserCounts({
            likeCount: response.data.likeCount || 0,
            myPostCount: response.data.myPostCount || 0,
            myReviewPostCount: response.data.myReviewPostCount || 0,
            scrapCount: response.data.scrapCount || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch user counts:', error);
      } finally {
        setIsLoadingCounts(false);
      }
    }

    // Ensure user data is loaded first
    UserStore.fetchUser();
    fetchUserCounts();
  }, [UserStore, UserStore.isAuthenticated, UserStore.accessToken]);

  const user = UserStore.getUser();

  // Use API data for statistics
  const stats = {
    posts: userCounts.myPostCount,
    comments: userCounts.myReviewPostCount,
    likes: userCounts.likeCount,
    scraps: userCounts.scrapCount
  };

  const menuItems = [
    {
      icon: <EditIcon className="w-6 h-6 text-gray-70" />,
      label: "내가 쓴",
      count: stats.posts,
      href: '/my/board/written'
    },
    {
        icon: <CommentIcon className="w-6 h-6 text-gray-70" />,
        label: "내 댓글",
        count: stats.comments,
        href: '/my/board/commented'
    },
    {
        icon: <HeartIcon className="w-6 h-6 text-gray-70" />,
        label: "좋아요",
        count: stats.likes,
        href: '/my/board/liked'
    },
    {
        icon: <BookmarkIcon className="w-6 h-6 text-gray-70" />,
        label: "스크랩",
        count: stats.scraps,
        href: '/my/board/scrapped'
    }
  ];

  const getDefaultProfileImage = () => {
    // Create a simple default profile image with initials
    const initials = UserStore.displayName.charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-gray-40 flex items-center justify-center">
        <span className="text-bold-14 text-gray-70">{initials}</span>
      </div>
    );
  };

  // Show unauthenticated state if user is not logged in
  if (!UserStore.isAuthenticated || UserStore.isEmpty()) {
    return (
      <div className={`bg-gray-20 rounded-2xl p-5 pb-5 ${className || ''}`}>
        <div className="flex flex-col gap-4">
          {/* Login Prompt Message */}
          <div className="text-left">
            <p className="text-semibold-16 text-gray-90 leading-6 mb-0">
              <span>로그인하면 </span>
              <span className="text-click">합격수기, 장학금 정보</span>
              <span> 등</span>
            </p>
            <p className="text-semibold-16 text-gray-90 leading-6">
              유용한 정보를 볼 수 있어요!
            </p>
          </div>

          {/* Login Button */}
          <button
            className="bg-normal hover:bg-hover active:bg-click transition-colors duration-200 rounded-2xl h-11 flex items-center justify-center"
            onClick={() => {
              if (onLoginClick) {
                onLoginClick();
              } else {
                // Default navigation to login page
                window.location.href = '/user/sign-in';
              }
            }}
          >
            <span className="text-semibold-16 text-white leading-6">
              로그인/회원가입 하기
            </span>
          </button>
        </div>

        {/* Loading State for login attempt */}
        {UserStore.isLoading && (
          <div className="absolute inset-0 bg-gray-20/50 rounded-2xl flex items-center justify-center">
            <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-20 rounded-2xl p-5 pb-6 ${className || ''}`}>
      {/* Profile Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          {UserStore.profileImageUrl ? (
            <img
              src={UserStore.profileImageUrl}
              alt={`${UserStore.displayName} profile`}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                // Fallback to default image on error
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            getDefaultProfileImage()
          )}

          {/* User Info */}
          <div className="flex flex-col">
            <div className="trucate text-bold-14 text-black leading-[18px] min-w-0">
              {UserStore.displayName}
            </div>
            <span className="trucate text-med-12 text-gray-60 leading-4">
              {user.realName || user.email}
            </span>
          </div>
        </div>

        {/* University Info */}
        <div className="flex items-center gap-1">
          <SchoolIcon className="w-4 h-4 text-gray-70" />
          <span className="truncate text-semibold-14 text-gray-70 leading-[18px]">
            {user.school?.name || '학교 정보 없음'}
          </span>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="flex flex-col gap-3">
        {menuItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-30 rounded-lg p-1 -mx-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-bold-12 2xl:text-semibold-14 text-gray-90 leading-[18px]">
                {item.label}
              </span>
            </div>
            <div className="flex items-center">
              {isLoadingCounts ? (
                <div className="w-3 h-3 border border-gray-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-med-12 2xl:text-med-14 text-gray-60 leading-4">
                  {item.count}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Link href="/community/edit" className="flex w-full bg-normal rounded-[16px] text-semibold-16 text-white py-3 justify-center mt-6">
          글쓰기
      </Link>

      {/* Loading State */}
      {UserStore.isLoading && (
        <div className="absolute inset-0 bg-gray-20/50 rounded-2xl flex items-center justify-center">
          <img src="/assets/loading.gif" alt="로딩" className="w-6 h-6" />
        </div>
      )}
    </div>
  );
});