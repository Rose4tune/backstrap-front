import clsx from 'clsx';
import { useRouter } from 'next/router';

import { SocialProvider, useMeQuery } from '@generated/graphql';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';

import useAuthPersistence from '@hooks/useAuthPersistence.hook';

import PageLayout, { PageLayoutProps } from './PageLayout';
import { COOKIE_NS, COOKIE_NS_KAKAO_OAUTH } from '@constants/common/cookie.constant';
import { useCookies } from 'react-cookie';
import { clearTimeTableCache } from '@utils/bagstrap/cacheStorage/cache';
import { useStore } from '@stores/useStore.hook';

const MY_PAGE_SUBMENUS = [
  {
    label: '프로필',
    linkPath: '/my/profile'
  },
  {
    label: '비밀번호 변경',
    linkPath: '/my/password'
  }
];

export interface MyPageLayoutProps extends Omit<PageLayoutProps, 'authRequired'> {}

const MyPageLayout: React.FC<MyPageLayoutProps> = (props): JSX.Element => {
  const { children, ...pageLayoutProps } = props;
  const { MeStore } = useStore();

  const router = useRouter();

  const [cookie, setCookie] = useCookies();

  const [, , reset] = useAuthPersistence();

  const { data: meQueryData, loading: meQueryLoading, client } = useMeQuery();

  return (
    <PageLayout {...pageLayoutProps} authRequired loading={meQueryLoading}>
      {/* top */}
      <div
        className={clsx('flex justify-between gap-2', 'px-4 py-4', 'lg:py-9', 'xl:px-0')}
      >
        {/* greeting */}
        <p
          className={clsx(
            'flex-1',
            'font-light typo-body2 leading-tight break-all',
            'lg:font-extralight lg:typo-header1'
          )}
        >
          {meQueryData?.me.name}님,
          <br />
          <span>안녕하세요</span>
        </p>

        {/* logout */}
        <BaseButton
          className={clsx(
            'border border-grey3 rounded-[10px]',
            'h-7 px-4 mt-0.5',
            'text-grey3 typo-body8 font-medium',
            'lg:h-8 lg:typo-body6 lg:mt-0'
          )}
          onClick={() => {
            if (Kakao && cookie[COOKIE_NS_KAKAO_OAUTH]) {
              Kakao.Auth.logout();
            }
            clearTimeTableCache();
            client.resetStore().then(_ => {
              reset();
              MeStore.reset();
              router.push('/');
            });
          }}
        >
          로그아웃
        </BaseButton>
      </div>

      {/* tabs */}
      <section className={clsx('flex border-b border-grey2 px-4', 'xl:px-0')}>
        {meQueryData &&
          MY_PAGE_SUBMENUS.slice(
            0,
            meQueryData.me.provider === SocialProvider.App ? 2 : 1
          ).map(({ label, linkPath }, index) => (
            <BaseLink
              key={index}
              href={linkPath}
              className={clsx(
                'flex justify-center h-9 px-5 border-b-[5px] typo-body5 font-bold',
                'lg:typo-body3 lg:h-11',
                router.pathname === linkPath
                  ? 'border-primary text-black'
                  : 'border-transparent text-grey4'
              )}
            >
              {label}
            </BaseLink>
          ))}
      </section>

      {/* body */}
      <section>{children}</section>
    </PageLayout>
  );
};

export default MyPageLayout;
