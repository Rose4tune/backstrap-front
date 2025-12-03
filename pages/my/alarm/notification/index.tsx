import React from 'react';
import { observer } from 'mobx-react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import MobileAlarmHeader from 'src/components/alarm/MobileAlarmHeader';
import MobileAlarmNavigator from 'src/components/alarm/MobileAlarmNavigator';
import { getAccessTokenFromCookies } from '@pages/index';
import getUserNotificationCount from '@api/user-notification/getUserNotificationCount';
import getMessageUnreadCount from '@api/user-message-room/getMessageUnReadCount';
import NotificationList from 'src/components/notification/NotificationList';
import { useStore } from '@stores/useStore.hook';
import MobileNoticeList from 'src/components/alarm/notice/MobileNoticeList';

interface SsrProps {
  messageCount: number;
  alarmCount: number;
}

const MyAlarmNotificationIndexPage: NextPage<SsrProps> = ({ alarmCount, messageCount }) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:550px)');
    const {UserStore} = useStore();
  const accessToken = UserStore.getAccessTokenFromCookies();
  const userUuid = UserStore.getMe().uuid;

  return (
    isMobile ? (
      <div className="bg-white min-h-screen">
        <MobileAlarmHeader isNotiPage={true} />
        <MobileAlarmNavigator alarmCount={alarmCount} messageCount={messageCount} />
        <MobileNoticeList accessToken={accessToken} userUuid={userUuid}/>
      </div>
    ) : (
      <></>
    )
  );
};

export default observer(MyAlarmNotificationIndexPage);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const accessToken = getAccessTokenFromCookies(context.req);
    if (!accessToken) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    const [messageCountRes, notificationCountRes] = await Promise.all([
      getMessageUnreadCount(accessToken),
      getUserNotificationCount(accessToken),
    ]);

    return {
      props: {
        messageCount: messageCountRes?.success ? messageCountRes.data : 0,
        alarmCount: notificationCountRes?.success ? notificationCountRes.data : 0,
      },
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return { props: { messageCount: 0, alarmCount: 0 } };
  }
}
