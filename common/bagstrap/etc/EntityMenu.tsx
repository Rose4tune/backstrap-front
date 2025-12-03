import concat from 'lodash/concat';
import clsx from 'clsx';
import React from 'react';
import { useRouter } from 'next/router';

import { BOARD_VERSION_NEW } from '@constants/bagstrap/board.constant';

import {
  EntityType,
  FaGroupSummaryFragment,
  UserSummaryFragment
} from '@generated/graphql';

import { setErrorUnauthorizedAction } from '@vars/error.var';

import MenuBoxSingle from '@public/images/[board]menu-box-single.svg';
import MenuBoxDouble from '@public/images/[board]menu-box-double.svg';
import MenuBoxTriple from '@public/images/[board]menu-box-triple.svg';

import useAuthenticated from '@hooks/useAuthenticated.hook';
import useUserReportModalDialog from '@hooks/bagstrap/user/useUserReportModalDialog.hook';
import useBlockInteractionModalDialog from '@hooks/bagstrap/user/useBlockInteractionModalDialog.hook';
import useBoardDeleteModalDialog from '@hooks/bagstrap/board/useBoardDeleteModalDialog.hook';
import useReviewDeleteModalDialog from '@hooks/bagstrap/user/useReviewDeleteModalDialog.hook';

import { BoardType } from '@enums/board/board.enum';
import { useMediaQuery } from '@mui/material';
import { useStore } from '@stores/useStore.hook';

export interface EntityMenuProps extends BaseProps {
  entityType: EntityType;

  uuid: string;

  version?: number;

  title?: string | null;

  user?: Pick<UserSummaryFragment, 'uuid' | 'name'> & { isAnonymous?: boolean };

  category?: NilableProps<Pick<FaGroupSummaryFragment, 'uuid' | 'name' | 'code'>> | null;

  parent?: {
    entityType: EntityType;
    uuid: string;
  };

  isMine?: boolean;

  sourceUrl?: string;
}

const EntityMenu = (props: EntityMenuProps): JSX.Element => {
  const {
    className,
    entityType,
    uuid,
    version,
    title,
    user,
    category,
    parent,
    isMine,
    sourceUrl
  } = props;

  const router = useRouter();

  const isAuthenticated = useAuthenticated();

  const [userInteractionBlockModalDialogEl, openUserInteractionBlockModalDialog] =
    useBlockInteractionModalDialog(entityType, uuid, user, category, sourceUrl);

  const isMobile = useMediaQuery('(max-width:550px)');
  const { HeaderStore } = useStore()

  const [userReportModalDialogEl, openUserReportModalDialog] = useUserReportModalDialog(
    entityType,
    uuid,
    user,
    title
  );

  const [boardDeleteModalDialogEl, openBoardDeleteModalDialog] =
    useBoardDeleteModalDialog(uuid, BoardType.POST, title, category, sourceUrl);

  const [reviewDeleteModalDialogEl, openReviewDeleteModalDialog] =
    useReviewDeleteModalDialog(uuid, title, parent);

  const menus = React.useMemo(
    () =>
      isMine
        ? concat(
          entityType === EntityType.Board && version === BOARD_VERSION_NEW
            ? {
              label: '수정하기',
              action: () => {
                if (entityType === EntityType.Board) {
                  router.push(`/board/post/write?uuid=${uuid}`);
                }
              }
            }
            : [],
          {
            label: '삭제하기',
            action: () => {
              if (entityType === EntityType.Board) {
                openBoardDeleteModalDialog();
              }

              if (entityType === EntityType.Review) {
                openReviewDeleteModalDialog();
              }
            }
          }
        )
        : [
          {
            label: '사용자 차단',
            action: () => {
              openUserInteractionBlockModalDialog();
            }
          },
          {
            label: '신고하기',
            action: () => {
              openUserReportModalDialog();
            }
          }
        ].concat(
          entityType !== EntityType.User
            ? [
              {
                label: '쪽지 보내기',
                action: () => {
                  if (user) {
                    if (isMobile) {
                      router.push(
                        `/my/alarm/message/send?uuid=${uuid}&partnerUuid=${user?.uuid}&type=${"BOARD"}`
                      )
                    } else {
                      HeaderStore.setIsSendMessageOpen(true)
                      HeaderStore.setType("BOARD")
                      HeaderStore.setUuid(uuid)
                    }
                  }
                }
              }
            ]
            : []
        ),
    [entityType, uuid, version, user, isMine]
  );

  return (
    <div className={clsx('absolute z-50', className)}>
      {menus.length === 1 && <MenuBoxSingle className="absolute inset-0" />}
      {menus.length === 2 && <MenuBoxDouble className="absolute inset-0" />}
      {menus.length === 3 && <MenuBoxTriple className="absolute inset-0" />}
      <ul
        className={clsx(
          'flex flex-col justify-between items-center px-1 pt-2 z-50',
          'typo-body8 font-medium text-grey5'
        )}
      >
        {menus.map(({ label, action }, index) => (
          <li
            key={index}
            onClick={() => {
              if (isAuthenticated) {
                action();
              } else {
                setErrorUnauthorizedAction();
              }
            }}
            className={clsx(
              'w-[124px] h-[46px] z-50',
              'flex-center cursor-pointer',
              'hover:font-bold hover:underline typo-body5',
              index + 1 < menus.length && 'border-b border-[#E5E5EB] border-opacity-75'
            )}
          >
            {label}
          </li>
        ))}
      </ul>
      {userInteractionBlockModalDialogEl}
      {userReportModalDialogEl}
      {boardDeleteModalDialogEl}
      {reviewDeleteModalDialogEl}
    </div>
  );
};

export default EntityMenu;
