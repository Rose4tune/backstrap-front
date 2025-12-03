import React, { useState } from 'react';
import { observer } from 'mobx-react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import MobileAlarmHeader from 'src/components/alarm/MobileAlarmHeader';
import MobileAlarmNavigator from 'src/components/alarm/MobileAlarmNavigator';
import MobileAlarmMessageList from 'src/components/alarm/MobileAlarmMessageList';
import { getAccessTokenFromCookies } from '@pages/index';
import getUnreadMessageCount from '@api/user-message/getUnreadMessageCount';
import getUserNotificationCount from '@api/user-notification/getUserNotificationCount';
import getMessageUnreadCount from '@api/user-message-room/getMessageUnReadCount';
import { useStore } from '@stores/useStore.hook';

interface SsrProps {
  messageCount: number;
  alarmCount: number;
}

const MyAlarmMessageIndexPage: NextPage<SsrProps> = ({ messageCount, alarmCount }) => {
  const isMobile = useMediaQuery('(max-width:550px)');

  return (
    isMobile ? (
      <div className="bg-white min-h-screen">
        <MobileAlarmHeader isNotiPage={false} />
        <MobileAlarmNavigator alarmCount={alarmCount} messageCount={messageCount} />
        <MobileAlarmMessageList />
      </div>
    ) : (
      <></>
    )
  );
};

export default observer(MyAlarmMessageIndexPage);

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
