import Image from 'next/image';
import first from 'lodash/first';
import qs from 'qs';
import clsx from 'clsx';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { initializeApollo } from '@libs/apolloClient';

import { isNotNil } from '@utils/common/base.util';
import { renderLineBreak } from '@utils/common/render.util';
import { extractPureText } from '@utils/common/html.util';

import {
  BoardDetailFragment,
  BoardsDetailDocument,
  BoardsDetailQueryVariables,
  BoardsDetailQuery,
  UserEntityView
} from '@generated/graphql';

import ArrowCircleLeftIcon from '@public/icons/[board]arrow-circle-left.svg';
import ArrowCircleRightIcon from '@public/icons/[board]arrow-circle-right.svg';

import BaseLink from '@common/BaseLink';
import BaseButton from '@common/button/BaseButton';
import Loader from '@common/loader/loader';

import BoardPostInfo from './BoardPostInfo';
import BoardPostWriterInfo from './BoardPostWriterInfo';
import { BOARD_VERSION_NEW, BOARD_VERSION_OLD } from '@constants/bagstrap/board.constant';

const INIT_PAGE = 1;
const TOTAL_PAGE = 5;
const PER_PAGE = 3;

export interface BoardRecentSectionProps extends BaseProps {
  boards?: BoardDetailFragment[];
}

const BoardRecentSection = (props: BoardRecentSectionProps): JSX.Element => {
  const { className } = props;

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [boardList, setBoardList] = useState<BoardDetailFragment[]>([]);
  const [loading, setLoading] = useState(false);

  const source = useMemo(() => {
    const _source = router.query.source;
    return Array.isArray(_source) ? _source[0] : _source;
  }, [router.query.source]);

  useEffect(() => {
    setLoading(true);

    const apolloClient = initializeApollo();

    apolloClient
      .query<BoardsDetailQuery, BoardsDetailQueryVariables>({
        query: BoardsDetailDocument,
        variables: {
          input: {
            paginationRequestDto: {
              count: TOTAL_PAGE * PER_PAGE
            }
          }
        }
      })
      .catch(e => {
        console.log(e);

        return {
          data: {
            boardsByCursor: {
              data: []
            }
          }
        };
      })
      .then(boardsQueryResult => {
        if (boardsQueryResult && boardsQueryResult.data.boardsByCursor.data.length != 0) {
          setBoardList(
            boardsQueryResult.data.boardsByCursor.data as BoardDetailFragment[]
          );
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onChangePage = useCallback((p: number) => () => setPage(p), [setPage]);

  const boards = useMemo(
    () => props.boards ?? boardList.filter(isNotNil),
    [props.boards, boardList]
  );

  return (
    <section className={clsx('h-fit', 'space-y-2', className)}>
      {/* header */}
      <div className="bg-primary-light border border-primary-dark-light px-3 py-3 typo-body5 font-bold rounded-lg">
        따끈따끈 막 나온 끈
      </div>

      {/* pagination */}
      {boards && (
        <div className="flex-between">
          <div className="flex items-center gap-1">
            {Array.from(Array(Math.min(boards.length, TOTAL_PAGE))).map((_, index) => (
              <BaseButton
                key={index}
                onClick={onChangePage(index + 1)}
                disabled={index + 1 === page}
                className={clsx(
                  index + 1 !== page && 'hover:bg-[#F6F6F6]',
                  'flex-center w-6 h-6 rounded',
                  'typo-body8',
                  index + 1 === page
                    ? 'bg-primary-dark-light bg-opacity-30 border border-primary-dark-light text-primary-dark font-bold'
                    : 'text-grey4 font-medium'
                )}
              >
                {index + 1}
              </BaseButton>
            ))}
          </div>

          <div className="flex-center gap-1.5">
            <BaseButton
              disabled={page === INIT_PAGE}
              onClick={onChangePage(page - 1)}
              aria-label="prev page"
            >
              <ArrowCircleLeftIcon aria-label="prev page" />
            </BaseButton>
            <BaseButton
              disabled={page === TOTAL_PAGE}
              onClick={onChangePage(page + 1)}
              aria-label="next page"
            >
              <ArrowCircleRightIcon aria-label="next page" />
            </BaseButton>
          </div>
        </div>
      )}

      {/* list */}
      <div className="space-y-1">
        {!loading &&
          boards?.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((board, index) => (
            <BaseLink
              key={board.uuid || index}
              href={`/board/post/${board.uuid}?${qs.stringify({ source })}`}
              className="block hover:bg-[#F6F6F6]"
            >
              <BoardPostListItem board={board} />
            </BaseLink>
          ))}
        <Loader containerClassName="h-[315px]" loading={loading} />
      </div>
    </section>
  );
};

export default BoardRecentSection;

/**
 * recent board 전용 item component 별도 정의
 */
const BoardPostListItem = (props: { board: BoardDetailFragment }): JSX.Element => {
  const { board } = props;

  const primaryFile = first(board.files);

  const firstContentObj =
    board.version === BOARD_VERSION_NEW &&
    JSON.parse(board.content).find(
      (obj: { insert: string | { image: string } }) => typeof obj['insert'] == 'string'
    );

  return (
    <div
      className={clsx(
        'border border-primary-dark-light rounded-lg',
        'h-[105px] px-3 py-3 overflow-hidden'
      )}
    >
      <div className={clsx('flex-1 flex justify-between gap-2 h-full')}>
        <div className="flex-1 flex flex-col justify-between">
          {/* writer */}
          <BoardPostWriterInfo
            user={board.user as UserEntityView}
            isAnonymous={board.isAnonymous}
            responsive={false}
          />

          {/* title & content */}
          <div className={clsx('space-y-1')}>
            <div className={clsx('typo-body6 font-semibold leading-none break-all')}>
              <div className="break-words line-clamp-1 text-ellipsis overflow-hidden">
                {board.title}
              </div>
            </div>
            <div className={clsx('typo-body8 font-medium leading-tight break-all')}>
              {board.version === BOARD_VERSION_OLD && (
                <div className="break-words line-clamp-2 text-ellipsis overflow-hidden">
                  {board.content && renderLineBreak(extractPureText(board.content), 2)}
                </div>
              )}
              {board.version === BOARD_VERSION_NEW && (
                <div className="break-words line-clamp-2 text-ellipsis overflow-hidden">
                  {firstContentObj ?? '사진'}
                  {board.content &&
                    !JSON.parse(board.content)[0]['insert']['image'] &&
                    JSON.parse(board.content)[0]['insert'].toString()}
                </div>
              )}
            </div>
          </div>

          {/* info */}
          <BoardPostInfo
            categoryName={board.category?.name || ''}
            elapsedCreatedDate={board.elapsedCreatedDate}
            likeCount={board.likeCount}
            reviewCount={board.reviewCount}
            responsive={false}
          />
        </div>

        {primaryFile && primaryFile.file && primaryFile.file.url && (
          <Image
            src={primaryFile.file?.url}
            alt="board image content"
            className="shrink-0 w-14 h-14 object-cover"
          />
        )}
      </div>
    </div>
  );
};
