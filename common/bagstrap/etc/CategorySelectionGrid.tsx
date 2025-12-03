import clsx from 'clsx';
import { useCallback } from 'react';

import { FaGroupSummaryFragment } from '@generated/graphql';

import useAuthenticated from '@hooks/useAuthenticated.hook';

import BaseLink from '@common/BaseLink';

export interface CategorySelectionGridProps {
  faGroups: FaGroupSummaryFragment[];
  title: string;

  onItemSelect?: (groupUuid: string) => void;
}

const CategorySelectionGrid = (props: CategorySelectionGridProps): JSX.Element => {
  const { faGroups, onItemSelect } = props;

  const isAuthenticated = useAuthenticated();

  const onClickFaGroup = useCallback(
    (faGroupUUID: string) => () => {
      onItemSelect?.call(null, faGroupUUID);
    },
    []
  );

  return (
    <div className="py-[24px]">
      <span className="font-bold typo-body5 ">{props.title}</span>

      <div
        className={clsx(
          'grid grid-flow-col gap-x-16 gap-y-4 gap-y-2.5 mt-[16px]',
          'h-fit py-1',
          'grid-rows-6'
        )}
      >
        {props.title === '채용끈' && (
          <>
            <BaseLink key={'career_main'} href={`/careers`}>
              <div className="leading-none">
                <span className="typo-body5">채용끈</span>
              </div>
            </BaseLink>
            {isAuthenticated && (
              <BaseLink key={'bookmarked_career'} href={`/careers/bookmarked`}>
                <div className="leading-none">
                  <span className="typo-body5">북마크한 채용끈</span>
                </div>
              </BaseLink>
            )}
          </>
        )}
        {faGroups.map((faGroup, index) => {
          return (
            <BaseLink
              key={faGroup.uuid || index}
              onClick={onClickFaGroup(faGroup.uuid)}
              href={`/board/${faGroup.uuid}`}
            >
              <div className="leading-none">
                <span className="typo-body5">{faGroup.name}</span>
              </div>
            </BaseLink>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelectionGrid;
