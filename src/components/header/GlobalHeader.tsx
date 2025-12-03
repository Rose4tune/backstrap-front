import { observer } from "mobx-react";
import SearchBar from "./SearchBar";
import Image from 'next/image'
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import LogoNew from '@assets/images/header/logo.png';
import useRequireAuth from "src/hooks/useRequireAuth";
import { useNewAlarmCountQuery } from '@generated/graphql';
import AlarmWidthBadgeIcon from '@assets/icons/header/bell.svg';
import AlarmIcon from '@assets/icons/header/bell.svg';
import MessageIcon from '@assets/icons/header/arrow.svg';
import ProfileEmptyIcon from '@assets/icons/header/person.svg';
import CategoryIcon from '@assets/icons/header/hamburger.svg';
import BaseLink from "@common/BaseLink";
import { useStore } from "@stores/useStore.hook";
import NotificationList from "../notification/NotificationList";
import Link from "next/link";
import SparkIcon from '@assets/icons/header/spark.svg';
import { components } from "src/types/api";
import { CommunityNavigator } from "../community";
import MessageList from "../alarm/message/MessageList";
import MessageSend from "../alarm/message/MessageSend";

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


function GlobalHeader({
    categories,
    onCategoriesChange,
    showBottom = true
}: NavigationHeaderProps) {
    const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
    const toggleCommunityDropdown = useCallback(() => {
        setIsCommunityDropdownOpen(prev => !prev);
    }, [isCommunityDropdownOpen]);

    const router = useRouter()
    const { UserStore, HeaderStore } = useStore();
    const notificationRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useRequireAuth();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const newAlarmQueryResult = useNewAlarmCountQuery({
        skip: !isAuthenticated
    });


    const toggleNotification = useCallback(() => {
        HeaderStore.setIsMessageOpen(false)
        setIsNotificationOpen(prev => !prev);
    }, []);

    const toggleMessage = useCallback(() => {
        setIsNotificationOpen(false);
        if (HeaderStore.isSendMessageOpen) {
            HeaderStore.setIsSendMessageOpen(false)
        }
        HeaderStore.setIsMessageOpen(!HeaderStore.isMessageOpen);
    }, [HeaderStore]);


    const onClickMainLogo = useCallback(() => {
        if (router.pathname === '/') {
            router.reload();
        } else {
            router.push('/');
        }
    }, [router]);

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
                    className="flex items-center gap-1 4xl:text-bold-20 text-bold-20 transition-colors w-6 h-6"
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
        <div className="w-full max-w-[1920px] px-20 pt-[0.75rem] mb-3 mx-auto">
            {/* Top Header */}
            <div className="w-full flex items-center justify-between">
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
                                            <MessageIcon onClick={toggleMessage} className='w-7 h-7' />
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
                                        {/* 메시지 드롭다운 */}
                                        <div
                                            className={`absolute top-[50px] right-0 bg-white rounded-2xl shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] w-[400px] min-h-[400px] max-h-[624px] z-50 transition-all duration-300 ease-in-out transform origin-top overflow-hidden ${HeaderStore.isMessageOpen
                                                ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                                                }`}
                                        >
                                            <div className="h-full max-h-[692px]">
                                                <div className="p-3">
                                                    <MessageList />
                                                </div>
                                            </div>
                                        </div>
                                        {/* 메시지 보내기 드롭다운 */}
                                        <div
                                            className={`absolute z-[500] top-[50px] right-0 bg-white rounded-2xl shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] w-[400px] min-h-[400px] max-h-[624px] z-50 transition-all duration-300 ease-in-out transform origin-top overflow-hidden ${HeaderStore.isSendMessageOpen
                                                ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                                                }`}
                                        >
                                            <div className="h-full max-h-[692px]">
                                                <div className="p-3">
                                                    <MessageSend />
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
            {/* Bottom Navigation */}
            {showBottom && (
                <div className="w-full flex items-center justify-between mb-1 mt-6">
                    <div className="flex items-center gap-1">
                        <CommunityDropdown />
                        <div className='flex items-center gap-6'>

                            {tabs.map((tab) => {
                                // 현재 페이지와 탭의 경로 비교
                                const cleanPath = router.asPath.split('?')[0]; // 쿼리 제거
                                const isActive =
                                    cleanPath === tab.href || cleanPath.startsWith(`${tab.href}/`);

                                return (
                                    <Link
                                        key={tab.key}
                                        href={tab.href || '#'}
                                        className="flex items-center gap-1 text-bold-20 transition-colors group"
                                        style={{
                                            color: tab.isSpecial
                                                ? '#22C6BB' // 가방끈 커리어는 항상 초록색
                                                : isActive
                                                    ? '#22C6BB' // 현재 경로일 경우 초록색
                                                    : '#464d57' // 기본 색상
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#2DDACE';
                                            if (tab.isSpecial) {
                                                const sparkIcon = e.currentTarget.querySelector('span');
                                                if (sparkIcon) {
                                                    sparkIcon.style.animation = 'sparkle 0.5s ease-in-out infinite';
                                                }
                                            }
                                            if (tab.hasNew) {
                                                const newBadge = e.currentTarget.querySelector('div');
                                                if (newBadge) {
                                                    newBadge.style.animation = 'sparkle 0.5s ease-in-out infinite';
                                                }
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = tab.isSpecial
                                                ? '#22C6BB'
                                                : isActive
                                                    ? '#22C6BB'
                                                    : '#464d57';

                                            const sparkIcon = e.currentTarget.querySelector('span');
                                            if (sparkIcon) sparkIcon.style.animation = 'none';
                                            const newBadge = e.currentTarget.querySelector('div');
                                            if (newBadge) newBadge.style.animation = 'none';
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
            )

            }
            <div className="max-w-[1920px] min-w-[1440px]">
                {
                    isCommunityDropdownOpen && <CommunityNavigator
                        isOpen={isCommunityDropdownOpen}
                        onToggle={toggleCommunityDropdown}
                        categories={categories}
                        onCategoriesChange={onCategoriesChange}
                    />
                }
            </div>

        </div>
    )
}

export default observer(GlobalHeader)
