import React from 'react';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

import { isNotNil } from '@utils/common/base.util';

import { BoardSummaryFragment, EntityType, useReviewsQuery } from '@generated/graphql';

import Loader from '@common/loader/loader';

import BoardPostCommentInputBox from './BoardPostCommentInputBox';
import BoardPostCommentList from './BoardPostCommentList';
import { useMediaQuery } from '@mui/material';

export interface BoardPostCommentSectionProps {
  boardUuid: string;

  board: BoardSummaryFragment;
}

const BoardPostCommentSection = (props: BoardPostCommentSectionProps): JSX.Element => {
  const { boardUuid, board } = props;
  const up425 = useMediaQuery('(min-width:425px)');

  const [replyTo, setReplyTo] = React.useState<
    | {
        uuid: string;
        name: string;
      }
    | undefined
  >();

  const { ref, inView } = useInView();

  const reviewsQueryResult = useReviewsQuery({
    variables: {
      input: {
        parentEntityType: EntityType.Board,
        parentEntityUuid: board.uuid,
        entityStatus: null,
        paginationRequestDto: {
          count: 50
        }
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  React.useEffect(() => {
    if (
      inView &&
      !reviewsQueryResult.loading &&
      reviewsQueryResult.data?.reviewsByCursor.cursor
    ) {
      reviewsQueryResult.fetchMore({
        variables: {
          input: {
            parentEntityType: EntityType.Board,
            parentEntityUuid: board.uuid,
            entityStatus: null,
            paginationRequestDto: {
              cursor: {
                /*
                 * @TODO
                 * 작동 안 됨. response가 항상 data: null 로 돌아옴.
                 * infinite scroll component 완성 후 전면 수정 예정.
                 */
                uuid: reviewsQueryResult.data.reviewsByCursor.cursor
              },
              count: 50
            }
          }
        }
      });
    }
  }, [inView, boardUuid, reviewsQueryResult]);

  return (
    <section className="space-y-2">
      <div
        className={'m-[16px] font-bold'}
      >{`댓글 ${reviewsQueryResult.data?.reviewsByCursor.data.length}`}</div>
      <BoardPostCommentInputBox
        boardUuid={boardUuid}
        boardIsAnonymous={board.isAnonymous}
        replyTo={replyTo}
        onReplyCancel={() => {
          setReplyTo(undefined);
        }}
      />

      {reviewsQueryResult.data && (
        <>
          <BoardPostCommentList
            boardUuid={boardUuid}
            boardUserUuid={board.user?.uuid}
            reviews={reviewsQueryResult.data.reviewsByCursor.data.filter(isNotNil)}
            onReplyTo={target => {
              setReplyTo(target);
            }}
          />
          {!reviewsQueryResult.loading && <div ref={ref} className="h-1" />}
          <Loader loading={reviewsQueryResult.loading} />
        </>
      )}
    </section>
  );
};

export default BoardPostCommentSection;
