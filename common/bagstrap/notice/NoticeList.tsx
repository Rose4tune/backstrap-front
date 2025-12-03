import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useStore } from '@stores/useStore.hook';
import BaseLink from '@common/BaseLink';
import ErrorMessage from '@common/bagstrap/etc/ErrorMessage';
import NoticeListItem from './NoticeListItem';

const NoticesList = (): JSX.Element => {
  const { NoticeStore } = useStore();
  const { data } = NoticeStore;

  return (
    <>
      {!NoticeStore.isEmpty ? (
        <ul className={clsx('grid grid-cols-1', 'lg:grid-cols-2 lg:child-odd:border-r')}>
          {data.list.map((notice, index) => (
            <BaseLink
              key={notice.uuid || index}
              href={`/board/notice/${notice.uuid}`}
              className={clsx('px-3', 'md:px-4', 'lg:px-0')}
            >
              <NoticeListItem notice={notice} />
            </BaseLink>
          ))}
        </ul>
      ) : (
        <ErrorMessage text="글이 존재하지 않습니다." />
      )}
    </>
  );
};

export default observer(NoticesList);
