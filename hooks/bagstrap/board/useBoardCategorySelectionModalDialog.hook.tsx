/* eslint-disable react/jsx-key */
import sortBy from 'lodash/sortBy';
import React, { ReactNode, useState, useMemo, useCallback, useEffect } from 'react';

import { isNotNil } from '@utils/common/base.util';

import {
  FaGroupSummaryFragment,
  FaSubGroupType,
  useFaGroupsQuery
} from '@generated/graphql';

import BaseButton from '@common/button/BaseButton';
import BoardCategorySelectionInput from '@common/bagstrap/board/BoardCategorySelectionInput';

import useModalDialog from '@hooks/useModalDialog.hook';

const predicateNotNil = (
  faGroup: FaGroupSummaryFragment | null
): faGroup is Required<FaGroupSummaryFragment> => {
  return isNotNil(faGroup) && isNotNil(faGroup.uuid) && isNotNil(faGroup.name);
};

export default function useBoardCategorySelectionModalDialog(
  uuid?: string,
  onSelect?: (uuid: string) => void,
  blacklist?: string[]
): [
  React.ReactNode,
  (groupUuid?: string) => void,
  () => void,
  (groupUuid: string) => void
] {
  const [selectedGroupUuid, setSelectedGroupUuid] = useState<string | undefined>(uuid);
  const { data } = useFaGroupsQuery();

  useEffect(() => {
    if (uuid) {
      setSelectedGroupUuid(uuid);
    }
  }, [uuid]);

  const sortedFaGroups = useMemo(
    () =>
      data &&
      sortBy(data.FAGroups.filter(predicateNotNil), faGroup => {
        if (faGroup.subGroupType === FaSubGroupType.General) {
          return 0;
        }

        if (
          faGroup.subGroupType === FaSubGroupType.Major ||
          faGroup.subGroupType === FaSubGroupType.Professional
        ) {
          return 1;
        }

        if (faGroup.subGroupType === FaSubGroupType.AfterCourseJob) {
          return 2;
        }

        return 3;
      }),
    [data]
  );

  const handleChangeSelectedGroupUuid = useCallback((uuid: string) => {
    setSelectedGroupUuid(uuid);
  }, []);

  const ModalBody = !!data && (
    <BoardCategorySelectionInput
      faGroups={sortedFaGroups!}
      uuid={selectedGroupUuid}
      onChange={handleChangeSelectedGroupUuid}
      blacklist={blacklist}
    />
  );

  const ModalActions = useMemo(
    (): [ReactNode, ReactNode] => [
      <BaseButton
        onClick={() => {
          closeDialog();
        }}
        className="flex-1 border border-[#566789] border-opacity-[26%] rounded-lg h-[42px]"
      >
        <span className="font-medium text-[#151920] text-base opacity-50">취소</span>
      </BaseButton>,
      <BaseButton
        disabled={!selectedGroupUuid}
        onClick={() => {
          if (selectedGroupUuid) {
            onSelect?.(selectedGroupUuid);

            setSelectedGroupUuid(undefined);
          }
        }}
        className="flex-1 bg-black rounded-lg h-[42px] font-medium text-white text-base"
      >
        선택
      </BaseButton>
    ],
    [onSelect, selectedGroupUuid]
  );

  const [el, openDialog, closeDialog] = useModalDialog({
    body: ModalBody,
    actions: ModalActions
  });

  return [
    el,
    (groupUuid?: string) => {
      openDialog();
    },
    closeDialog,
    groupUuid => {
      setSelectedGroupUuid(groupUuid);
    }
  ];
}
