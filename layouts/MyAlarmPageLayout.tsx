import clsx from 'clsx';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';

import { useStore } from '@stores/useStore.hook';

import {
  useNewAlarmCountQuery,
  useReadAllUserNotificationMutation,
  UserNotificationsDocument,
  NewAlarmCountQuery
} from '@generated/graphql';

import AllCheckedIcon from '@public/icons/[alarm]all-checked.svg';
import MessageIcon from '@public/icons/[alarm]message.svg';
import MessageWithBadgeIcon from '@public/icons/[alarm]message_badge.svg';
import NotificationIcon from '@public/icons/[alarm]notification.svg';
import NotificationWidthBadgeIcon from '@public/icons/[alarm]notification_badge.svg';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';

import PageLayout, { PageLayoutProps } from './PageLayout';

const MY_ALARM_PAGE_SUBMENUS: {
  label: string;
  icon: React.ReactNode;
  iconWithBadge: React.ReactNode;
  linkPath: string;
  queryKey: keyof NewAlarmCountQuery;
}[] = [
  {
    label: '소식',
    icon: <NotificationIcon />,
    iconWithBadge: <NotificationWidthBadgeIcon />,
    linkPath: '/my/alarm/notification',
    queryKey: 'userNotificationCount'
  },
  {
    label: '쪽지',
    icon: <MessageIcon />,
    iconWithBadge: <MessageWithBadgeIcon />,
    linkPath: '/my/alarm/message',
    queryKey: 'unreadMessageCount'
  }
];

export interface MyAlarmPageLayoutProps extends PageLayoutProps {}

const MyAlarmPageLayout: React.FC<MyAlarmPageLayoutProps> = (props): JSX.Element => {
  const { children, ...pageLayoutProps } = props;

  const router = useRouter();
  const { MeStore } = useStore();

  const newAlarmQueryResult = useNewAlarmCountQuery({
    fetchPolicy: 'cache-and-network'
  });

  const [readAllUserNotification] = useReadAllUserNotificationMutation();

  const onReadAllUserNotification = useCallback(() => {
    readAllUserNotification({
      onCompleted: ({ readAllUserNotification }) => {
        if (readAllUserNotification) {
          newAlarmQueryResult.refetch();
          MeStore.refetch();
        }
      },
      refetchQueries: [
        {
          query: UserNotificationsDocument,
          variables: {
            input: {
              userUuid: MeStore.getUUID(),
              paginationRequestDto: {
                count: 10
              }
            }
          }
        }
      ]
    });
  }, [readAllUserNotification, newAlarmQueryResult, MeStore.me]);

  return (
    <PageLayout {...pageLayoutProps} authRequired>
      {/* top */}

      <div className="flex-between gap-2.5 px-4 h-[46px] md:h-[70px] bg-primary-light bg-opacity-40">
        {newAlarmQueryResult.data && (
          <div className="flex items-center gap-2.5 leading-none">
            <div
              className={clsx(
                'rounded-full w-2.5 h-2.5',
                newAlarmQueryResult.data.userNotificationCount > 0
                  ? 'bg-primary'
                  : 'bg-grey4'
              )}
            />
            {newAlarmQueryResult.data.userNotificationCount > 0 ? (
              <p
                className={clsx(
                  'flex-1',
                  'font-bold text-black typo-body8',
                  'md:typo-body5'
                )}
              >
                읽지 않은 소식이{' '}
                <span className="underline">
                  {newAlarmQueryResult.data.userNotificationCount}건
                </span>{' '}
                있습니다.
              </p>
            ) : (
              <p
                className={clsx(
                  'flex-1',
                  'font-bold text-grey4 typo-body8',
                  'md:typo-body5'
                )}
              >
                새소식이 없습니다.
              </p>
            )}
          </div>
        )}

        {newAlarmQueryResult.data && !!MeStore.getUUID() && (
          <BaseButton
            disabled={newAlarmQueryResult.data.userNotificationCount === 0}
            onClick={onReadAllUserNotification}
            className={clsx(
              'h-8 px-3.5 border rounded-full gap-1 font-bold text-xs',
              newAlarmQueryResult.data.userNotificationCount > 0
                ? 'text-primary border-primary'
                : 'text-grey3 border-grey3'
            )}
          >
            <AllCheckedIcon />
            모든 소식 확인
          </BaseButton>
        )}
      </div>

      {/* tabs */}
      <section
        className={clsx('flex border-b border-grey2 px-3 mt-4', 'md:px-3.5 md:mt-6')}
      >
        {MY_ALARM_PAGE_SUBMENUS.map(
          ({ label, icon, iconWithBadge, linkPath, queryKey }, index) => (
            <BaseLink
              key={index}
              href={linkPath}
              className={clsx(
                'flex-center flex-col gap-[5px] w-20 pb-2 border-b-[5px]',
                'font-bold typo-body7',
                'md:typo-body3',
                router.pathname.startsWith(linkPath)
                  ? 'border-primary text-black'
                  : 'border-transparent text-grey4'
              )}
            >
              {newAlarmQueryResult.data?.[queryKey] > 0 ? iconWithBadge : icon}
              {label}
            </BaseLink>
          )
        )}
      </section>

      {/* body */}
      <section className="">{children}</section>
    </PageLayout>
  );
};

export default observer(MyAlarmPageLayout);
