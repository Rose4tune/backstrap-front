import clsx from 'clsx';
import React, { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { observer } from 'mobx-react';
import { useClickAway } from 'react-use';

import { isNotNil } from '@utils/common/base.util';

import { useApolloClient } from '@apollo/client';

import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';

import { setErrorUnauthorizedAction } from '@vars/error.var';

import 'react-quill/dist/quill.bubble.css';

import { BOARD_VERSION_NEW, BOARD_VERSION_OLD } from '@constants/bagstrap/board.constant';

import { useStore } from '@stores/useStore.hook';

import {
  EntityType,
  useDeleteUserInteractionMutation,
  useRegisterUserInteractionMutation,
  UserInteractionType,
  BoardQuery,
  BoardQueryVariables,
  BoardDocument,
  useBoardMyQuery,
  BoardQueryResult,
  BoardMyQuery,
  BoardMyQueryVariables,
  BoardMyDocument,
  UserEntityView
} from '@generated/graphql';

import BoardIcon from '@public/icons/[board]board.svg';
import MenuIcon from '@public/icons/[board]menu.svg';

import SeeMoreIcon from '@public/icons/ic-see-more.svg';
import SeeMoreSmallIcon from '@public/icons/ic-more-small.svg';

import BookmarkIcon from '@public/icons/ic-bookmark.svg';
import BookmarkIconSmall from '@public/icons/ic-bookmark-small.svg';
import BookmarkActiveIcon from '@public/icons/ic-bookmark-activate.svg';
import BookmarkActiveIconSmall from '@public/icons/ic-bookmark-activate-small.svg';
import HeartIcon from '@public/icons/ic-small-heart.svg';
import LikeIconPrimary from '@public/icons/[board]heart-filled.svg';
import LikeIconGrey from '@public/icons/[board]heart.svg';
import CommentIcon from '@public/icons/[board]comment.svg';
import ScrapIcon from '@public/icons/[board]scrap.svg';

import BoardPageLayout from '@layouts/BoardPageLayout';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import EntityMenu from '@common/bagstrap/etc/EntityMenu';
import BoardPostInfo from '@common/bagstrap/board/BoardPostInfo';
import BoardPostWriterInfo from '@common/bagstrap/board/BoardPostWriterInfo';
import BoardPostCommentSection from '@common/bagstrap/board/BoardPostCommentSection';
import BoardPostActionButton from '@common/bagstrap/board/BoardPostActionButton';
import BoardPostContentHtmlViewer from '@common/bagstrap/board/BoardPostContentHtmlViewer';
import BoardPostVoteSection from '@common/bagstrap/board/BoardPostVoteSection';
import BoardRecentSection from '@common/bagstrap/board/BoardRecentSection';
import AppLinkBannerSection from '@common/bagstrap/etc/AppLinkBannerSection';
import YoutubeChannelOverviewSection from '@common/bagstrap/etc/YoutubeChannelOverviewSection';
import ErrorMessage from '@common/bagstrap/etc/ErrorMessage';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import { ScrollBox } from '@components/home/ScrollBox/ScrollBox';

import useAuthenticated from '@hooks/useAuthenticated.hook';
import dynamic from 'next/dynamic';
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { BoardRecentAndHot } from '@common/bagstrap/board/BoardRecentAndHot';
import ArrowRightIcon from '@public/icons/arrow-right.svg';
import { sanitizeYouTubeLinkEmbed } from 'src/utils/sanitizeYoutubeLinkEmbed';

export const mockBoardContent = JSON.stringify([
  { insert: '이 글은 유튜브 영상을 포함하고 있습니다.\n' },
  { insert: '유튜브 영상 링크:\n' },
  {
    attributes: {
      link: 'https://www.youtube.com/watch?v=f9VZgH3nuWA'
    },
    insert: 'https://www.youtube.com/watch?v=f9VZgH3nuWA'
  },
  { insert: '\n' },
  { insert: '텍스트가 끝났습니다.\n' }
]);

const Quill = dynamic(() => import('react-quill'), {
  ssr: false
});

export interface BoardPostPageProps {
  boardQueryResult: Pick<BoardQueryResult, 'data' | 'error'>;
}

const BoardPostPage: NextPage<BoardPostPageProps> = ({ boardQueryResult }) => {
  const router = useRouter();
  const { MeStore } = useStore();
  const apolloClient = useApolloClient();
  const isAuthenticated = useAuthenticated();
  const up425 = useMediaQuery('(min-width:425px)');
  const up1024 = useMediaQuery('(min-width:1024px)');
  const up1280 = useMediaQuery('(min-width:1280px)');

  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [registerUserInteraction] = useRegisterUserInteractionMutation();

  const [deleteUserInteraction] = useDeleteUserInteractionMutation();

  const uuid = useMemo(() => {
    const { uuid: _uuid } = router.query;
    const uuid = Array.isArray(_uuid) ? _uuid[0] : _uuid || '';
    return uuid;
  }, [router.query]);

  const source = useMemo(
    () => `/board/${boardQueryResult.data?.board.category?.uuid}`,
    [boardQueryResult.data?.board.category?.uuid]
  );

  useClickAway(menuRef, () => {
    setIsMenuOpen(false);
  });

  const {
    data: boardMyData,
    error: boardMyError,
    refetch: refetchBoardMy
  } = useBoardMyQuery({
    variables: {
      uuid
    },
    skip: !uuid && !isAuthenticated
  });

  const isLikeActive =
    boardMyData?.board.isLikedByMe || boardQueryResult.data?.board.isLikedByMe || false;
  const isBookmarkActive =
    boardMyData?.board.isBookmarkedByMe ||
    boardQueryResult.data?.board.isBookmarkedByMe ||
    false;

  useEffect(() => {
    if (uuid && boardMyData) {
      apolloClient.writeQuery<BoardMyQuery, BoardMyQueryVariables>({
        query: BoardMyDocument,
        data: boardMyData,
        variables: {
          uuid
        },
        id: uuid
      });
    }
  }, [boardMyData, uuid]);

  const isMine = useMemo(
    () =>
      isAuthenticated &&
      !MeStore.isEmpty() &&
      !!boardQueryResult?.data?.board.user?.uuid &&
      boardQueryResult.data.board.user.uuid === MeStore.getUUID(),
    [isAuthenticated, MeStore.me, boardQueryResult]
  );

  const onClickInteraction = useCallback(
    (type: UserInteractionType) => () => {
      if (!isAuthenticated) {
        setErrorUnauthorizedAction();
        return;
      }

      const interactionMutationArgs = {
        variables: {
          input: {
            parentEntityType: EntityType.Board,
            parentEntityUuid: uuid,
            userInteractionType: type
          }
        },
        onCompleted: () => {
          refetchBoardMy();
        }
      };

      switch (type) {
        case UserInteractionType.Like:
          if (
            boardMyData?.board.isLikedByMe ||
            boardQueryResult.data?.board.isLikedByMe
          ) {
            deleteUserInteraction(interactionMutationArgs);
          } else {
            registerUserInteraction(interactionMutationArgs);
          }
          break;

        case UserInteractionType.Scrap:
          if (
            boardMyData?.board.isBookmarkedByMe ||
            boardQueryResult.data?.board.isBookmarkedByMe
          ) {
            deleteUserInteraction(interactionMutationArgs);
          } else {
            registerUserInteraction(interactionMutationArgs);
          }
          break;

        default:
          break;
      }
    },
    [
      boardMyData?.board.isBookmarkedByMe,
      boardMyData?.board.isLikedByMe,
      boardQueryResult.data?.board.isBookmarkedByMe,
      boardQueryResult.data?.board.isLikedByMe,
      deleteUserInteraction,
      refetchBoardMy,
      registerUserInteraction,
      uuid
    ]
  );

  // console.log(boardQueryResult.data?.board.content);
  return (
    <>
      <Head>
        {boardQueryResult && boardQueryResult.data?.board.title && (
          <title>
            가방끈 | {boardQueryResult.data.board.category?.name} -{' '}
            {boardQueryResult.data.board.title}
          </title>
        )}
        <link
          rel="canonical"
          href={`https://www.bagstrap.team/board/post/${uuid}`}
          key="canonical"
        />
      </Head>

      <BoardPageLayout groupUuid={boardQueryResult?.data?.board.category?.uuid}>
        {boardQueryResult.data && (
          <Box px={up1280 ? 0 : up425 ? '20px' : '16px'} py={'24px'}>
            {boardQueryResult.data?.board.category?.name && (
              <Typography
                color={'primary'}
                fontSize={up425 ? '26px' : '20px'}
                fontWeight={'bold'}
              >
                {boardQueryResult.data.board.category?.name}
              </Typography>
            )}

            <Box
              display={'flex'}
              mt={'24px'}
              flexDirection={up1280 ? 'row' : 'column'}
              gap={'16px'}
            >
              <Box flex={1}>
                <Box
                  sx={
                    up425
                      ? {
                          border: '1px solid #E6E6E6',
                          borderRadius: '16px',
                          p: '32px'
                        }
                      : undefined
                  }
                >
                  <Box display={'flex'} justifyContent={'space-between'}>
                    {/* writer */}
                    <BoardPostWriterInfo
                      user={boardQueryResult.data?.board.user as UserEntityView}
                      isAnonymous={boardQueryResult.data?.board.isAnonymous}
                    />
                    <Box display={'flex'} alignItems={'center'} mr={up425 ? 0 : '-8px'}>
                      <IconButton
                        sx={
                          up425
                            ? { width: '30px', height: '30px' }
                            : {
                                width: '28px',
                                height: '28px'
                              }
                        }
                        onClick={onClickInteraction(UserInteractionType.Scrap)}
                      >
                        {isBookmarkActive ? (
                          <BookmarkActiveIconSmall />
                        ) : (
                          <BookmarkIconSmall />
                        )}
                      </IconButton>
                      <IconButton
                        sx={
                          up425
                            ? { width: '40px', height: '40px' }
                            : {
                                width: '28px',
                                height: '28px'
                              }
                        }
                        onClick={() => setIsMenuOpen(prevState => !prevState)}
                      >
                        {<SeeMoreSmallIcon />}
                        <EntityMenu
                          className={clsx(
                            'translate-y-full -bottom-1.5 -right-4',
                            isMenuOpen ? 'block' : 'hidden'
                          )}
                          entityType={EntityType.Board}
                          uuid={uuid}
                          version={boardQueryResult.data.board.version}
                          user={{
                            uuid: boardQueryResult.data.board.user?.uuid ?? '',
                            name: boardQueryResult.data.board.isAnonymous
                              ? '익명의 끈'
                              : boardQueryResult.data.board.user?.name,
                            isAnonymous: boardQueryResult.data.board.isAnonymous
                          }}
                          title={boardQueryResult.data.board.title}
                          category={boardQueryResult.data.board.category}
                          isMine={isMine}
                          sourceUrl={source}
                        />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    mt={'16px'}
                    mb={'16px'}
                    fontSize={up425 ? '28px' : '24px'}
                    fontWeight={'bold'}
                  >
                    {boardQueryResult.data?.board.title}
                  </Typography>

                  <BoardPostInfo
                    elapsedCreatedDate={boardQueryResult.data?.board.elapsedCreatedDate}
                    likeCount={boardQueryResult.data?.board.likeCount}
                    reviewCount={boardQueryResult.data?.board.reviewCount}
                  />

                  <Divider sx={{ mt: '20px', mb: '28px' }} />

                  {boardQueryResult.data.board.version === BOARD_VERSION_OLD && (
                    <div className={clsx('h-7 px-4 flex items-center bg-[#F6F6F6]')}>
                      <HelperMessage type="error" text="이전 버전에서 작성한 글입니다." />
                    </div>
                  )}

                  {/* body */}

                  <Box mx={'-12px'}>
                    <div>
                      {boardQueryResult.data.board.version === BOARD_VERSION_OLD &&
                        boardQueryResult.data.board.files &&
                        boardQueryResult.data.board.files.length > 0 && (
                          <div className="space-y-3">
                            {boardQueryResult.data.board.files
                              .filter(isNotNil)
                              .map((boardFile, index) => (
                                <div key={boardFile.uuid || index}>
                                  {boardFile?.file?.url && (
                                    <img src={boardFile.file.url} />
                                  )}
                                </div>
                              ))}
                          </div>
                        )}

                      {boardQueryResult.data.board.vote && (
                        <BoardPostVoteSection
                          vote={
                            boardMyData?.board.vote ?? boardQueryResult.data.board.vote
                          }
                          boardUuid={uuid}
                          isBoardMine={isMine}
                        />
                      )}
                      {boardQueryResult.data.board.version === BOARD_VERSION_OLD && (
                        <BoardPostContentHtmlViewer
                          content={boardQueryResult.data.board.content}
                        />
                      )}
                      {boardQueryResult.data.board.version === BOARD_VERSION_NEW && (
                        <Quill
                          theme="bubble"
                          modules={{ toolbar: {} }}
                          readOnly={true}
                          value={sanitizeYouTubeLinkEmbed(
                            boardQueryResult.data.board.content
                          )}
                        />
                      )}
                    </div>
                    <Box display={'flex'} flexDirection={'row'}>
                      <ButtonBase
                        sx={{
                          p: '0px 12px',
                          mr: '6px'
                        }}
                        onClick={onClickInteraction(UserInteractionType.Like)}
                      >
                        {isLikeActive ? (
                          <LikeIconPrimary color={'#8DE8E1'} width={'20px'} />
                        ) : (
                          <LikeIconGrey color={'#666666'} width={'20px'} />
                        )}
                        <Typography color={'#666666'} fontSize={'22px'} ml={'10px'}>
                          {boardMyData?.board.likeCount ||
                            boardQueryResult.data.board.likeCount}
                        </Typography>
                      </ButtonBase>

                      <CommentIcon color={'#666666'} width={'20px'} />
                      <Typography color={'#666666'} fontSize={'22px'} ml={'10px'}>
                        {boardQueryResult.data.board.reviewCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* review(comment) */}

                <Box mt={'72px'} mx={up425 ? undefined : '-20px'}>
                  <BoardPostCommentSection
                    board={boardQueryResult.data.board}
                    boardUuid={uuid}
                  />
                </Box>
              </Box>

              <Stack width={up1280 ? 288 : '100%'} gap={'36px'} mt={up1280 ? 0 : '86px'}>
                <BoardRecentAndHot
                  width={up1280 ? '288px' : undefined}
                  variant={'long'}
                  useRouting={true}
                />

                {/* app link banner */}
                <AppLinkBannerSection />

                {/* youtube */}
                <Stack gap={'16px'}>
                  <Box
                    display={'flex'}
                    mt={'4px'}
                    gap={'32px'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography fontSize={'22px'} fontWeight={'bold'}>
                      {'가방끈 유튜브 채널'}
                    </Typography>
                    <Link
                      href={
                        'https://www.youtube.com/channel/UCs6Gm2QwhwLAg_IZnKqsKvg/featured'
                      }
                      underline={'none'}
                      color={'inherit'}
                    >
                      <Box display={'flex'} alignItems={'center'}>
                        <Typography fontSize={'15px'} mr={'6px'}>
                          {'더보기'}
                        </Typography>
                        <ArrowRightIcon />
                      </Box>
                    </Link>
                  </Box>
                  <ScrollBox>
                    <YoutubeChannelOverviewSection vertical={up1280} />
                  </ScrollBox>
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </BoardPageLayout>
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  const { uuid: _uuid } = ctx.query;

  const uuid = Array.isArray(_uuid) ? _uuid[0] : _uuid || '';

  const apolloClient = initializeApollo();

  const [boardQueryResult] = await Promise.all([
    apolloClient
      .query<BoardQuery, BoardQueryVariables>({
        query: BoardDocument,
        variables: {
          uuid
        }
      })
      .catch(error => {
        return {
          data: {
            board: null
          },
          error
        };
      })
  ]);

  return {
    props: addInitialApolloState(apolloClient, {
      boardQueryResult
    })
  };
}

export default observer(BoardPostPage);
