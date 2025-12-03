import clsx from 'clsx';
import React, { useEffect } from 'react';

import {
  BoardDocument,
  EntityType,
  ReviewsDocument,
  useRegisterReviewMutation
} from '@generated/graphql';

import { setErrorUnauthorizedAction } from '@vars/error.var';

import CancelIcon from '@public/icons/[board]cancel.svg';

import BaseButton from '@common/button/BaseButton';
import BaseMultilineTextInput from '@common/input/BaseMultilineTextInput';
import SwitchInput from '@common/input/SwitchInput';

import useAuthenticated from '@hooks/useAuthenticated.hook';
import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import ProfileEmptyIcon from '@public/icons/profile-empty.svg';
import { useStore } from '@stores/useStore.hook';
import useSchoolVerificationNecessaryModalDialog from '@hooks/bagstrap/school/useSchoolVerificationNecessaryModalDialog.hook';

export interface BoardPostCommentInputBoxProps {
  boardUuid: string;

  boardIsAnonymous?: boolean;

  replyTo?: {
    uuid: string;
    name: string;
  };

  onReplyCancel?: () => void;
}

const BoardPostCommentInputBox = (props: BoardPostCommentInputBoxProps): JSX.Element => {
  const { boardUuid, boardIsAnonymous = false, replyTo, onReplyCancel } = props;
  const { FaGroupStore, MeStore } = useStore();
  const up425 = useMediaQuery('(min-width:425px)');

  const [content, setContent] = React.useState('');
  const [isAnonymous, setIsAnonymous] = React.useState(boardIsAnonymous);

  const [modalDialogEl, openModalDialog] = useSchoolVerificationNecessaryModalDialog();

  const isAuthenticated = useAuthenticated();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [registerReview] = useRegisterReviewMutation();

  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  useEffect(() => {
    setContent('');
  }, [boardUuid]);

  return (
    <div
      className={clsx(
        up425 ? 'rounded-[16px] border border-[#ADADAD]' : undefined,
        ' px-[5.5px] space-y-1.2'
      )}
    >
      <Box
        px={up425 ? '28px' : '12px'}
        pt={up425 ? '28px' : '12px'}
        pb={up425 ? '40px' : '12px'}
      >
        {isAuthenticated && (
          <Box mb={'12px'} display={'flex'} gap={'16px'} alignItems={'center'}>
            {MeStore.getMe().profileImage ? (
              <Image
                src={MeStore.getMe().profileImage!}
                className="rounded-full w-6 h-6 lg:w-9 lg:h-9"
                aria-label="profile image"
                alt="profile image"
                width={36}
                height={36}
              />
            ) : (
              <ProfileEmptyIcon
                className="w-6 h-6 lg:w-9 lg:h-9"
                aria-label="empty profile image"
              />
            )}
            <Typography fontSize={'16px'} fontWeight={'bold'}>
              {MeStore.getMe().name}
            </Typography>
          </Box>
        )}
        <Box
          sx={up425 ? undefined : { backgroundColor: '#F2F2F2', borderRadius: '16px' }}
        >
          {isAuthenticated && MeStore.isVerified ? (
            <BaseMultilineTextInput
              borderNone
              ref={inputRef}
              disabled={!isAuthenticated}
              minRows={1}
              maxRows={3}
              inputProps={{
                className: clsx(
                  'rounded-[20px] placeholder:text-[#BFBFBF] placeholder:font-light',
                  'typo-body6 font-medium',
                  'border pr-14 py-2.5',
                  'xl:pl-5',
                  !isAuthenticated && 'cursor-auto',
                  replyTo
                    ? 'border-point-blue !pt-7'
                    : content
                      ? 'border-black'
                      : 'border-grey2'
                )
              }}
              placeholder={
                MeStore.isEmpty()
                  ? '로그인 후 이용해주세요'
                  : up425
                    ? `가방끈이 더욱 풍성해지는 훈훈한 댓글을 남겨주세요. \n커뮤니티의 활성화는 가방끈이 고품질의 콘텐츠를 제공하는데 큰 힘이 됩니다!`
                    : '댓글을 달아주세요'
              }
              value={content}
              onChange={evt => {
                setContent(evt.target.value);
              }}
              onClick={() => {
                if (!isAuthenticated) {
                  setErrorUnauthorizedAction();
                }
              }}
              prefix={
                replyTo ? (
                  <div className={'flex items-center gap-2 '}>
                    <span
                      className={clsx(
                        'text-point-blue typo-body6 font-semibold leading-normal truncate'
                      )}
                    >
                      @{replyTo.name}
                    </span>
                    <div className="flex-between">
                      <div>
                        {replyTo && (
                          <BaseButton
                            className="flex-center bg-[#6990EF] rounded-[10px] pl-1 pr-1.5 h-5"
                            onClick={() => {
                              // TODO
                              onReplyCancel?.call(null);
                            }}
                          >
                            <CancelIcon />
                            <span className="font-medium text-white text-xs">
                              답글취소
                            </span>
                          </BaseButton>
                        )}
                      </div>
                    </div>
                  </div>
                ) : undefined
              }
            />
          ) : (
            <Box
              sx={{ fontSize: '16px', color: '#C2C2C2' }}
              onClick={() => {
                if (!isAuthenticated) {
                  setErrorUnauthorizedAction();
                }

                if (!MeStore.isVerified) {
                  // console.log('not verified');
                  openModalDialog();
                }
              }}
            >
              {!isAuthenticated
                ? '로그인 후 이용해주세요'
                : '학교인증이 필요한 기능입니다.'}
            </Box>
          )}
        </Box>
      </Box>

      {up425 && isAuthenticated && MeStore.isVerified && <Divider />}

      {isAuthenticated && MeStore.isVerified && (
        <div className={'flex flex-row-reverse p-[12px]'}>
          <div
            className={'font-bold cursor-pointer ml-[24px]'}
            onClick={() => {
              if (content) {
                registerReview({
                  variables: {
                    input: {
                      content,
                      isAnonymous,
                      parentEntityType: replyTo ? EntityType.Review : EntityType.Board,
                      parentEntityUuid: replyTo ? replyTo.uuid : boardUuid,
                      parentReviewUuid: replyTo?.uuid
                    }
                  },
                  refetchQueries: [
                    {
                      query: BoardDocument,
                      variables: {
                        uuid: boardUuid
                      }
                    },
                    {
                      query: ReviewsDocument,
                      variables: {
                        input: {
                          parentEntityType: EntityType.Board,
                          parentEntityUuid: boardUuid,
                          entityStatus: null,
                          paginationRequestDto: {
                            count: 10
                          }
                        }
                      }
                    }
                  ],
                  onCompleted: () => {
                    onReplyCancel?.call(null);
                  }
                });

                setContent('');
              }
            }}
          >
            댓글 남기기
          </div>
          <div
            className="flex items-center gap-1 pt-0.5"
            onClick={() => {
              if (!isAuthenticated) {
                setErrorUnauthorizedAction();
              }
            }}
          >
            <span
              className={clsx('typo-body5 leading-none', isAnonymous && 'font-bold ')}
            >
              익명
            </span>
            <SwitchInput
              size={'md'}
              disabled={!isAuthenticated}
              onChange={checked => {
                setIsAnonymous(checked);
              }}
              checked={isAnonymous}
            />
          </div>
        </div>
      )}
      {modalDialogEl}
    </div>
  );
};

export default BoardPostCommentInputBox;
