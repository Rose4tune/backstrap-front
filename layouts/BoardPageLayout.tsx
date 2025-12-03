import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import HeartIcon from '@public/icons/[board]heart.svg';
import CommentIcon from '@public/icons/[board]comment.svg';
import ScrapIcon from '@public/icons/[board]scrap.svg';
import PostIcon from '@public/icons/[board]post.svg';

import BaseLink from '@common/BaseLink';

import useAuthenticated from '@hooks/useAuthenticated.hook';

import { BoardType } from '@enums/board/board.enum';

import PageLayout, { PageLayoutProps } from './PageLayout';
import { useStore } from '@stores/useStore.hook';
import useSchoolVerificationNecessaryModalDialog from '@hooks/bagstrap/school/useSchoolVerificationNecessaryModalDialog.hook';

const BOARD_PAGE_SUBMENUS = [
  {
    label: '좋아요 로그',
    description: '내가 좋아요를 표시한 글입니다.',
    icon: <HeartIcon className="w-[19px] h-[17px]" />,
    linkPath: '/my/board/liked'
  },
  {
    label: '댓글 로그',
    description: '내가 댓글을 남긴 글입니다.',
    icon: <CommentIcon className="w-[18px] h-[17px]" />,
    linkPath: '/my/board/commented'
  },
  {
    label: '스크랩북',
    description: '내가 스크랩한 글입니다.',
    icon: <ScrapIcon className="w-[13px] h-[17px]" />,
    linkPath: '/my/board/scrapped'
  },
  {
    label: '내가 쓴 글',
    description: '내가 작성한 글입니다.',
    icon: <PostIcon className="w-[17px] h-[17px]" />,
    linkPath: '/my/board/written'
  }
];

export interface BoardPageLayoutProps extends PageLayoutProps {
  showWriteButton?: boolean;
  boardType?: BoardType;
}

const BoardPageLayout: React.FC<BoardPageLayoutProps> = (props): JSX.Element => {
  const {
    children,
    groupUuid,
    showWriteButton = true,
    boardType = BoardType.POST,
    ...pageLayoutProps
  } = props;

  const router = useRouter();

  const { MeStore } = useStore();

  const [modalDialogEl, openModalDialog] = useSchoolVerificationNecessaryModalDialog();

  const isAuthenticated = useAuthenticated();

  const description = BOARD_PAGE_SUBMENUS.find(
    ({ linkPath }) => linkPath === router.pathname
  )?.description;

  const pageLayoutTopSection = useCallback(
    () =>
      isAuthenticated ? (
        <section
          className={clsx('z-[1600]', 'flex-between bg-white border-[#E5E5EB] border-b')}
        >
          <div className="flex xl:border-l">
            {BOARD_PAGE_SUBMENUS.map(({ icon, label, linkPath }, index) => (
              <BaseLink
                key={index}
                href={linkPath}
                className={clsx(
                  'flex-center gap-1.5 h-12 px-5  border-r border-[#E5E5EB]',
                  router.pathname === linkPath ? 'text-primary' : 'text-grey5'
                )}
              >
                {icon}
                <span className="hidden md:inline typo-body5 font-bold">{label}</span>
              </BaseLink>
            ))}
          </div>
          {false && (
            <BaseLink
              onClick={
                MeStore.isVerified
                  ? undefined
                  : () => {
                      openModalDialog();
                    }
              }
              href={
                !MeStore.isVerified
                  ? undefined
                  : boardType === BoardType.NOTICE
                    ? '/board/notice/write'
                    : `/board/post/write${groupUuid ? `?category=${groupUuid}` : ''}`
              }
              className="flex-1 h-12 flex-center xl:max-w-[142px]  border-[#E5E5EB] xl:border-x"
            >
              <span className="font-bold">글 쓰 기</span>
            </BaseLink>
          )}
        </section>
      ) : null,
    [isAuthenticated, router.pathname, showWriteButton, boardType, groupUuid]
  );

  return (
    <PageLayout
      groupUuid={groupUuid}
      topSection={pageLayoutTopSection()}
      {...pageLayoutProps}
    >
      {/* body */}
      {description && (
        <div
          className={clsx(
            'z-[1600]',
            'flex items-center flex-wrap bg-primary-light bg-opacity-40',
            'min-h-[40px] px-3 py-2',
            'text-primary-dark typo-body6 font-semibold',
            'md:h-[66px] md:px-5 md:py-4 md:typo-body4 md:font-bold'
          )}
        >
          {description}
        </div>
      )}

      <div className="relative">{children}</div>
      {modalDialogEl}
    </PageLayout>
  );
};

export default BoardPageLayout;
