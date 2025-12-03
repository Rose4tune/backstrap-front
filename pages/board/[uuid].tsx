import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useStore } from '@stores/useStore.hook';

import {
  BoardEntityView,
  BoardsDetailDocument,
  BoardsDetailQuery,
  BoardsDetailQueryResult,
  BoardsDetailQueryVariables,
  useBoardsDetailLazyQuery,
  useFaGroupsQuery
} from '@generated/graphql';

import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';

import useIntersect from '@hooks/useIntersect.hook';
import BoardPageLayout from '@layouts/BoardPageLayout';
import BoardPostList from '@common/bagstrap/board/BoardPostList';
import Loader from '@common/loader/loader';
import { DEFAULT_REQUEST_COUNT } from '@constants/request.constant';
import { Box, ButtonBase, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { IMAGE_DEFAULT_BLUR_DATA_URL } from '@constants/image.constant';
import HeartIcon from '@public/icons/ic-small-heart.svg';
import CommentIcon from '@public/icons/ic-small-comment.svg';
import dynamic from 'next/dynamic';
import { BOARD_VERSION_NEW, BOARD_VERSION_OLD } from '@constants/bagstrap/board.constant';
import BoardPostContentHtmlViewer from '@common/bagstrap/board/BoardPostContentHtmlViewer';

dynamic(() => import('react-quill'), {
  ssr: false
});

export interface BoardPageProps {
  boards: BoardsDetailQueryResult;
}

const BoardPage: NextPage<BoardPageProps> = ({ boards }) => {
  const router = useRouter();
  const { FaGroupStore, BoardStore: store } = useStore();
  const { MeStore } = useStore();
  const isAdmin = useMemo(() => MeStore.isAdmin, [MeStore.isAdmin]);
  const [showWriteButton, setShowWriteButton] = useState<boolean>(true);

  const faGroup = FaGroupStore.getFaGroupsByUUID(store.categoryUUID || '');
  const up425 = useMediaQuery('(min-width:425px)');
  const up1280 = useMediaQuery('(min-width:1280px)');

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!store.isEmpty) {
      if (store.hasMore && !loading) {
        getBoardListByCursor(store.data.cursor);
      }
    }
  });

  const faGroupsQueryResult = useFaGroupsQuery();

  useEffect(() => {
    const { uuid } = router.query;
    if (uuid !== 'best' && boards.data?.boardsByCursor.data) {
      store.initData();
      store.setList(boards.data?.boardsByCursor.data as BoardEntityView[]);
      store.setCursor(boards.data?.boardsByCursor.cursor || null);
      store.setTotalCount(boards.data?.boardsByCursor.totalCount);
    }

    if (!uuid) return;

    const _uuid = Array.isArray(uuid) ? uuid[0] : uuid;

    let categoryUUIDToChange: string = _uuid;

    if (_uuid == 'all') {
      categoryUUIDToChange = '';
    } else if (_uuid == 'best') {
      const bestUuid = faGroupsQueryResult.data?.FAGroups.find(
        e => e?.code == 'HOT'
      )?.uuid;

      categoryUUIDToChange = bestUuid ?? '';
    }
    store.setCategoryUUID(categoryUUIDToChange);
  }, [router.query.uuid, faGroupsQueryResult.data]);

  const [getBoardList, { data, error, loading }] = useBoardsDetailLazyQuery();

  const getBoardListByCursor = useCallback(
    (cursor: string | null) => {
      getBoardList({
        variables: {
          input: {
            groupUuid: store.categoryUUID,
            paginationRequestDto: {
              count: store.count,
              cursor
            }
          }
        }
      });
    },
    [getBoardList, store.categoryUUID, store.count]
  );

  useEffect(() => {
    if (data) {
      store.pushList(data.boardsByCursor.data as BoardEntityView[]);
      store.setCursor(data.boardsByCursor.cursor || null);
      store.setTotalCount(data.boardsByCursor.totalCount);
    }
  }, [data, store]);

  useEffect(() => {
    const { uuid } = router.query;

    // 버튼 비활성화 게시판 목록
    const disabledUuids = [
      'woqdjkkdjr', // dev - 가방끈지기
      'kqidowidbf', // dev - 정보게시끈
      'rfpdrfkdjw', // dev - 베스트끈
      'qohnwionlr', // prod - 가방끈지기
      'hifnflwnqw', // prod - 정보게시끈
      'lhokirlnwq', // prod - 베스트끈
      'best'
    ];

    const shouldShowWriteButton = (): boolean => {
      if (isAdmin) return true; // 관리자는 항상 버튼 활성화
      if (typeof uuid !== 'string') return true; // 잘못된 uuid 타입 처리
      return !disabledUuids.includes(uuid); // 비활성화 목록에 없으면 버튼 활성화
    };

    setShowWriteButton(shouldShowWriteButton());
  }, [router.query.uuid, isAdmin]);

  const isJSON = (str: string) => {
    if (typeof str !== 'string') return false;
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <Head>
        {faGroup && faGroup.name && <title>가방끈 | {faGroup.name}</title>}
        <link
          rel="canonical"
          href={`https://www.bagstrap.team/board/${store.categoryUUID}`}
          key="canonical"
        />
      </Head>

      <BoardPageLayout groupUuid={store.categoryUUID} showWriteButton={showWriteButton}>
        <Box py={'20px'}>
          {faGroup && (
            <Typography
              px={up1280 ? '0' : '16px'}
              color={'primary'}
              fontSize={up425 ? '28px' : '24px'}
              fontWeight={'bold'}
              mb={up425 ? '24px' : '8px'}
            >
              {faGroup.name}
            </Typography>
          )}

          <>
            <BoardPostList />
            {loading ? <Loader /> : <div ref={ref} className="h-1" />}
          </>
        </Box>
      </BoardPageLayout>
    </>
  );
};

export async function getServerSideProps(ctx: { query: { uuid: string } }) {
  const { uuid } = ctx.query;

  const apolloClient = initializeApollo();

  const boardsQueryResult = await apolloClient
    .query<BoardsDetailQuery, BoardsDetailQueryVariables>({
      query: BoardsDetailDocument,
      variables: {
        input: {
          groupUuid: uuid,
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
          boardsByCursor: {
            data: [],
            cursor: null,
            totalCount: 0
          }
        }
      };
    });

  return {
    props: addInitialApolloState(apolloClient, {
      boards: boardsQueryResult
    })
  };
}

export default observer(BoardPage);
