import clsx from 'clsx';
import uniqBy from 'lodash/uniqBy';

import { isNotNil } from '@utils/common/base.util';

import {
  EntityStatus,
  ReviewDetailFragment,
  SchoolVerificationStatus
} from '@generated/graphql';

import PolygonIcon from '@public/icons/[board]polygon.svg';
import ReplyIcon from '@public/icons/ic-reply.svg';

import BoardPostCommentBox from './BoardPostCommentBox';
import { resolveAnonymousUserName } from '@utils/bagstrap/review.utils';
import { Divider, useMediaQuery } from '@mui/material';
import React from 'react';

export interface BoardPostCommentListProps {
  boardUuid: string;

  boardUserUuid?: string | null;

  reviews: ReviewDetailFragment[];

  onReplyTo?: (target: { uuid: string; name: string }) => void;
}

const BoardPostCommentList = (props: BoardPostCommentListProps): JSX.Element => {
  const { boardUuid, boardUserUuid, reviews, onReplyTo } = props;
  const up425 = useMediaQuery('(min-width:425px)');

  return (
    <ul className="space-y-2">
      {reviews.map((review, index) => {
        const anonymousReviews = uniqBy(
          reviews
            .filter(review => review.isAnonymous)
            .concat(
              review.childReviews?.filter(isNotNil).filter(reply => reply?.isAnonymous) ??
                []
            ),
          'user.uuid'
        ).filter(review => review.user?.uuid !== boardUserUuid);

        const userName = resolveAnonymousUserName(reviews, review, boardUserUuid);

        return (
          <li key={review.uuid || index} className="">
            {!up425 && <Divider />}

            <BoardPostCommentBox
              boardUuid={boardUuid}
              review={review}
              userName={userName}
              onReply={() => {
                onReplyTo?.call(null, {
                  uuid: review.uuid,
                  name: userName
                });
              }}
            />
            {up425 && <Divider sx={{ mt: '5px' }} />}

            {review.childReviews && (
              <ul className="space-y-2 bg-[#F7F7F7] mt-0 mb-[-10px]">
                {review.childReviews.filter(isNotNil).map((reply, index) => {
                  const userName = resolveAnonymousUserName(
                    reviews,
                    reply,
                    boardUserUuid
                  );

                  return (
                    <>
                      <li key={reply.uuid || index} className="flex gap-1">
                        <ReplyIcon
                          className={clsx(
                            'mt-[24px] ml-[24px]',
                            reply.entityStatus === EntityStatus.Deleted
                              ? 'text-grey4'
                              : 'text-black'
                          )}
                        />
                        <BoardPostCommentBox
                          boardUuid={boardUuid}
                          review={reply}
                          userName={userName}
                          isReply
                        />
                      </li>
                    </>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default BoardPostCommentList;
