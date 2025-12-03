import React from 'react';

import { renderLineBreak } from '@utils/common/render.util';
import { formatNumberDisplay } from '@utils/common/number.util';
import { formatDateDisplay } from '@utils/common/date.util';

import { DATE_FORMAT_DISPLAY_YYYY_MM_DD_A_HH_MI } from '@constants/common/date.constant';

import {
  BoardMyDocument,
  useEditVoteMutation,
  VoteSummaryFragment
} from '@generated/graphql';

import VoteIcon from '@public/icons/[board]vote.svg';

import BaseButton from '@common/button/BaseButton';
import HelperMessage from '@common/bagstrap/etc/HelperMessage';

import useModalDialog from '@hooks/useModalDialog.hook';

export default function useBoardPostVoteEditDoneModalDialog(
  vote: VoteSummaryFragment,
  boardUuid: string
): [React.ReactNode, () => void, () => void] {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const [editVote] = useEditVoteMutation();

  const [el, openDialog, closeDialog] = useModalDialog(
    {
      size: 'md',
      header: <VoteIcon className="text-black w-10 h-10" />,
      body: (
        <div className="space-y-4 pb-2">
          <p className="typo-body1 font-bold">투표를 마감할까요?</p>
          <p className="typo-body4 font-semibold text-point-red">
            마감 후에는 재오픈할 수 없습니다.
          </p>

          <ul className="px-6 typo-body5">
            <li className="list-disc break-all">
              투표 제목 : {renderLineBreak(vote.title)}
            </li>
            <li className="list-disc">
              총 참여자 수 : {formatNumberDisplay(vote.numParticipant)}명
            </li>
            {vote.deadline && (
              <li className="list-disc break-all">
                예정 마감시간 :{' '}
                {formatDateDisplay(vote.deadline, DATE_FORMAT_DISPLAY_YYYY_MM_DD_A_HH_MI)}
              </li>
            )}
          </ul>

          {errorMessage && <HelperMessage type="error" text={errorMessage} />}
        </div>
      ),
      actions: [
        <BaseButton
          onClick={() => {
            closeDialog();
          }}
          className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
        >
          <span className="text-[#151920] opacity-50 typo-body6 font-semibold">취소</span>
        </BaseButton>,
        <BaseButton
          onClick={() => {
            if (vote.uuid) {
              editVote({
                variables: {
                  input: {
                    uuid: vote.uuid,
                    isDone: true
                  }
                },
                onCompleted: () => {
                  closeDialog();
                },
                onError: err => {
                  setErrorMessage(err.message);
                },
                refetchQueries: [
                  {
                    query: BoardMyDocument,
                    variables: {
                      uuid: boardUuid
                    }
                  }
                ],
                awaitRefetchQueries: true
              });
            }
          }}
          className="flex-1 bg-black rounded-lg h-[42px] text-white typo-body6 font-semibold"
        >
          지금 마감하기
        </BaseButton>
      ]
    },
    () => {
      setErrorMessage(undefined);
    }
  );

  return [el, openDialog, closeDialog];
}
