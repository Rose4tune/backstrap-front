import clsx from 'clsx';

import { BoardSummaryFragment, FaGroupSummaryFragment } from '@generated/graphql';

import ArrowRightIcon from '@public/icons/[board]arrow-right.svg';
import WriteIcon from '@public/icons/[board]write.svg';

import BaseLink from '@common/BaseLink';

import BoardPostInfo from './BoardPostInfo';

export interface BoardSummaryProps {
  group: FaGroupSummaryFragment;

  boards: BoardSummaryFragment[];
}

// graphql.tsx L4044, L4051 에 5개로 고정되어있음.
const LEN = 5;

const BoardSummary = (props: BoardSummaryProps): JSX.Element => {
  const { group, boards = [] } = props;

  return (
    <div className="border border-[#E5E5EB] rounded-lg">
      <BaseLink href={`/board/${group.uuid}`}>
        <div
          className={clsx(
            'flex-between pl-2.5 pr-3 border-b border-[#E5E5EB]',
            'h-10',
            'md:h-[52px] md:px-4'
          )}
        >
          <span className={clsx('typo-body6 font-semibold', 'md:typo-body3')}>
            {group.name}
          </span>
          <div className="flex-center gap-[5px] text-grey5">
            <span className="font-bold text-[11px]">더보기</span>
            <ArrowRightIcon />
          </div>
        </div>
      </BaseLink>

      {boards.length === 0 ? (
        <div className="h-[184px] md:h-[218px] flex-center flex-col">
          <BaseLink
            className="flex-center flex-col gap-4"
            href={`/board/post/write?category=${group.uuid}`}
          >
            <WriteIcon />
            <p className="typo-body6 font-light text-grey3">첫 글을 작성해보세요</p>
          </BaseLink>
        </div>
      ) : (
        <ul className="h-[184px] md:h-[218px] divide-y divide-[#E5E5EB]">
          {boards.slice(0, LEN).map((board, index) => (
            <li key={board.uuid || index} className="hover:bg-[#F6F6F6]">
              <BaseLink
                className={clsx(
                  'flex-between',
                  'h-9 pl-2.5 pr-3',
                  'md:h-[42px] md:px-4',
                  boards.length < LEN &&
                    index === boards.length - 1 &&
                    'border-b border-[#E5E5EB]'
                )}
                href={`/board/post/${board.uuid}`}
              >
                <span
                  className={clsx('typo-body8 font-medium truncate', 'md:typo-body6')}
                >
                  {board.title}
                </span>
                <BoardPostInfo
                  likeCount={board.likeCount}
                  reviewCount={board.reviewCount}
                />
              </BaseLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardSummary;
