import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useMeasure } from 'react-use';

import { isNotNil } from '@utils/common/base.util';

import {
  FaGroupSummaryFragment,
  FaSubGroupType,
  useFaGroupsQuery
} from '@generated/graphql';

import ListOpenIcon from '@public/icons/[layout]list-open.svg';
import ListOpenUpIcon from '@public/icons/[layout]list-open-up.svg';

import BaseButton from '@common/button/BaseButton';

import CategorySelectionGrid from './CategorySelectionGrid';
import BaseLink from '@common/BaseLink';
import { Box, Divider, List, ListItemButton, Typography } from '@mui/material';

export interface CategorySelectionPanelProps {
  open?: boolean;

  onClose?: (groupUuid?: string) => void;
}

const CategorySelectionPanel = (props: CategorySelectionPanelProps): JSX.Element => {
  const { open } = props;

  const faGroupsQueryResult = useFaGroupsQuery({});

  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const onSelectFaGroupsBySubGroupType = useCallback(
    (subGroupType: FaSubGroupType): FaGroupSummaryFragment[] =>
      faGroupsQueryResult.data
        ? faGroupsQueryResult.data.FAGroups.filter(isNotNil).filter(
            (faGroups: any) => faGroups.subGroupType === subGroupType
          )
        : [],
    [faGroupsQueryResult.data]
  );

  const faGroupSubGroupType_MajorAndProfessional = useMemo(
    () => [
      ...onSelectFaGroupsBySubGroupType(FaSubGroupType.Major),
      ...onSelectFaGroupsBySubGroupType(FaSubGroupType.Professional)
    ],
    [onSelectFaGroupsBySubGroupType]
  );

  const panelStyle = useMemo(
    () => ({
      height: open ? height + 24 : 0
    }),
    [open, height]
  );

  return (
    <div
      className={clsx(
        'hidden lg:block',
        'bg-[#FAFAFA] px-10 overflow-hidden',
        'transition-all duration-[0.5s] delay-[0s] ease-in-out'
      )}
      style={panelStyle}
    >
      {faGroupsQueryResult.data && (
        <div ref={ref} className={clsx('flex justify-between', 'my-3')}>
          <hr className="border-t-0 border-r h-auto border-[#E5E5EB]" />
          <CategorySelectionGrid
            title={'커뮤니티'}
            faGroups={onSelectFaGroupsBySubGroupType(FaSubGroupType.General)}
          />
          <hr className="border-t-0 border-r h-auto border-[#E5E5EB]" />
          <CategorySelectionGrid
            title={'전공별게시끈'}
            faGroups={faGroupSubGroupType_MajorAndProfessional}
          />

          <hr className="border-t-0 border-r h-auto border-[#E5E5EB]" />
          <CategorySelectionGrid
            title={'채용끈'}
            faGroups={onSelectFaGroupsBySubGroupType(FaSubGroupType.AfterCourseJob)}
          />

          <hr className="border-t-0 border-r h-auto border-[#E5E5EB]" />
          <div
            className={clsx(
              'grid grid-flow-col gap-x-16 gap-y-2.5',
              'h-fit py-1',
              'grid-rows-4'
            )}
          >
            {/* <BaseLink
                            key={`mall`}
                            href={`/mall`}
                        >
                            <div className="leading-none">
                                <span className="typo-body7">논문 업끈레이드</span>
                            </div>
                        </BaseLink> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelectionPanel;

export const CategorySelectionPanelHandleButton = ({
  open,
  onClick,
  groupUuid
}: {
  open?: boolean;
  onClick?: () => void;
  groupUuid?: string;
}): JSX.Element => {
  const faGroupsQueryResult = useFaGroupsQuery();

  return (
    <BaseButton
      onClick={onClick}
      className={clsx(
        'absolute bottom-0',
        'flex-center gap-1',
        'bg-primary-light rounded-t-[20px] min-w-[92px] px-4',
        'transition-all duration-[0.5s] delay-[0s] ease-out',
        open
          ? 'flex-col-reverse gap-1.5 border-t border-l border-r border-[#E5E5EB] -bottom-[1px] h-16'
          : 'h-10'
      )}
    >
      {open ? <ListOpenUpIcon /> : <ListOpenIcon />}
      <span className="font-bold typo-body8 underline">
        {open
          ? '접기'
          : faGroupsQueryResult.data?.FAGroups.find(
              (faGroup: any) => faGroup?.uuid === groupUuid
            )?.name ?? '카테고리'}
      </span>
    </BaseButton>
  );
};
