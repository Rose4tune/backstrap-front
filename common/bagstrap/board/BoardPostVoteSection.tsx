import orderBy from 'lodash/orderBy';

import clsx from 'clsx';
import React from 'react';

import {
  BoardMyDocument,
  useEditVoteMutation,
  VoteDetailFragment
} from '@generated/graphql';

import { isNotNil } from '@utils/common/base.util';
import { divide, formatNumberDisplay, sum } from '@utils/common/number.util';
import { formatDateDisplay } from '@utils/common/date.util';
import { renderLineBreak } from '@utils/common/render.util';

import { setErrorUnauthorizedAction } from '@vars/error.var';

import { DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI } from '@constants/common/date.constant';

import VoteIcon from '@public/icons/[board]vote.svg';

import useAuthenticated from '@hooks/useAuthenticated.hook';
import useBoardPostVoteEditDoneModalDialog from '@hooks/bagstrap/board/useBoardPostVoteEditDoneModalDialog';

import BaseButton from '@common/button/BaseButton';
import BaseRadioInput from '@common/input/BaseRadioInput';
import BaseCheckInput from '@common/input/BaseCheckInput';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

export interface BoardPostVoteSectionProps {
  vote: VoteDetailFragment;

  boardUuid: string;

  isBoardMine?: boolean;
}

const BoardPostVoteSection = (props: BoardPostVoteSectionProps): JSX.Element => {
  const { vote, boardUuid, isBoardMine } = props;

  const voteContents = vote.contents.filter(isNotNil);

  const isVoted = voteContents.some(content => content?.isVoted);

  const numVoted = sum(voteContents.map(content => content.numVote).filter(isNotNil));

  const [isVoting, setIsVoting] = React.useState(!vote.isDone && !isVoted);

  const [selectedContentUuids, setSelectedContentUuids] = React.useState<string[]>([]);

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const isMultiSelect = vote.numChoice !== 1;

  const isAuthenticated = useAuthenticated();

  const [editVote] = useEditVoteMutation();

  const [boardPostVoteEditDoneModalDialogEl, openBoardPostVoteEditDoneModalDialog] =
    useBoardPostVoteEditDoneModalDialog(vote, boardUuid);

  const handleVoteItemSelect = (contentUuid: string) => {
    if (isMultiSelect) {
      setSelectedContentUuids(prev => {
        const newArr = Array.from(prev);

        const index = newArr.indexOf(contentUuid);

        if (index < 0) {
          newArr.push(contentUuid);
        } else {
          newArr.splice(index, 1);
        }

        return newArr;
      });
    } else {
      setSelectedContentUuids([contentUuid]);
    }
  };

  const handleVoteParticipate = () => {
    if (!isAuthenticated) {
      setErrorUnauthorizedAction();

      return;
    }

    if (isVoting) {
      vote.uuid &&
        editVote({
          variables: {
            input: {
              uuid: vote.uuid,
              selectedContentUuids
            }
          },
          refetchQueries: [
            {
              query: BoardMyDocument,
              variables: {
                uuid: boardUuid
              }
            }
          ],
          awaitRefetchQueries: true,
          onCompleted: () => {
            setIsVoting(false);
            setSelectedContentUuids([]);
            setErrorMessage(undefined);
          },
          onError: err => {
            setIsVoting(false);
            setErrorMessage(err.message);
          }
        });
    } else {
      setIsVoting(true);
    }
  };

  React.useEffect(() => {
    setIsVoting(!vote.isDone && !isVoted);
  }, [isVoted, vote.isDone]);

  return (
    <section className="border border-grey2 rounded-2xl max-w-sm px-6 py-4 space-y-3">
      {boardPostVoteEditDoneModalDialogEl}

      <div className="space-y-4">
        {/* title */}
        <div className="flex items-center gap-2.5 text-grey5">
          <VoteIcon className="w-4 h-[17px]" />
          <p className="font-bold typo-body7 break-all">{renderLineBreak(vote.title)}</p>
        </div>
        {/* info */}
        <div className="text-grey5 typo-body9 leading-none">
          {vote.numParticipant}명 참여 | 복수선택 {isMultiSelect ? '가능' : '불가능'} |{' '}
          {vote.deadline
            ? formatDateDisplay(vote.deadline, DATE_FORMAT_DISPLAY_YYYY_MM_DD_D_A_HH_MI)
            : '작성자가 종료시 마감'}
        </div>
      </div>

      {/* items */}
      <ul className="space-y-2">
        {orderBy(
          voteContents,
          isVoting ? [] : ['numVote', 'content'],
          isVoting ? [] : ['desc', 'asc']
        ).map((content, index) => {
          const contentUuid = content.uuid;

          const isSelected = selectedContentUuids.some(
            selectedUuid => selectedUuid === contentUuid
          );

          return (
            <li
              key={content.uuid || index}
              className={clsx(
                'relative rounded-[4px] min-h-[40px]',
                (isVoting ? isSelected : content.isVoted)
                  ? 'border-[1.5px] border-primary'
                  : 'border border-grey2'
              )}
            >
              <BaseButton
                fullWidth
                disabled={!isVoting}
                center={false}
                className={clsx('absolute inset-0 z-10 flex-between gap-2.5 px-3 py-2.5')}
                onClick={() => {
                  if (isVoting && contentUuid) {
                    handleVoteItemSelect(contentUuid);
                  }
                }}
              >
                <div
                  className={clsx(
                    'flex-1',
                    'text-left typo-body5 leading-none break-all',
                    (isVoting ? isSelected : content.isVoted)
                      ? 'text-primary font-bold'
                      : 'text-black font-light'
                  )}
                >
                  {content.content}
                </div>
                {isVoting ? (
                  isMultiSelect ? (
                    <BaseCheckInput
                      value={contentUuid || index}
                      checked={isSelected}
                      onChange={() => {}}
                    />
                  ) : (
                    <BaseRadioInput
                      value={contentUuid || index}
                      checked={isSelected}
                      onChange={() => {}}
                    />
                  )
                ) : (
                  <span className="typo-body9 font-bold">
                    {formatNumberDisplay(content.numVote || 0)}표
                  </span>
                )}
              </BaseButton>
              <div
                className={clsx(
                  'absolute top-0 left-0 bottom-0',
                  'rounded-[4px]',
                  content.isVoted ? 'bg-primary bg-opacity-10' : 'bg-grey1'
                )}
                style={{
                  width: !isVoting
                    ? `${divide(content.numVote, numVoted) * 100}%`
                    : undefined
                }}
              />
            </li>
          );
        })}
      </ul>

      {/* actions */}
      {!vote.isDone && (
        <div className="flex items-center gap-2 pt-2">
          {isBoardMine ? (
            <>
              <BaseButton
                fullWidth
                disabled={isVoting && selectedContentUuids.length === 0}
                onClick={() => {
                  handleVoteParticipate();
                }}
                className={clsx(
                  'h-8 rounded-lg text-white typo-body7 font-medium',
                  isVoting
                    ? selectedContentUuids.length > 0
                      ? 'bg-primary'
                      : 'bg-grey2'
                    : 'bg-grey4'
                )}
              >
                {isVoting ? '투표 참여' : '다시 투표하기'}
              </BaseButton>
              <BaseButton
                fullWidth
                onClick={() => {
                  openBoardPostVoteEditDoneModalDialog();
                }}
                className="bg-black h-8 rounded-lg text-white typo-body7 font-medium"
              >
                투표 마감
              </BaseButton>
            </>
          ) : (
            <>
              <BaseButton
                fullWidth
                disabled={isVoting && selectedContentUuids.length === 0}
                onClick={() => {
                  handleVoteParticipate();
                }}
                className={clsx(
                  'h-8 rounded-lg text-white typo-body7 font-medium',
                  isVoted
                    ? 'bg-grey4'
                    : selectedContentUuids.length > 0
                      ? 'bg-primary'
                      : 'bg-grey2'
                )}
              >
                {isVoted ? '다시 투표하기' : '투표 참여 및 결과 보기'}
              </BaseButton>
            </>
          )}
        </div>
      )}

      {errorMessage && <HelperMessage type="error" text={errorMessage} />}
    </section>
  );
};

export default BoardPostVoteSection;
