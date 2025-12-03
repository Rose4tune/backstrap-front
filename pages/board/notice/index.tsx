import type { NextPage } from 'next';
import { useCallback, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import clsx from 'clsx';

import { useStore } from '@stores/useStore.hook';
import {
  NoticesListDocument,
  NoticesListQuery,
  NoticesListQueryVariables,
  NoticesListQueryResult,
  useNoticesListLazyQuery,
  NoticeEntityView
} from '@generated/graphql';
import useIntersect from '@hooks/useIntersect.hook';
import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';
import BoardPageLayout from '@layouts/BoardPageLayout';

import BoardIcon from '@public/icons/[board]board.svg';

import NoticeList from '@common/bagstrap/notice/NoticeList';
import Loader from '@common/loader/loader';

import { BoardType } from '@enums/board/board.enum';
import { DEFAULT_REQUEST_COUNT } from '@constants/request.constant';

export interface NoticeListPageProps {
  noticesQueryResult: NoticesListQueryResult;
}

const NoticeListPage: NextPage<NoticeListPageProps> = ({
  noticesQueryResult
}: NoticeListPageProps) => {
  const { MeStore, NoticeStore: store } = useStore();

  const isAdmin = useMemo(() => MeStore.isAdmin, [MeStore.isAdmin]);

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!store.isEmpty) {
      if (store.hasMore && !loading) {
        getNoticeListByCursor(store.data.cursor);
      }
    }
  });

  useEffect(() => {
    if (noticesQueryResult.data?.noticesByCursor.data) {
      store.initData();
      store.setList(noticesQueryResult.data.noticesByCursor.data as NoticeEntityView[]);
      store.setCursor(noticesQueryResult.data.noticesByCursor.cursor || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [getNoticeList, { data, error, loading }] = useNoticesListLazyQuery();

  const getNoticeListByCursor = useCallback(
    (cursor: string | null) => {
      getNoticeList({
        variables: {
          input: {
            paginationRequestDto: {
              cursor,
              count: store.count
            }
          }
        }
      });
    },
    [getNoticeList, store.count]
  );

  useEffect(() => {
    if (data) {
      store.pushList(data.noticesByCursor.data as NoticeEntityView[]);
      store.setCursor(data.noticesByCursor.cursor || null);
    }
  }, [data, store]);

  return (
    <>
      <Head>
        <title>가방끈 | 소식끈</title>
        <link
          rel="canonical"
          href={`https://www.bagstrap.team/board/notice`}
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

        {/* title */}
        <div
          className={clsx(
            'flex items-center gap-x-2',
            'h-10 px-3',
            'bg-primary-light bg-opacity-40 border-b border-[#E5E5EB]',
            'md:h-[51px] md:px-5',
            'xl:h-[66px]'
          )}
        >
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

        {/* notice list */}
        <NoticeList />
        {loading ? <Loader /> : <div ref={ref} className="h-1" />}
      </BoardPageLayout>
    </>
  );
};

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  const noticesQueryResult = await apolloClient
    .query<NoticesListQuery, NoticesListQueryVariables>({
      query: NoticesListDocument,
      variables: {
        input: {
          paginationRequestDto: {
            count: DEFAULT_REQUEST_COUNT
          }
        }
      }
    })
    .catch(e => {
      console.log(e);

      return {
        data: {
          noticesByCursor: {
            data: []
          }
        }
      };
    });

  return {
    props: addInitialApolloState(apolloClient, {
      noticesQueryResult
    })
  };
}

export default observer(NoticeListPage);
