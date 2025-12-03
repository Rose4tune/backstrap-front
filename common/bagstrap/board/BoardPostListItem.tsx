import Image from 'next/image';
import first from 'lodash/first';
import clsx from 'clsx';

import { renderLineBreak } from '@utils/common/render.util';

import { extractPureText } from '@utils/common/html.util';

import { BoardDetailFragment, UserEntityView } from '@generated/graphql';

import BoardPostInfo from './BoardPostInfo';
import BoardPostWriterInfo from './BoardPostWriterInfo';
import { BOARD_VERSION_NEW, BOARD_VERSION_OLD } from '@constants/bagstrap/board.constant';

export interface BoardPostListItemProps {
  board: BoardDetailFragment;

  showCategory?: boolean;
}

const BoardPostListItem = (props: BoardPostListItemProps): JSX.Element => {
  const { board, showCategory } = props;

  const primaryFile = first(board.files);

  const isJSON = (str: string) => {
    if (typeof str !== 'string') return false;
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  };

  const firstImageObj =
    board.version === BOARD_VERSION_NEW &&
    isJSON(board.content) &&
    JSON.parse(board.content).find(
      (obj: { insert: string | { image: string } }) =>
        typeof obj['insert'] != 'string' && obj['insert']['image'] != null
    );
  const firstContentObj =
    board.version === BOARD_VERSION_NEW &&
    isJSON(board.content) &&
    JSON.parse(board.content).find(
      (obj: { insert: string | { image: string } }) => typeof obj['insert'] == 'string'
    );

  return (
    <li
      className={clsx(
        'flex flex-col justify-between',
        'border-b border-[#E5E5EB]',
        'py-5 overflow-hidden',
        'md:py-4',
        'lg:px-0'
      )}
    >
      <div
        className={clsx(
          'flex justify-between gap-3 h-14',
          'md:gap-5 md:px-3 md:h-[88px]'
        )}
      >
        {/* title & content */}
        <div className={clsx('flex-1', 'space-y-2', 'md:space-y-4')}>
          <div
            className={clsx(
              'font-bold text-[15px] leading-none break-all',
              'md:typo-body3'
            )}
          >
            <div className="line-clamp-1 text-ellipsis overflow-hidden break-all">
              {board.title}
            </div>
          </div>
          <div
            className={clsx(
              'text-[13px] leading-tight break-all',
              'md:typo-body5 md:font-medium'
            )}
          >
            {board.version === BOARD_VERSION_OLD && (
              <div className="break-words line-clamp-2 text-ellipsis overflow-hidden">
                {board.content && renderLineBreak(extractPureText(board.content), 2)}
              </div>
            )}
            {board.version === BOARD_VERSION_NEW && (
              <div className="break-words line-clamp-2 text-ellipsis overflow-hidden">
                {firstContentObj['insert']?.toString() &&
                  renderLineBreak(
                    extractPureText(firstContentObj['insert'].toString()),
                    2
                  )}
              </div>
            )}
          </div>
        </div>

        {/* file(image) */}
        <div
          className={clsx(
            'relative',
            'shrink-0 object-cover',
            'w-14 h-14',
            'md:w-[88px] md:h-[88px]'
          )}
        >
          {board.version === BOARD_VERSION_OLD &&
            primaryFile &&
            primaryFile.file &&
            primaryFile.file.url && (
              <img
                src={primaryFile.file?.url}
                alt="board content image"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            )}
          {board.version === BOARD_VERSION_NEW && board.content && firstImageObj && (
            <img
              src={firstImageObj['insert']['image'].toString()}
              loading="lazy"
              alt="board content image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          )}
        </div>
      </div>

      {/* bottom */}
      <div className={clsx('flex-between pt-4', 'md:px-3')}>
        {/* writer */}
        <BoardPostWriterInfo
          user={board.user as UserEntityView}
          isAnonymous={board.isAnonymous}
        />

        {/* info */}
        <BoardPostInfo
          categoryName={(showCategory && board.category?.name) || ''}
          elapsedCreatedDate={board.elapsedCreatedDate}
          likeCount={board.likeCount}
          reviewCount={board.reviewCount}
        />
      </div>
    </li>
  );
};

export default BoardPostListItem;
