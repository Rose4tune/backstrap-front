import React, { useState, useEffect } from 'react';
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
import readAllUserNotification from '@api/user-notification/readAllUserNotification';

type UserNotificationViewDto = components['schemas']['UserNotificationViewDto'];
type UserNotificationPaginationResult = components['schemas']['UserNotificationPaginationResultDto'];

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

  const getSenderName = () => {
    return notification.notification?.sender?.name || '익명의 끈';
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
      <div className="flex items-center justify-between text-sm">
        <div className="font-semibold text-[#10e4d5]">
          {getNotificationType(notification.notification?.notificationType)}
        </div>
        <div className="text-[#c9ced8] font-normal">
          {formatDate(notification.createdDate)}
        </div>
      </div>

      {/* Content */}
      {hasAuthor() ? (
        // Comment/Reply format with author
        <div className="flex flex-row gap-1 items-start text-base font-semibold">
          <div className="text-[#c9ced8] flex-shrink-0">
            {commentContent[0]}
          </div>
          <div className="text-[#464d57] truncate">
            {commentContent[1]}
          </div>
        </div>
      ) : (
        // General notification format
        <div className="text-base font-semibold text-[#464d57] truncate">
          {getTitle()}
        </div>
      )}
      {/* Description */}
      {getContent() && (
        <div className="text-sm font-medium text-[#818791]">
          {getContent()}
        </div>
      )}
    </div>
  );
};

const NotificationList: React.FC<NotificationListProps> = ({
  className = '',
  userUuid,
  accessToken
}) => {
  const [notifications, setNotifications] = useState<UserNotificationViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  async function handleClick(uuid?:string, actionUrl?:string) {
    setRefetch(false);
    if(actionUrl) {
      if(window.self !== window.top) {
        window.parent.location.href = actionUrl;
      }
      else router.push(actionUrl);
    }
    const response = await editUserNotification(
      {
        uuid:uuid||'',
        isRead:true
      },
      accessToken
    );
    setRefetch(true);
  }

  async function handleAllClick() {
    setRefetch(false);
    const response = await readAllUserNotification(
      accessToken
    );
    setRefetch(true);
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userUuid || !accessToken) {
        setError('사용자 정보가 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await getUserNotificationsByPaging({
          count: 20,
          page: 0,
          // cursor는 페이징에서 사용될 때만 전달
        }, accessToken);

        if (response.success && response.data?.data) {
          const notificationData = response.data.data.filter(
            (notification): notification is UserNotificationViewDto => notification !== null
          );
          setNotifications(notificationData);
        } else {
          setError(response.messages || '알림을 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userUuid, accessToken, refetch]);

  if (error) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-[#c9ced8]">{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-[#c9ced8]">새로운 알림이 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <div className='sticky bg-white top-0 px-5 pb-5 flex justify-between items-end h-[68px] text-gray-90'>
        <span className='text-bold-20 leading-7'>알림</span>
        <span className='text-semibold-14 leading-7 cursor-pointer hover:text-hover transition-colors'
        onClick={handleAllClick}
        >모든 소식 확인</span>
      </div>
      <div className="flex flex-col w-full rounded-[12px] max-h-[432px] overflow-scroll">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.uuid || index}
            notification={notification}
            onClick={handleClick}
          />
        ))}
        {/* Scrollbar */}
      </div>
    </>
  );
};

export default NotificationList;

const resolveLinkPath = (actionUrl: string, meStore?: UserStore): string | undefined => {
  const parsed = actionUrl
    ? qs.parse(actionUrl.substring(actionUrl.indexOf("?") + 1))
    : undefined

  const linkUrl = parsed?.link as string | undefined

  const linkPath = linkUrl && new URL(linkUrl).pathname

  const linkParam = linkUrl?.split("?")?.[1]

  const uuid = linkParam && (qs.parse(linkParam)?.uuid as string | undefined)

  if (linkPath === LINK_PATH_BOARD_DETAIL && uuid) {
    return `/community/post/${uuid}`
  }

  if (linkPath === LINK_PATH_SCHOOL_VERIFY) {
    // console.log(meStore)
    if (meStore && !meStore?.isEmpty()) {
      if (!meStore.isVerified) {
        if (meStore.getMe().studentType === 'POSTGRAD') {
          return `/user/cert/postgraduate`
        } else if (meStore.getMe().studentType === 'UNDERGRADUATE') {
          return `/user/cert/undergraduate`
        }
      } else {
        return `/my/profile`
      }
    } else {
      return '/user/sign-in'
    }
  }

  if (linkPath === LINK_PATH_TIMETABLE) {
    return "https://bagstrap.netlify.com/"
  }
}