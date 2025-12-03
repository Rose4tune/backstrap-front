import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import HomeIcon from '@assets/icons/bottom-tab/[renewal]BottomTabHomeIcon.svg';
import CommunityIcon from '@assets/icons/bottom-tab/[renewal]BottomTabCommunityIcon.svg';
import CareerIcon from '@assets/icons/bottom-tab/[renewal]BottomTabCareerIcon.svg';
import MentoringIcon from '@assets/icons/bottom-tab/[renewal]BottomTabMentoringIcon.svg';
import TimeTableIcon from '@assets/icons/bottom-tab/[renewal]BottomTabTimeTable.svg';
import Logo from '@assets/icons/header/logo-simple.svg';
import SearchIcon from '@assets/icons/header/search.svg';
import BellIcon from '@assets/icons/header/bell.svg';
import PersonIcon from '@assets/icons/header/person.svg';
import DropdownArrowIcon from '@assets/icons/community/chevron-left.svg';
import Link from 'next/link';
import PostEditPopup from '../community/PostEditPopup';
import { components } from 'src/types/api';
import { formatSemesterLabel } from 'src/utils/timetable/formatSemesterLabel';
import PlusIcon from "@assets/icons/common/PlusIcon.svg"
import SettingIcon from "@assets/icons/common/SettingIcon.svg"
import DrawerIcon from "@assets/icons/common/DrawerIcon.svg"

export type BottomTabVariant = 'home' | 'my/timetable' | 'community' | 'careers' | 'mentoring';
type TimeTableTemplate = components["schemas"]["TimeTableTemplate"];
type TimeTableEntityView = components['schemas']['TimeTableEntityView']

interface BottomTabProps {
  onTabChange?: (tab: BottomTabVariant) => void;
  className?: string;
  mobileSimple?: boolean;
  postEditPopup?: boolean;
}

interface TabItem {
  key: BottomTabVariant;
  icon: ReactElement;
  label: string;
  href: string;
}

export default function BottomTab({
  onTabChange,
  className = '',
  mobileSimple = false,
  postEditPopup = false,
}: BottomTabProps) {
  const router = useRouter();

  const TAB_ITEMS: TabItem[] = [
    {
      key: 'home',
      icon: <HomeIcon />,
      label: '홈',
      href: '/'
    },
    {
      key: 'my/timetable',
      icon: <TimeTableIcon />,
      label: '시간표',
      href: '/my/timetable'
    },
    {
      key: 'community',
      icon: <CommunityIcon />,
      label: '게시판',
      href: '/community'
    },
    {
      key: 'careers',
      icon: <CareerIcon />,
      label: '채용',
      href: '/careers'
    },
    {
      key: 'mentoring',
      icon: <MentoringIcon />,
      label: '멘토링',
      href: '/mentoring'
    }
  ];

  // 현재 경로를 기반으로 activeTab 자동 판단
  const getCurrentActiveTab = (): { path: BottomTabVariant, label?: string } => {

    const currentPath = router.asPath;

    // 정확한 경로 매칭
    if (currentPath === '/') return { path: 'home' };
    if (currentPath.startsWith('/my/timetable')) return { path: 'my/timetable', label: '시간표' };
    if (currentPath.startsWith('/community')) return { path: 'community', label: '커뮤니티' };
    if (currentPath.startsWith('/careers')) return { path: 'careers', label: '채용' };
    if (currentPath.startsWith('/mentoring')) return { path: 'mentoring', label: '멘토링' };

    // 기본값
    return { path: 'home' };
  };

  const currentActiveTab = getCurrentActiveTab();

  const handleTabClick = (tab: TabItem) => {
    // Call custom callback if provided
    if (onTabChange) {
      onTabChange(tab.key);
    }

    // Navigate to the route
    router.push(tab.href);
  };

  return (
    <>
      <nav
        className={`
          flex flex-col-reverse fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-30 w-full p-5
        `}
      >
        <div className="flex flex-row items-center justify-between">
          {mobileSimple ? (
            <DropdownArrowIcon onClick={() => router.back()} className="w-5 h-5 rotate-180 text-gray-50" />
          ) : currentActiveTab.path === 'home' ? <Logo /> : <div className='text-bold-16'>{currentActiveTab.label}</div>}

          <div className='flex fex-row gap-x-5'>
            <Link href={'/search'}>
              <SearchIcon className='w-6 h-6' />
            </Link>
            <Link href={'/my/alarm/notification/'}>
              <BellIcon className='w-6 h-6' />
            </Link>
            <Link href={'/my/profile'}>
              <PersonIcon className='w-6 h-6' />
            </Link>
          </div>
        </div>
      </nav >
      <nav
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] w-full
          ${className}
        `}
      >
        {postEditPopup &&
          <PostEditPopup />
        }
        {!mobileSimple && (
          <div className="flex flex-row items-center justify-between pb-8 pt-4 px-7">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentActiveTab.path === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className="flex flex-col gap-1 items-center justify-center p-0 w-9 transition-colors duration-200"
                  aria-label={tab.label}
                >
                  {/* Icon */}
                  <div className="relative w-6 h-6">
                    <div
                      className={`w-full h-full transition-colors duration-200 ${isActive ? 'text-gray-90' : 'text-gray-50'
                        }`}
                    >
                      {Icon}
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      text-semibold-12 transition-colors duration-200 whitespace-nowrap
                      ${isActive ? 'text-gray-90' : 'text-gray-50'}
                    `}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}