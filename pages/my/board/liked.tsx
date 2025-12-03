import React, { useCallback, useEffect } from 'react';
import type { NextPage } from 'next';

import {
  BoardEntityView,
  BoardFetchType,
  useBoardsDetailLazyQuery,
  useBoardsDetailQuery
} from '@generated/graphql';

import BoardPageLayout from '@layouts/BoardPageLayout';

import BoardPostList from '@common/bagstrap/board/BoardPostList';
import { useStore } from '@stores/useStore.hook';
import useIntersect from '@hooks/useIntersect.hook';
import Loader from '@common/loader/loader';
import { observer } from 'mobx-react-lite';

const fetchType = BoardFetchType.Like;

const MyPostsLikedPage: NextPage = () => {
  const { BoardStore: store } = useStore();

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
        fetchType,
        paginationRequestDto: {
          count: store.count
        }
      }
    }
  });

  const [getBoardList, { data, error, loading }] = useBoardsDetailLazyQuery();

  const getBoardListByCursor = useCallback(
    (cursor: string | null) => {
      getBoardList({
        variables: {
          input: {
            fetchType,
            paginationRequestDto: {
              count: store.count,
              cursor
            }
          }
        }
      });
    },
    [getBoardList, store.count]
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

export default observer(MyPostsLikedPage);
