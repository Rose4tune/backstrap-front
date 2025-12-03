import clsx from 'clsx';
import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { useClickAway } from 'react-use';

import { renderLineBreak } from '@utils/common/render.util';

import { useStore } from '@stores/useStore.hook';

import {
  EntityStatus,
  EntityType,
  ReviewDetailFragment,
  ReviewsDocument,
  SchoolVerificationStatus,
  useDeleteUserInteractionMutation,
  useRegisterUserInteractionMutation,
  UserInteractionType
} from '@generated/graphql';

import { setErrorUnauthorizedAction } from '@vars/error.var';

import ProfileChangerIcon from '@public/icons/profile-changer.svg';
import SchoolVerifiedIcon from '@public/icons/[board]school-state.svg';

import useAuthenticated from '@hooks/useAuthenticated.hook';

import BaseButton from '@common/button/BaseButton';

import EntityMenu from '@common/bagstrap/etc/EntityMenu';
import { DEFAULT_REQUEST_COUNT } from '@constants/request.constant';
import { Divider, IconButton, useMediaQuery } from '@mui/material';
import SeeMoreIcon from '@public/icons/ic-more-small.svg';
import HeartIcon from '@public/icons/ic-heart-small.svg';
import OutLinedHeartIcon from '@public/icons/ic-heart-small-outlined.svg';
import useSchoolVerificationNecessaryModalDialog from '@hooks/bagstrap/school/useSchoolVerificationNecessaryModalDialog.hook';

export interface BoardPostCommentBoxProps {
  boardUuid: string;

  review: ReviewDetailFragment;

  userName: string;

  isReply?: boolean;

  onReply?: () => void;
}

const BoardPostCommentBox = (props: BoardPostCommentBoxProps): JSX.Element => {
  const up425 = useMediaQuery('(min-width:425px)');

  const { boardUuid, review, userName, isReply, onReply } = props;

  const { MeStore } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [modalDialogEl, openModalDialog] = useSchoolVerificationNecessaryModalDialog();

  const menuRef = React.useRef(null);

  useClickAway(menuRef, () => {
    setIsMenuOpen(false);
  });

  const isAuthenticated = useAuthenticated();

  const [registerUserInteraction] = useRegisterUserInteractionMutation();
  const [deleteUserInteraction] = useDeleteUserInteractionMutation();

  const _userName = useMemo(() => {
    if (review.user?.schoolVerificationStatus === SchoolVerificationStatus.Approved) {
      const [name, school] = userName.split(' | ');
      return (
        <>
          {name}
          <span className="font-normal"> | {school}</span>
        </>
      );
    } else {
      return userName;
    }
  }, [review.user?.schoolVerificationStatus, userName]);

  const profileSize = 45;

  return (
    // <div
    //   className={clsx(
    //     "w-full flex gap-3 rounded-xl p-3",
    //     MeStore.getUUID() === review.user?.uuid &&
    //       !(review.entityStatus === EntityStatus.Deleted)
    //       ? "border-[3px] border-primary-dark-light"
    //       : "border border-[#E5E5EB]",
    //     review.entityStatus === EntityStatus.Deleted && "items-center"
    //   )}
    // >
    <div
      className={clsx(
        `w-full flex gap-3 p-[20px]`,
        // MeStore.getUUID() === review.user?.uuid &&
        // !(review.entityStatus === EntityStatus.Deleted)
        // ? "border-[3px] border-primary-dark-light"
        // : "border border-[#E5E5EB]",
        review.entityStatus === EntityStatus.Deleted && 'items-center'
      )}
    >
      {review.entityStatus === EntityStatus.Deleted ? (
        <p className="text-grey4 typo-body5">작성자가 삭제한 댓글입니다.</p>
      ) : (
        <>
          {!review.isAnonymous && (
            <>
              {review.user?.profileImage ? (
                <img
                  className={`w-[45px] h-[45px] rounded-full overflow-hidden`}
                  src={review.user.profileImage}
                />
              ) : (
                <ProfileChangerIcon className={`w-[45px] h-[45px]`} />
              )}
            </>
          )}
          <div className={clsx('flex-1', 'space-y-2')}>
            <div className="flex-between leading-none">
              {/* writer */}
              <span className="typo-body5 font-bold break-al flex item-center gap-x-1">
                {_userName}
                {review.user?.schoolVerificationStatus ===
                  SchoolVerificationStatus.Approved && <SchoolVerifiedIcon />}
              </span>

              {/* actions */}
              <div className="flex items-center gap-3">
                <div ref={menuRef} className="relative">
                  <IconButton
                    sx={{ width: '20px', height: '20px' }}
                    onClick={() => {
                      setIsMenuOpen(prev => !prev);
                    }}
                  >
                    <SeeMoreIcon />
                  </IconButton>

                  <EntityMenu
                    className={clsx(
                      'translate-y-full -bottom-1.5 -right-4',
                      isMenuOpen ? 'block' : 'hidden'
                    )}
                    entityType={EntityType.Review}
                    uuid={review.uuid}
                    parent={
                      review.parentEntityType && review.parentEntityUuid
                        ? {
                            entityType: review.parentEntityType,
                            uuid: review.parentEntityUuid
                          }
                        : {
                            entityType: EntityType.Board,
                            uuid: boardUuid
                          }
                    }
                    user={
                      review.user?.uuid
                        ? {
                            uuid: review.user?.uuid,
                            name: userName,
                            isAnonymous: !!review.isAnonymous
                          }
                        : undefined
                    }
                    title={review.content}
                    isMine={
                      isAuthenticated &&
                      !MeStore.isEmpty() &&
                      !!review.user?.uuid &&
                      review.user.uuid === MeStore.getUUID()
                    }
                  />
                </div>
              </div>
            </div>

            {/* content */}
            <p className="pt-[12px] typo-body5 leading-tight break-all md:mr-24">
              {review.content && renderLineBreak(review.content)}
            </p>

            <div className="pt-[16px] flex items-center gap-6">
              <BaseButton
                onClick={() => {
                  if (!isAuthenticated) {
                    setErrorUnauthorizedAction();
                    return;
                  }

                  const refetchQueries = [
                    {
                      query: ReviewsDocument,
                      variables: {
                        input: {
                          parentEntityType: EntityType.Board,
                          parentEntityUuid: boardUuid,
                          entityStatus: null,
                          paginationRequestDto: {
                            count: DEFAULT_REQUEST_COUNT
                          }
                        }
                      }
                    }
                  ];

                  if (review.isLikedByMe) {
                    deleteUserInteraction({
                      variables: {
                        input: {
                          parentEntityType: EntityType.Review,
                          parentEntityUuid: review.uuid,
                          userInteractionType: UserInteractionType.Like
                        }
                      },
                      refetchQueries
                    });
                  } else {
                    registerUserInteraction({
                      variables: {
                        input: {
                          parentEntityType: EntityType.Review,
                          parentEntityUuid: review.uuid,
                          userInteractionType: UserInteractionType.Like
                        }
                      },
                      refetchQueries
                    });
                  }
                }}
                className={clsx('flex-center gap-2 ')}
              >
                {review.isLikedByMe ? <HeartIcon /> : <OutLinedHeartIcon />}
                <span>{review.likeCount}</span>
              </BaseButton>

              {!isReply && (
                <BaseButton
                  onClick={() => {
                    if (!isAuthenticated) {
                      setErrorUnauthorizedAction();
                      return;
                    }

                    if (!MeStore.isVerified) {
                      openModalDialog();
                    } else {
                      onReply?.call(null);
                    }
                  }}
                >
                  답글달기
                  {/*<ReplyIcon/>*/}
                </BaseButton>
              )}
            </div>
          </div>
        </>
      )}
      {modalDialogEl}
    </div>
  );
};

export default observer(BoardPostCommentBox);
