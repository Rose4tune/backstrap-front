import React, { useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import { observer } from 'mobx-react';

import { useStore } from '@stores/useStore.hook';
import {
  BoardEntityView,
  useBoardsDetailLazyQuery,
  useBoardsDetailQuery
} from '@generated/graphql';

import BoardPageLayout from '@layouts/BoardPageLayout';

import BoardPostList from '@common/bagstrap/board/BoardPostList';
import Loader from '@common/loader/loader';
import useIntersect from '@hooks/useIntersect.hook';

const MyPostsWrittenPage: NextPage = () => {
  const { MeStore, BoardStore: store } = useStore();

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
        userUuid: MeStore.getUUID(),
        paginationRequestDto: {
          count: store.count
        }
      }
    },
    fetchPolicy: 'network-only',
    skip: !!!MeStore.getUUID()
  });

  const [getBoardList, { data, error, loading }] = useBoardsDetailLazyQuery();

  const getBoardListByCursor = useCallback(
    (cursor: string | null) => {
      getBoardList({
        variables: {
          input: {
            userUuid: MeStore.getUUID(),
            paginationRequestDto: {
              count: store.count,
              cursor
            }
          }
        }
      });
    },
    [MeStore.me, getBoardList, store.count]
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
    <BoardPageLayout authRequired>
      <BoardPostList showCategory />
      {loading && boardsQueryResult.loading ? (
        <Loader />
      ) : (
        <div ref={ref} className="h-1" />
      )}
    </BoardPageLayout>
  );
};

export default observer(MyPostsWrittenPage);
