import clsx from 'clsx';
import React from 'react';

import { VoteRegisterDtoInput } from '@generated/graphql';

import VoteDeleteIcon from '@public/icons/[board]vote-delete.svg';
import VoteIcon from '@public/icons/[board]vote.svg';

import BaseButton from '@common/button/BaseButton';

import useBoardPostVoteRegisterModalDialog from '@hooks/bagstrap/board/useBoardPostVoteRegisterModalDialog.hook';

export interface BoardPostVoteRegisterButtonProps {
  disabled?: boolean;

  dtoInput?: VoteRegisterDtoInput;

  onRegister?: (input: VoteRegisterDtoInput) => void;

  onDelete?: () => void;
}

const BoardPostVoteRegisterButton = (
  props: BoardPostVoteRegisterButtonProps
): JSX.Element => {
  const { disabled, dtoInput, onRegister, onDelete } = props;

  const [boardVoteRegisterModalDialogEl, openBoardVoteRegisterModalDialog, ,] =
    useBoardPostVoteRegisterModalDialog(dtoInput, onRegister);

  return (
    <BaseButton
      className={clsx(
        'flex-between gap-1 h-8 px-2 border border-grey5 rounded-[4px] max-w-[200px]',
        'text-grey5 text-xs font-bold',
        'lg:h-10 lg:px-4 lg:rounded-[10px] lg:border-2 lg:typo-body5',
        disabled && 'bg-grey1'
      )}
      onClick={() => {
        openBoardVoteRegisterModalDialog(dtoInput);
      }}
      disabled={disabled}
    >
      {boardVoteRegisterModalDialogEl}
      <VoteIcon className="w-4 h-[17px] flex-shrink-0" />
      <span className="truncate">
        {dtoInput ? dtoInput.title.split('\n')[0] : '투표 만들기'}
      </span>
      {dtoInput && !disabled && (
        <BaseButton
          disabled={disabled}
          onClick={() => {
            onDelete?.call(null);
          }}
          className="flex-shrink-0"
        >
          <VoteDeleteIcon />
        </BaseButton>
      )}
    </BaseButton>
  );
};

export default BoardPostVoteRegisterButton;
