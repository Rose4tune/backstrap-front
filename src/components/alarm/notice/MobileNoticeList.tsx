import React, { useState, useEffect, useRef, useCallback } from 'react';
import getUserNotificationsByPaging from 'src/apis/user-notification/getUserNotificationsByPaging';
import { components } from 'src/types/api';
import {
  LINK_PATH_BOARD_DETAIL,
  LINK_PATH_SCHOOL_VERIFY,
  LINK_PATH_TIMETABLE,
} from "@constants/bagstrap/etc/link.constant"
import qs from 'qs';
import UserStore from '@stores/user.store';
import { useRouter } from 'next/navigation';
import editUserNotification from '@api/user-notification/editUserNotification';
import { observer } from 'mobx-react';
import { useStore } from '@stores/useStore.hook';

type UserNotificationViewDto = components['schemas']['UserNotificationViewDto'];

interface NotificationListProps {
  className?: string;
  userUuid?: string;
  accessToken?: string;
}

interface NotificationItemProps {
  notification: UserNotificationViewDto;
  isHighlighted?: boolean;
  onClick?: (uuid?:string,actionUrl?:string)=>void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isHighlighted = false,
  onClick
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/,/g, '');
  };

  const getNotificationType = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      'BOARD_REVIEW': '댓글',
      'REVIEW_BOARD': '댓글',
      'REVIEW_REVIEW': '답글',
      'SCHOOL_NOTICE': '공지',
      'GENERAL': '알림',
      'USER_MESSAGE': '메시지',
      'BOARD_LIKE': '좋아요',
      'FOLLOW': '팔로우',
      'ALL': '전체',
      "APPROVE_SCHOOL_VERIFY":'학교인증',
    };
    return typeMap[type || ''] || '알림';
  };

  const getBackgroundColor = () => {
    if (isHighlighted || !notification.isRead) {
      return 'bg-[#ebfcfb]';
    }
    return 'bg-white';
  };

  const getTitle = () => {
    return notification.notification?.title || '새로운 알림이 있습니다';
  };

  const getContent = () => {
    if(hasAuthor()) return notification.notification?.title;
    else return notification.notification?.content || '';
  };


  const hasAuthor = () => {
    const type = notification.notification?.notificationType;
    return type === 'BOARD_REVIEW' || type === 'REVIEW_BOARD' || type === 'REVIEW_REVIEW';
  };
  const commentContent = notification.notification?.content?.split(":",2).map(s => s.trim()) || ['',''];
  return (
    <div onClick={()=>{
      if(notification.notification?.actionUrl) onClick?.(notification.uuid, resolveLinkPath(notification.notification.actionUrl));
      else onClick?.(notification.uuid);
      }} className={`${getBackgroundColor()} px-6 py-4 flex flex-col gap-1 cursor-pointer transition-colors ${isHighlighted ? 'rounded-t-xl' : ''}`}>
      {/* Header - Type and Date */}
      <div className="flex items-center justify-between">
        <div className="text-semibold-12 text-normal">
          {getNotificationType(notification.notification?.notificationType)}
        </div>
        <div className="text-reg-12 text-gray-50">
          {formatDate(notification.createdDate)}
        </div>
      </div>

      {/* Content */}
      {hasAuthor() ? (
        // Comment/Reply format with author
        <div className="flex flex-row gap-1 items-start text-semibold-14">
          <div className="text-normal flex-shrink-0">
            {commentContent[0]}
          </div>
          <div className="text-gray-50 truncate">
            {commentContent[1]}
          </div>
        </div>
      ) : (
        // General notification format
        <div className="text-semibold-14 text-gray-90 truncate">
          {getTitle()}
        </div>
      )}
      {/* Description */}
      {getContent() && (
        <div className="text-reg-12 text-gray-70">
          {getContent()}
        </div>
      )}
    </div>
  );
};

const PAGE_SIZE = 20;

interface NotificationListProps {
  className?: string;
  userUuid?: string;
  accessToken?: string;
}

interface NotificationItemProps {
  notification: UserNotificationViewDto;
  isHighlighted?: boolean;
  onClick?: (uuid?:string,actionUrl?:string)=>void;
}

// === NotificationItem는 네 코드 그대로 사용 ===

const MobileNoticeList: React.FC<NotificationListProps> = ({
  className = '',
  userUuid,
  accessToken
}) => {
  const router = useRouter();
  const {UserStore} = useStore();
  const accessTokens = accessToken || UserStore.getAccessTokenFromCookies();
  const userUuids = userUuid ||   UserStore.getMe().uuid;


// 리스트 & 페이징 상태
  const [notifications, setNotifications] = useState<UserNotificationViewDto[]>([]);
  const [loading, setLoading] = useState(false);            // 현재 fetch 중
  const [error, setError] = useState<string>('');           // 에러 메시지
  const [cursor, setCursor] = useState<string | null>(null);// 다음 페이지 커서
  const [hasMore, setHasMore] = useState(true);             // 더 불러올 수 있는지
  const [firstFetch, setFirstFetch] = useState(false);      // 첫 페이지 완료 여부
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 최초 로딩 상태


  // 무한스크롤 도우미
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const seen = useRef<Set<string>>(new Set());              // 중복 제거용
  const lastCursorRef = useRef<string | null>(null);        // 마지막 성공 커서
  const fetchingCursorRef = useRef<string | null>(null);    // 현재 요청 중 커서

  // 페이지 로더
  const fetchPage = useCallback(async (nextCursor: string | null) => {
    // if (!userUuids || !accessTokens) {
    //   setError('사용자 정보가 필요합니다.');
    //   return;
    // }
    if (loading) return;
    if (!hasMore && firstFetch) return;

    // 같은 커서로 중복 호출 방지
    const key = nextCursor ?? '__FIRST__';
    if (fetchingCursorRef.current === key) return;
    fetchingCursorRef.current = key;

    try {
      setLoading(true);
      setError('');

      const res = await getUserNotificationsByPaging(
        { count: PAGE_SIZE, cursor: nextCursor ?? undefined },
        accessTokens);

      if (!(res.success && res.data)) {
        setHasMore(false);
        setCursor(null);
        return;
      }

      const rows = (res.data.data || []).filter(Boolean) as UserNotificationViewDto[];
      const newCursor = res.data.cursor ?? null;

      // 0건이면 종료
      if (rows.length === 0) {
        setHasMore(false);
        setCursor(null);
        setFirstFetch(true);
        return;
      }

      // uuid 기준 중복 제거
      const picked: UserNotificationViewDto[] = [];
      for (const row of rows) {
        const id = row.uuid ?? `${row.notification?.uuid ?? ''}-${row.createdDate ?? ''}`;
        if (!seen.current.has(id)) {
          seen.current.add(id);
          picked.push(row);
        }
      }
      if (picked.length > 0) {
        setNotifications(prev => prev.concat(picked));
      }

      // 커서/hasMore 갱신 (같은 커서면 더 없음)
      if (newCursor === lastCursorRef.current || newCursor === nextCursor) {
        setHasMore(false);
        setCursor(null);
      } else {
        setCursor(newCursor);
        setHasMore(Boolean(newCursor));
        lastCursorRef.current = newCursor;
      }

      // (옵션) 개수 부족하면 종료
      if (rows.length < PAGE_SIZE) {
        setHasMore(false);
        setCursor(null);
      }

      setFirstFetch(true);
    } catch (e) {
      console.error(e);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      fetchingCursorRef.current = null;
    }
  }, [userUuid, accessToken, loading, hasMore, firstFetch]);

  useEffect(() => {
  setIsInitialLoading(true);     // 첫 진입 시 true로 설정
  fetchPage(null).finally(() => {
    setIsInitialLoading(false);  // 첫 페이지 fetch 끝나면 false
  });
}, []);

  // 인터섹션 옵저버: 바닥 보이면 다음 페이지 요청
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (ioRef.current) ioRef.current.disconnect();

    ioRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore && !isInitialLoading) {
          fetchPage(cursor); // **여기서 setCursor만 하지 말고 직접 호출**
        }
      },
      { root: null, rootMargin: '64px 0px', threshold: 0.25 }
    );

    ioRef.current.observe(sentinelRef.current);
    return () => ioRef.current?.disconnect();
  }, [cursor, loading, hasMore, fetchPage]);

  // 로딩 중엔 잠깐 observe 해제 → 연속 트리거 완화
  useEffect(() => {
    if (!ioRef.current || !sentinelRef.current) return;
    if (loading) ioRef.current.unobserve(sentinelRef.current);
    else ioRef.current.observe(sentinelRef.current);
  }, [loading]);

  // 클릭 시 읽음 처리(낙관적 업데이트) + 라우팅
  const handleClick = useCallback(async (uuid?: string, actionUrl?: string) => {
    if (uuid) {
      setNotifications(prev => prev.map(n => (n.uuid === uuid ? { ...n, isRead: true } : n)));
    }
    if (actionUrl) {
      if (window.self !== window.top) window.parent.location.href = actionUrl;
      else router.push(actionUrl);
    }
    try {
      if (uuid) await editUserNotification({ uuid, isRead: true }, accessToken);
    } catch (e) {
      console.warn('읽음 처리 실패(화면 유지):', e);
    }
  }, [router, accessToken]);

  // 렌더링
  if (error) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-[#c9ced8]">{error}</div>
      </div>
    );
  }

  if (!firstFetch && loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-[#c9ced8]">불러오는 중…</div>
      </div>
    );
  }

  if (firstFetch && notifications.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-[#c9ced8]">새로운 알림이 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-col w-full overflow-y-auto ${className}`}>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.uuid || index}
            notification={notification}
            onClick={handleClick}
          />
        ))}

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="py-4 text-center text-[#c9ced8]">불러오는 중…</div>
        )}

        {/* 센티널: 더 불러올 게 있을 때만 */}
        {hasMore && <div ref={sentinelRef} className="h-6" />}
      </div>
    </>
  );
};

export default observer(MobileNoticeList);

// ====== 네가 쓰던 resolveLinkPath 유틸 그대로 ======
const resolveLinkPath = (actionUrl: string, meStore?: UserStore): string | undefined => {
  const parsed = actionUrl
    ? qs.parse(actionUrl.substring(actionUrl.indexOf("?") + 1))
    : undefined;

  const linkUrl = parsed?.link as string | undefined;
  const linkPath = linkUrl && new URL(linkUrl).pathname;
  const linkParam = linkUrl?.split("?")?.[1];
  const uuid = linkParam && (qs.parse(linkParam)?.uuid as string | undefined);

  if (linkPath === LINK_PATH_BOARD_DETAIL && uuid) {
    return `/community/post/${uuid}`;
  }

  if (linkPath === LINK_PATH_SCHOOL_VERIFY) {
    if (meStore && !meStore?.isEmpty()) {
      if (!meStore.isVerified) {
        if (meStore.getMe().studentType === 'POSTGRAD') return `/user/cert/postgraduate`;
        else if (meStore.getMe().studentType === 'UNDERGRADUATE') return `/user/cert/undergraduate`;
      } else {
        return `/my/profile`;
      }
    } else {
      return '/user/sign-in';
    }
  }

  if (linkPath === LINK_PATH_TIMETABLE) {
    return "https://bagstrap.netlify.com/";
  }
};
