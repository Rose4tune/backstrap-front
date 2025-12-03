import clsx from 'clsx';
import { useRouter } from 'next/router';

import { BoardDetailFragment } from '@generated/graphql';

import BaseLink from '@common/BaseLink';
import ErrorMessage from '@common/bagstrap/etc/ErrorMessage';

import BoardPostListItem from './BoardPostListItem';
import { observer } from 'mobx-react-lite';
import { useStore } from '@stores/useStore.hook';
import { checkAuthenticated } from '@utils/auth/auth.util';
import { setErrorUnauthorizedAction } from '@vars/error.var';
import AuthContext from '@contexts/auth.context';
import React from 'react';

export interface BoardPostListProps {
  showCategory?: boolean;
}

const BoardPostList = (props: BoardPostListProps): JSX.Element => {
  const { showCategory } = props;

  const router = useRouter();
  const { BoardStore } = useStore();

  const { FaGroupStore } = useStore();
  const { data } = BoardStore;

  const auth = React.useContext(AuthContext);

  const faGroup = FaGroupStore.getFaGroupsByUUID(BoardStore.categoryUUID || '');

  return (
    <>
      {!BoardStore.isEmpty ? (
        <ul className={clsx('grid grid-cols-1', 'lg:grid-cols-2 lg:child-odd:border-r')}>
          {data.list.map((board, index) => (
            <BaseLink
              key={board.uuid || index}
              onClick={() => {
                if (!checkAuthenticated(auth.authPayload) && faGroup?.code == 'INFO') {
                  setErrorUnauthorizedAction();
                  return;
                }
                router.push(`/board/post/${board.uuid}`);
              }}
              className={clsx('px-3', 'md:px-4', 'lg:px-0')}
            >
              <BoardPostListItem board={board} showCategory={showCategory} />
            </BaseLink>
          ))}
        </ul>
      ) : (
        <ErrorMessage text="글이 존재하지 않습니다." />
      )}
    </>
  );
};

export default observer(BoardPostList);
