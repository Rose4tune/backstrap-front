import clsx from 'clsx';
import { useMemo, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { useStore } from '@stores/useStore.hook';
import {
  NoticeDocument,
  NoticeQuery,
  NoticeQueryResult,
  NoticeQueryVariables
} from '@generated/graphql';
import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';

import BoardPageLayout from '@layouts/BoardPageLayout';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import NoticeEntityMenu from '@common/bagstrap/etc/NoticeEntityMenu';
import BoardLoadingSurface from '@common/bagstrap/board/BoardLoadingSurface';
import ErrorMessage from '@common/bagstrap/etc/ErrorMessage';
import NoticeInfo from '@common/bagstrap/notice/NoticeInfo';
import BoardRecentSection from '@common/bagstrap/board/BoardRecentSection';
import AppLinkBannerSection from '@common/bagstrap/etc/AppLinkBannerSection';
import YoutubeChannelOverviewSection from '@common/bagstrap/etc/YoutubeChannelOverviewSection';

import { BoardType } from '@enums/board/board.enum';

import BoardIcon from '@public/icons/[board]board.svg';
import MenuIcon from '@public/icons/[board]menu.svg';

const Quill = dynamic(() => import('react-quill'), {
  ssr: false
});

export interface NoticeDetailPageProps {
  NoticeQueryResult: NoticeQueryResult;
}

const NoticeDetailPage: NextPage<NoticeDetailPageProps> = props => {
  const router = useRouter();
  const { MeStore } = useStore();

  const menuRef = useRef(null);

  const [noticeQueryResult, setNoticeQueryResult] = useState(props.NoticeQueryResult);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = useMemo(() => MeStore.isAdmin, [MeStore.isAdmin]);

  const uuid = useMemo(() => {
    const { uuid: _uuid } = router.query;

    return Array.isArray(_uuid) ? _uuid[0] : _uuid || '';
  }, [router.query.uuid]);

  return (
    <>
      <Head>
        {noticeQueryResult && noticeQueryResult.data?.notice.title && (
          <title>가방끈 | 소식끈 - {noticeQueryResult.data?.notice.title}</title>
        )}
        <link
          rel="canonical"
          href={`https://www.bagstrap.team/board/notice/${uuid}`}
          key="canonical"
        />
      </Head>
      <BoardPageLayout boardType={BoardType.NOTICE} showWriteButton={isAdmin}>
        {/*
         * 아래 코드를 없애면 update(initialized data가 fetch)된 MeStore의 데이터를 사용하지 못 함.
         * 정확한 원인을 찾지는 못했는데, mobx는 observable state가
         * 컴포넌트의 render()에서 사용되어야 해당 컴포넌트를 force re-rendering 한다고 함.
         * 또한 isAdmin 같은 boolean 값은 해당 안 됨.
         *
         * The observer function / decorator can be used to turn ReactJS components
         * into reactive components. It wraps the component's render function in mobx.autorun
         * to make sure that any data that is used during the rendering of a component
         * forces a re-rendering upon change.
         */}
        {MeStore.getUUID() ? '' : ''}

        <div className="flex gap-8">
          <div className="relative flex-1 xl:w-2/3">
            <BoardLoadingSurface
              open={!noticeQueryResult.data && noticeQueryResult.loading}
            />

            {noticeQueryResult.error && (
              <ErrorMessage text={noticeQueryResult.error.message} />
            )}

            {noticeQueryResult && (
              <>
                {/* top */}
                <section
                  className={clsx(
                    'bg-primary-light bg-opacity-40 border-b border-[#E5E5EB]',
                    'px-4 pt-3.5 pb-4 space-y-2.5',
                    'md:px-5 md:pt-6 md:pb-5 md:space-y-5'
                  )}
                >
                  <div className="flex-between">
                    {/* category */}
                    <BaseLink href={`/board/notice`}>
                      <div className="flex items-center gap-x-2">
                        <BoardIcon />
                        <span
                          className={clsx(
                            'text-primary-dark typo-body6 font-semibold leading-none',
                            'md:typo-body4'
                          )}
                        >
                          소식끈
                        </span>
                      </div>
                    </BaseLink>

                    {/* menu */}
                    {isAdmin && (
                      <div ref={menuRef} className="relative">
                        <BaseButton
                          onClick={() => {
                            setIsMenuOpen(prev => !prev);
                          }}
                          className=""
                        >
                          <MenuIcon />
                        </BaseButton>
                        <NoticeEntityMenu
                          className={clsx(
                            'translate-y-full -bottom-1.5 -right-4',
                            isMenuOpen ? 'block' : 'hidden'
                          )}
                          uuid={uuid}
                          title={noticeQueryResult.data?.notice.title}
                        />
                      </div>
                    )}
                  </div>

                  <div className={clsx('space-y-3', 'md:space-y-4')}>
                    {/* title */}
                    <p
                      className={clsx(
                        'typo-body1 font-bold break-all',
                        'md:typo-header2'
                      )}
                    >
                      {noticeQueryResult.data?.notice.title}
                    </p>

                    {/* info */}
                    <div
                      className={clsx(
                        'flex flex-col gap-2',
                        'md:flex-row md:flex-between'
                      )}
                    >
                      {/* info */}
                      <div className="flex flex-col justify-between w-full">
                        <NoticeInfo />
                      </div>
                    </div>
                  </div>
                </section>

                {/* body */}
                <section
                  className={clsx('px-4 py-3 space-y-8', 'md:px-5 md:py-5', 'xl:px-0')}
                >
                  <div className={clsx('space-y-3', 'xl:px-5')}>
                    {noticeQueryResult.data && (
                      <Quill
                        theme="bubble"
                        modules={{ toolbar: {} }}
                        readOnly={true}
                        value={JSON.parse(noticeQueryResult.data?.notice.content)}
                      />
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          <div className={clsx('hidden xl:block w-1/3 py-4 space-y-5')}>
            {/* app link banner */}
            <AppLinkBannerSection />

            {/* recent board */}
            <BoardRecentSection />

            {/* youtube */}
            <YoutubeChannelOverviewSection />
          </div>
        </div>
      </BoardPageLayout>
    </>
  );
};

export async function getServerSideProps(ctx: { query: { uuid: string } }) {
  const { uuid } = ctx.query;

  const apolloClient = initializeApollo();

  const NoticeQueryResult = await apolloClient
    .query<NoticeQuery, NoticeQueryVariables>({
      query: NoticeDocument,
      variables: {
        uuid
      }
    })
    .catch(error => {
      console.log(error);

      return {
        data: {
          notice: null
        },
        error
      };
    });

  return {
    props: addInitialApolloState(apolloClient, {
      NoticeQueryResult
    })
  };
}

export default observer(NoticeDetailPage);
