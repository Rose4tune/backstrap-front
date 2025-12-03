import clsx from 'clsx';
import React from 'react';

import { isNotNil } from '@utils/common/base.util';

import { useFaGroupsQuery } from '@generated/graphql';

import ListOpenIcon from '@public/icons/[board]list-open.svg';

import BaseButton from '@common/button/BaseButton';

import useBoardCategorySelectionModalDialog from '@hooks/bagstrap/board/useBoardCategorySelectionModalDialog.hook';

export interface BoardCategorySelectionButtonProps {
  groupUuid?: string;

  onSelect?: (groupUuid: string) => void;

  disabled?: boolean;
}

const BoardCategorySelectionButton = (
  props: BoardCategorySelectionButtonProps
): JSX.Element => {
  const { groupUuid, onSelect, disabled } = props;

  const [selectedGroupUuid, setSelectedGroupUuid] = React.useState(groupUuid);

  const faGroupsQueryResult = useFaGroupsQuery();

  const blacklist = faGroupsQueryResult.data?.FAGroups.filter(isNotNil)
    .filter((faGroup: any) => !faGroup.writable)
    .map((faGroup: any) => faGroup.uuid);

  const [
    boardCategorySelectionModalDialogEl,
    openBoardCategorySelectionModalDialog,
    closeBoardCategorySelectionModalDialog
  ] = useBoardCategorySelectionModalDialog(
    !!groupUuid && !blacklist?.includes(groupUuid) ? groupUuid : undefined,
    (groupUuid: string) => {
      setSelectedGroupUuid(groupUuid);

      onSelect?.call(null, groupUuid);

      closeBoardCategorySelectionModalDialog();
    },
    blacklist
  );

  React.useEffect(() => {
    if (groupUuid) {
      setSelectedGroupUuid(groupUuid);
    }
  }, [groupUuid]);

  return (
    <BaseButton
      className={clsx(
        'flex-center gap-1 h-8 px-2 max-w-[160px] border border-point-blue rounded-[4px]',
        'text-point-blue text-xs font-bold',
        'lg:h-10 lg:px-4 lg:rounded-[10px] lg:border-2 lg:typo-body5',
        disabled && 'bg-grey1'
      )}
      onClick={() => {
        openBoardCategorySelectionModalDialog(selectedGroupUuid);
      }}
      disabled={disabled}
    >
      {boardCategorySelectionModalDialogEl}
      <ListOpenIcon className="flex-shrink-0" />
      <span className="truncate">
        {selectedGroupUuid && blacklist?.every((uuid: any) => uuid !== selectedGroupUuid)
          ? faGroupsQueryResult.data?.FAGroups.filter(isNotNil).find(
              (faGroup: any) => faGroup.uuid === selectedGroupUuid
            )?.name
          : '카테고리 선택'}
      </span>
    </BaseButton>
  );
};

export default BoardCategorySelectionButton;
