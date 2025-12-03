import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { observer } from 'mobx-react';

import LogoNew from '@assets/images/header/logo.png';
import AlarmIcon from '@assets/icons/header/bell.svg';
import AlarmWidthBadgeIcon from '@assets/icons/header/bell.svg';
import ProfileEmptyIcon from '@assets/icons/header/person.svg';
import CategoryIcon from '@assets/icons/header/hamburger.svg';
import SparkIcon from '@assets/icons/header/spark.svg';
import MessageIcon from '@assets/icons/header/arrow.svg';

import { useNewAlarmCountQuery } from '@generated/graphql';
import { useStore } from '@stores/useStore.hook';
import useAuthPayload from '@hooks/useAuthPayload.hook';
import BaseLink from '@common/BaseLink';
import SearchBar from './SearchBar';
import { CommunityNavigator } from '../community';
import { components } from 'src/types/api';
import useRequireAuth from 'src/hooks/useRequireAuth';
import NotificationList from '../notification/NotificationList';

type Category = components['schemas']['FAGroupViewDto'];

interface NavigationHeaderProps {
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
  isSearchActivated?: boolean;
  searchKeyword?: string;
  onSearchToggle?: () => void;
  onSearchChange?: (value: string) => void;
  onSearchEnter?: () => void;
  onMobileMenuToggle?: () => void;
  categories?: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
  showBottom?: boolean;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  categories,
  onCategoriesChange,
  showBottom = true
}) => {
  const router = useRouter();
  const { UserStore } = useStore();
  const { isLoading, isAuthenticated } = useRequireAuth();
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const newAlarmQueryResult = useNewAlarmCountQuery({
    skip: !isAuthenticated
  });

  const onClickMainLogo = useCallback(() => {
    if (router.pathname === '/') {
      router.reload();
    } else {
      router.push('/');
    }
  }, [router]);

  const toggleCommunityDropdown = useCallback(() => {
    setIsCommunityDropdownOpen(prev => !prev);
  }, [isCommunityDropdownOpen]);

  const toggleNotification = useCallback(() => {
    setIsNotificationOpen(prev => !prev);
  }, []);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    setIsCommunityDropdownOpen(false);
  }, [])
  const tabs = [
    { key: 'community', label: '커뮤니티', href: '/community' },
    { key: 'grad-onboarding', label: '대학원온보딩', href: '/grad-onboarding' },
    { key: 'careers', label: '채용끈', href: '/careers' },
    // { key: 'research', label: '연구실' },
    { key: 'timetable', label: '시간표', href: '/my/timetable' },
    { key: 'mentoring', label: '멘토링', hasNew: true, href: '/mentoring' },
    { key: 'career', label: '가방끈 커리어', isSpecial: true, href: `https://career.bagstrap.team?token=${UserStore.accessToken}` }
  ];

  const CommunityDropdown = () => {
    return (
      <div className="relative bg-transparent">
        <button
          onClick={toggleCommunityDropdown}
          className="flex items-center gap-1 4xl:text-bold-20 text-bold-16 transition-colors w-6 h-6"
          style={{
            color: isCommunityDropdownOpen ? '#2DDACE' : '#464d57'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2DDACE';
          }}
          onMouseLeave={(e) => {
            const color = isCommunityDropdownOpen ? '#2DDACE' : '#464d57';
            e.currentTarget.style.color = color;
          }}
        >
          <CategoryIcon className={`w-6 h-6 ${isCommunityDropdownOpen ? '#2DDACE' : 'text-gray-90'}`} />
        </button>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: scaleY(0) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
        }
        @keyframes slideUp {
          0% {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scaleY(0) translateY(-10px);
          }
        }
        .notification-enter {
          animation: slideDown 0.3s ease-out forwards;
        }
        .notification-exit {
          animation: slideUp 0.3s ease-in forwards;
        }
      `}</style>
      <div className="sticky top-0 left-0 right-0 min-w-[720px] max-w-screen mx-auto w-full bg-white border-b border-gray-20 z-[50]">
        {/* Top Header */}
        <div className="py-3 px-20 mb-3">
          <div className="lg:max-w-[1920px] max-w-[1280px] mx-auto w-full flex items-center justify-between">
            {/* Search Mode (Mobile) */}
            {/* {isSearchActivated && (
            <div className="flex items-center justify-between gap-2 4xl:hidden">
              <BaseTextInput
                name="search"
                style={{width:372}}
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="�ɴ| �%X8�"
                className="flex-1"
                inputProps={{
                  className: 'px-2 h-12'
                }}
                onEnterPress={handleSearchEnter}
                autoFocus
              />
              <BaseButton onClick={handleSearchEnter} aria-label="search">
                <SearchIcon className="w-6 h-6" />
              </BaseButton>
            </div>
          )} */}

            {/* Normal Mode */}
            <>
              {/* Left Side */}
              <div className="flex items-center gap-6 min-w-0 relative">
                <div className="flex gap-2 cursor-pointer flex-shrink-0" onClick={onClickMainLogo}>
                  <Image src={LogoNew} alt="헤더 로고" width={152} height={43} />
                </div>
                <div className='flex w-[358px] min-w-0'>
                  <SearchBar />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Desktop Icons */}

                {/* {up1280 && ( */}
                {true && (
                  <>
                    {isAuthenticated ? (
                      <div className='flex items-center gap-6 flex-row flex-shrink-0 relative' ref={notificationRef}>
                        <button onClick={toggleNotification} aria-label="notification" className="relative">
                          {newAlarmQueryResult.data &&
                            (newAlarmQueryResult.data.userNotificationCount > 0 ||
                              newAlarmQueryResult.data.unreadMessageCount > 0) ? (
                            <AlarmWidthBadgeIcon className='w-7 h-7' />
                          ) : (
                            <AlarmIcon className='w-7 h-7' />
                          )}
                        </button>

                        <button aria-label="message" className="relative">
                          <MessageIcon onClick={() => router.push('/my/alarm/message')} className='w-7 h-7' />
                        </button>

                        <BaseLink href="/my/profile" aria-label="profile">
                          {UserStore.getUser().profileImage ? (
                            <Image
                              src={UserStore.getUser().profileImage!}
                              className="w-7 h-7 rounded-full"
                              alt="profile"
                              width={28}
                              height={28}
                            />
                          ) : (
                            <ProfileEmptyIcon className='w-7 h-7' />
                          )}
                        </BaseLink>

                        {/* 알림 드롭다운 */}
                        <div
                          className={`absolute top-[50px] right-0 bg-white rounded-2xl shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] w-[400px] min-h-[400px] max-h-[624px] z-50 transition-all duration-300 ease-in-out transform origin-top overflow-hidden ${isNotificationOpen
                            ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                            }`}
                        >
                          <div className="h-full max-h-[692px]">
                            <div className="p-3">
                              <NotificationList
                                userUuid={UserStore.getMe().uuid}
                                accessToken={UserStore.accessToken}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#a7adb6] text-[16px] font-medium">
                        <Link href="/user/sign-in" className="text-[#a7adb6] text-[16px] font-medium">
                          로그인
                        </Link>
                        {' '}/{' '}
                        <Link href="/user/sign-up" className="text-[#a7adb6] text-[16px] font-medium">
                          회원가입
                        </Link>
                      </div>
                    )}
                  </>
                )}
                {/* Mobile Menu Button */}
                {/* {!up1280 && (
                  <BaseButton onClick={onMobileMenuToggle} aria-label="menu">
                    <CategoryIcon className="w-6 h-6" />
                  </BaseButton>
                )} */}
              </div>
            </>
          </div>
        </div>

        {/* Bottom Navigation */}
        {showBottom && (
          <div className="pb-3 px-20">
            <div className="max-w-[1280px] lg:max-w-[1920px] mx-auto w-full flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CommunityDropdown />
                <div className='flex items-center gap-6'>

                  {tabs.map((tab) => {
                    const isActive =
                      router.asPath === tab.href || router.asPath.startsWith(`${tab.href}/`);

                    return (
                      <Link
                        key={tab.key}
                        href={tab.href || '#'}
                        className="flex items-center gap-1 4xl:text-bold-20 text-bold-20 transition-colors group"
                        style={{
                          color: tab.isSpecial
                            ? '#22C6BB' // 가방끈 커리어는 항상 초록색 유지
                            : isActive
                              ? '#22C6BB' // 현재 페이지면 초록색
                              : '#464d57' // 기본 색
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#2DDACE';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = tab.isSpecial
                            ? '#22C6BB'
                            : isActive
                              ? '#22C6BB'
                              : '#464d57';
                        }}
                      >
                        {tab.label}
                        {tab.hasNew && (
                          <div className="flex h-7 text-red text-[10px] align-top leading-tight">
                            NEW
                          </div>
                        )}
                        {tab.isSpecial && (
                          <span
                            onMouseEnter={(e) => {
                              e.currentTarget.style.animation = 'sparkle 0.5s ease-in-out infinite';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.animation = 'none';
                            }}
                            style={{ animation: 'none' }}
                          >
                            <SparkIcon />
                          </span>
                        )}
                      </Link>
                    );
                  })}

                </div>
              </div>
              <Link href="https://voracious-show-448.notion.site/1f581357f2f88058b0fbce88604c2a40" target='_blank'>
                <div className="flex bg-gray-30 px-3 py-2 rounded-lg h-[34px] justify-center text-bold-14 text-gray-90 font-bold items-center">
                  광고 문의
                </div>
              </Link>
            </div>
          </div>
        )}
        {
          isCommunityDropdownOpen && <CommunityNavigator
            isOpen={isCommunityDropdownOpen}
            onToggle={toggleCommunityDropdown}
            categories={categories}
            onCategoriesChange={onCategoriesChange}
          />
        }
      </div>
    </>
  );
};

export default observer(NavigationHeader);