import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import {
  BoardEntityView,
  useBoardsDetailLazyQuery,
  useBoardsDetailQuery
} from '@generated/graphql';
import BoardPageLayout from '@layouts/BoardPageLayout';
import BoardPostList from '@common/bagstrap/board/BoardPostList';
import useIntersect from '@hooks/useIntersect.hook';
import { useStore } from '@stores/useStore.hook';
import Loader from '@common/loader/loader';

const BoardSearchPage: NextPage = () => {
  const router = useRouter();
  const { BoardStore: store } = useStore();

  const { keyword: _keyword } = router.query;

  const keyword = (Array.isArray(_keyword) ? _keyword[0] : _keyword)?.trim();

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!store.isEmpty) {
      if (store.hasMore && !loading) {
        getBoardListByCursor(store.data.cursor);
      }
    }
  });

  const boardsQueryResult = useBoardsDetailQuery({
    variables: {
      input: {
        searchKeyword: keyword,
        paginationRequestDto: {
          count: store.count
        }
      }
    },
    skip: !keyword
  });

  const [getBoardList, { data, error, loading }] = useBoardsDetailLazyQuery();

  const getBoardListByCursor = useCallback(
    (cursor: string | null) => {
      getBoardList({
        variables: {
          input: {
            searchKeyword: keyword,
            paginationRequestDto: {
              count: store.count,
              cursor
            }
          }
        }
      });
    },
    [getBoardList, keyword, store.count]
  );

  useEffect(() => {
    if (boardsQueryResult.data?.boardsByCursor.data) {
      store.initData();
      store.setList(boardsQueryResult.data?.boardsByCursor.data as BoardEntityView[]);
      store.setCursor(boardsQueryResult.data?.boardsByCursor.cursor || null);
      store.setTotalCount(boardsQueryResult.data?.boardsByCursor.totalCount);
    }
  }, [
    boardsQueryResult.data?.boardsByCursor.cursor,
    boardsQueryResult.data?.boardsByCursor.data,
    boardsQueryResult.data?.boardsByCursor.totalCount,
    keyword,
    store
  ]);

  useEffect(() => {
    if (data) {
      store.pushList(data.boardsByCursor.data as BoardEntityView[]);
      store.setCursor(data.boardsByCursor.cursor || null);
      store.setTotalCount(data.boardsByCursor.totalCount);
    }
  }, [data, store]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/board/search"
          key="canonical"
        />
      </Head>

      <BoardPageLayout>
        <div
          className={clsx(
            'flex items-center flex-wrap bg-primary-light bg-opacity-40',
            'min-h-[40px] px-3 py-2',
            'text-primary-dark typo-body6 font-semibold',
            'md:h-[66px] md:px-5 md:py-4 md:typo-body4 md:font-bold'
          )}
        >
          <span className="text-black">’{keyword}’</span>&nbsp;검색 결과입니다.
        </div>

        <BoardPostList showCategory />
        {loading && boardsQueryResult.loading ? (
          <Loader />
        ) : (
          <div ref={ref} className="h-1" />
        )}
      </BoardPageLayout>
    </>
  );
};

export default BoardSearchPage;
