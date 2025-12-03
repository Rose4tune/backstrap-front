import clsx from 'clsx';
import { useCallback } from 'react';
import moment from 'moment';

import { NoticeDataFragment } from '@generated/graphql';

import BaseLink from '@common/BaseLink';

import ArrowRightIcon from '@public/icons/[board]arrow-right.svg';

export const MAX_VIEW_COUNT = 5;

export interface HomeNoticeProps extends BaseProps {
  notices?: NoticeDataFragment[];
}

const HomeNotice = (props: HomeNoticeProps) => {
  const { notices } = props;

  const showNewIcon = useCallback((notice: NoticeDataFragment) => {
    const writeDate = moment(notice.createdDate);
    const now = moment(Date.now());
    return now.diff(writeDate, 'days') <= 7;
  }, []);

  return (
    <div className="border border-[#E5E5EB]">
      <BaseLink href={`/board/notice`}>
        <div
          className={clsx(
            'flex-between pl-2.5 pr-3 border-b border-[#E5E5EB]',
            'h-10',
            'md:h-[52px] md:px-4'
          )}
        >
          <span className={clsx('typo-body6 font-semibold', 'md:typo-body3')}>
            소식끈
          </span>
          <div className="flex-center gap-[5px] text-grey5">
            <span className="font-bold text-[11px]">더보기</span>
            <ArrowRightIcon />
          </div>
        </div>
      </BaseLink>

      {!!notices && (
        <ul className="h-auto md:h-auto divide-y divide-[#E5E5EB]">
          {notices.map((notice, index) => (
            <li key={index} className="hover:bg-[#F6F6F6]">
              <BaseLink
                className={clsx(
                  'flex',
                  'items-center',
                  'h-9 pl-2.5 pr-3',
                  'md:h-[42px] md:px-4',
                  notices.length < MAX_VIEW_COUNT &&
                    index === notices.length - 1 &&
                    'border-b border-[#E5E5EB]'
                )}
                href={`/board/notice/${notice.uuid}`}
              >
                <span
                  className={clsx(
                    'typo-body8 font-medium truncate',
                    'md:typo-body6',
                    'text-ellipsis'
                  )}
                >
                  {notice.title}
                </span>
                {showNewIcon(notice) && (
                  <img
                    src="/images/new.png"
                    alt="new"
                    className={clsx(
                      'rounded-sm',
                      'w-[18px] h-auto',
                      'md:w-[22px] md:h-auto',
                      'xl:w-[24px] xl:h-auto',
                      'ml-2'
                    )}
                  />
                )}
              </BaseLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeNotice;
