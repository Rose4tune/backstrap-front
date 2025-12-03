import clsx from 'clsx';
import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
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
import HeartIcon from '@public/icons/[board]heart.svg';
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

import useAuthenticated from '@hooks/useAuthenticated.hook';
import dynamic from 'next/dynamic';

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
        <div className="flex gap-8">
          <div className="relative flex-1 xl:w-2/3">
            {(boardQueryResult.error || boardMyError) && (
              <ErrorMessage
                text={boardQueryResult.error?.message ?? boardMyError?.message}
              />
            )}

            {boardQueryResult.data && (
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
                    {boardQueryResult.data.board.category && (
                      <BaseLink
                        href={`/board/${boardQueryResult.data.board.category.uuid}`}
                      >
                        <div className="flex items-center gap-x-2">
                          <BoardIcon />
                          <span
                            className={clsx(
                              'text-primary-dark typo-body6 font-semibold leading-none',
                              'md:typo-body4'
                            )}
                          >
                            {boardQueryResult.data.board.category.name}
                          </span>
                        </div>
                      </BaseLink>
                    )}

                    {/* menu */}
                    <div ref={menuRef} className="relative">
                      <BaseButton
                        onClick={() => {
                          setIsMenuOpen(prev => !prev);
                        }}
                        className=""
                      >
                        <MenuIcon />
                      </BaseButton>
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
                    </div>
                  </div>

                  <div className={clsx('space-y-3', 'md:space-y-4')}>
                    {/* title */}
                    <p
                      className={clsx(
                        'typo-body1 font-bold break-all',
                        'md:typo-header2'
                      )}
                    >
                      {boardQueryResult.data.board.title}
                    </p>

                    {/* info */}
                    <div
                      className={clsx(
                        'flex flex-col gap-2',
                        'md:flex-row md:flex-between'
                      )}
                    >
                      {/* writer */}
                      <BoardPostWriterInfo
                        user={boardQueryResult.data.board.user as UserEntityView}
                        isAnonymous={boardQueryResult.data.board.isAnonymous}
                      />
                      {/* info */}
                      <BoardPostInfo
                        elapsedCreatedDate={
                          boardQueryResult.data.board.elapsedCreatedDate
                        }
                        likeCount={boardQueryResult.data.board.likeCount}
                        reviewCount={boardQueryResult.data.board.reviewCount}
                      />
                    </div>
                  </div>
                </section>

                {boardQueryResult.data.board.version === BOARD_VERSION_OLD && (
                  <div className={clsx('h-7 px-4 flex items-center bg-[#F6F6F6]')}>
                    <HelperMessage type="error" text="이전 버전에서 작성한 글입니다." />
                  </div>
                )}

                {/* body */}
                <section
                  className={clsx(
                    'px-4 py-3 space-y-8 overflow-auto',
                    'md:px-5 md:py-5',
                    'xl:px-0'
                  )}
                >
                  <div className={clsx('space-y-3', 'xl:px-5')}>
                    {boardQueryResult.data.board.version === BOARD_VERSION_OLD &&
                      boardQueryResult.data.board.files &&
                      boardQueryResult.data.board.files.length > 0 && (
                        <div className="space-y-3">
                          {boardQueryResult.data.board.files
                            .filter(isNotNil)
                            .map((boardFile, index) => (
                              <div key={boardFile.uuid || index}>
                                {boardFile?.file?.url && <img src={boardFile.file.url} />}
                              </div>
                            ))}
                        </div>
                      )}

                    {boardQueryResult.data.board.vote && (
                      <BoardPostVoteSection
                        vote={boardMyData?.board.vote ?? boardQueryResult.data.board.vote}
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
                        value={JSON.parse(boardQueryResult.data.board.content)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* actions */}
                    <div className="flex gap-1">
                      <BoardPostActionButton
                        icon={
                          <HeartIcon
                            className={clsx('w-4 h-3.5', 'md:w-[19px] md:h-[17px]')}
                          />
                        }
                        label="좋아요"
                        count={
                          boardMyData?.board.likeCount ||
                          boardQueryResult.data.board.likeCount
                        }
                        isActive={
                          boardMyData?.board.isLikedByMe ||
                          boardQueryResult.data.board.isLikedByMe ||
                          false
                        }
                        onClick={onClickInteraction(UserInteractionType.Like)}
                      />
                      <BoardPostActionButton
                        icon={
                          <ScrapIcon
                            className={clsx('w-[11px] h-3.5', 'md:w-[13px] md:h-[17px]')}
                          />
                        }
                        label="스크랩"
                        count={
                          boardMyData?.board.bookmarkCount ||
                          boardQueryResult.data.board.bookmarkCount
                        }
                        isActive={
                          boardMyData?.board.isBookmarkedByMe ||
                          boardQueryResult.data.board.isBookmarkedByMe ||
                          false
                        }
                        onClick={onClickInteraction(UserInteractionType.Scrap)}
                      />
                    </div>

                    {/* review(comment) */}
                    <BoardPostCommentSection
                      board={boardQueryResult.data.board}
                      boardUuid={uuid}
                    />
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
