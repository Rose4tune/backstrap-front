import { useMemo } from 'react';
import clsx from 'clsx';

import { SchoolVerificationStatus, UserEntityView } from '@generated/graphql';
import SchoolStateIcon from '@public/icons/[board]school-state.svg';

export interface BoardPostWriterInfoProps {
  user?: UserEntityView | null;

  isAnonymous?: boolean | null;

  responsive?: boolean;
}

const BoardPostWriterInfo = (props: BoardPostWriterInfoProps): JSX.Element => {
  const { user, isAnonymous, responsive = true } = props;
  const userName = useMemo(() => user?.name, [user]);
  const schoolName = useMemo(() => user?.school?.name, [user]);

  return (
    <div
      className={clsx(
        'flex items-center gap-x-1',
        'typo-body7 leading-tight truncate',
        responsive && 'md:typo-body5'
      )}
    >
      <b>
        {isAnonymous ? '익명의 끈' : userName}
        {schoolName && (
          <>
            <span className="font-bold"> | </span>
            <span className="bold">{schoolName}</span>
            {user?.schoolVerificationStatus === SchoolVerificationStatus.Approved && (
              <SchoolStateIcon />
            )}
          </>
        )}
      </b>
    </div>
  );
};

export default BoardPostWriterInfo;
