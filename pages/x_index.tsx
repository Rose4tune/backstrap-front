import clsx from 'clsx';
import { useMemo } from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import type { NextPage } from 'next';

import { isNotNil } from '@utils/common/base.util';

import {
  BannersQuery,
  BoardsDetailQuery,
  HomeBoardsDocument,
  HomeBoardsQuery,
  HomeBoardsQueryVariables,
  NoticeDataFragment,
  FaGroupsQuery,
  FaGroupsDocument,
  FaGroupsQueryVariables,
  AnnouncesQueryVariables,
  AnnouncesQuery,
  AnnouncesDocument,
  AnnounceType,
  AnnounceResponse
} from '@generated/graphql';

import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';

import PageLayout from '@layouts/PageLayout';

import type { BoardSummaryProps } from '@common/bagstrap/board/BoardSummary';

import AppLinkBannerSection from '@common/bagstrap/etc/AppLinkBannerSection';
import BannerSection from '@common/bagstrap/banner/BannerSection';
import BoardOverviewSection from '@common/bagstrap/board/BoardOverviewSection';
import BoardRecentSection from '@common/bagstrap/board/BoardRecentSection';
import YoutubeChannelOverviewSection from '@common/bagstrap/etc/YoutubeChannelOverviewSection';
import HomeEmploy from '@common/bagstrap/announce/Employ/HomeEmploy';
import {
  DEFAULT_HOME_ANNOUNCE_REQUEST_COUNT,
  DEFAULT_HOME_MALL_REQUEST_COUNT
} from '@constants/request.constant';
import { css } from '@emotion/react';
import { components } from 'src/types/api';

type BannerResponse = components['schemas']['BannerViewDto'][];

export interface IndexPageProps {
  faGroups?: FaGroupsQuery['FAGroups'];
  notices?: NoticeDataFragment[];
  announces?: AnnounceResponse[];
  recentBoards?: BoardsDetailQuery['boardsByCursor']['data'];
  banners?: BannersQuery['banners'];
  freeBoard?: BoardSummaryProps | null;
  secretBoard?: BoardSummaryProps | null;
}

// @ts-ignore
const IndexPage: NextPage<IndexPageProps> = ({
  banners,
  announces,
  recentBoards,
  freeBoard,
  secretBoard
}) => {
  const notNilBanners = useMemo(() => banners?.filter(isNotNil), [banners]);
  const notNilBoards = useMemo(() => recentBoards?.filter(isNotNil), [recentBoards]);

  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.bagstrap.team/" key="canonical" />
      </Head>

      <PageLayout>
        <div
          className={clsx(
            'grid grid-cols-1 gap-4 grid-rows-4',
            'px-3 pt-6 pb-3',
            'md:gap-3 md:px-8 md:pt-10 md:pb-4',
            'xl:grid-cols-3 xl:grid-rows-1 xl:gap-[18px] xl:pt-4'
          )}
        >
          {/* app link banner */}
          <AppLinkBannerSection />

          {/* content banner */}
          <BannerSection
            banners={notNilBanners as BannerResponse}
            className="row-span-3 xl:row-span-1 xl:col-span-2 xl:order-1"
          />
        </div>

        <div
          className={clsx(
            'px-3 grid grid-cols-1 gap-4',
            'md:px-8',
            'xl:grid-cols-3 xl:grid-rows-[auto_1fr] xl:gap-[18px]'
          )}
        >
          {/* 이 부분 주석 살려야 함*/}

          {/*/!* board - 최근 *!/*/}
          {/*<BoardRecentSection*/}
          {/*    boards={notNilBoards}*/}
          {/*    className={clsx(*/}
          {/*        "h-fit",*/}
          {/*        "xl:order-1 xl:col-span-1",*/}
          {/*        "lg:col-span-2",*/}
          {/*    )}*/}
          {/*/>*/}
          {/*/!* employ announces *!/*/}
          {/*<HomeEmploy*/}
          {/*    className={clsx(*/}
          {/*        "h-fit",*/}
          {/*        "xl:order-2 xl:col-span-2 xl:row-span-1",*/}
          {/*        "lg:row-span-1 lg:col-span-2",*/}
          {/*    )}*/}
          {/*    employAnnounces={announces}*/}
          {/*/>*/}

          {/*<div*/}
          {/*    className={clsx(*/}
          {/*        "order-3",*/}
          {/*        "pt-2 space-y-5",*/}
          {/*        "md:pt-0",*/}
          {/*        "lg:col-span-2",*/}
          {/*        "xl:col-span-1"*/}
          {/*    )}*/}
          {/*>*/}
          <HomeEmploy
            className={clsx(
              'h-fit',
              'xl:order-0 xl:col-span-2 xl:row-span-1',
              'lg:row-span-1 lg:col-span-2'
            )}
            employAnnounces={announces}
          />

          {/* board - 최근 */}
          <BoardRecentSection
            boards={notNilBoards}
            className={clsx('h-fit', 'xl:order-1 xl:col-span-1', 'lg:col-span-2')}
          />

          {/* board - 자유/비밀 */}
          <BoardOverviewSection
            className={clsx(
              'xl:order-2 xl:col-span-2 xl:row-span-1',
              'lg:row-span-1 lg:col-span-2'
            )}
            freeBoard={freeBoard}
            secretBoard={secretBoard}
          />

          <div
            className={clsx(
              'order-2',
              'pt-2 space-y-5',
              'md:pt-0',
              'lg:col-span-2',
              'xl:col-span-1'
            )}
          >
            {/* youtube */}
            <YoutubeChannelOverviewSection />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  /*
   * getServerSideProps에서 useStore hook을 사용할 수 없기 때문에 예외적으로 index page에서만
   * faGroups 쿼리를 직접 날리고 pageProps로 _app.tsx에 넘겨주어서 faGroups store initializing을 함.
   */
  const {
    data: { FAGroups = [] }
  } = await apolloClient
    .query<FaGroupsQuery, FaGroupsQueryVariables>({
      query: FaGroupsDocument
    })
    .catch(e => {
      console.log(e);

      return { data: { FAGroups: [] } };
    });

  const faGroups = FAGroups.filter(isNotNil);

  if (faGroups.length == 0) {
    return {
      props: addInitialApolloState(apolloClient, {
        freeBoard: null,
        secretBoard: null
      })
    };
  }

  const freeBoardGroup = faGroups.find(faGroup => faGroup!.code === 'FREE');
  const secretBoardGroup = faGroups.find(faGroup => faGroup!.code === 'SECRET');

  const [
    {
      data: { boardsByCursorFree, boardsByCursorSecret }
    },
    AnnouncesQueryResult
  ] = await Promise.all([
    apolloClient
      .query<HomeBoardsQuery, HomeBoardsQueryVariables>({
        query: HomeBoardsDocument,
        variables: {
          uuidFree: freeBoardGroup?.uuid,
          uuidSecret: secretBoardGroup?.uuid
        }
      })
      .catch(e => {
        console.log(e);

        return {
          data: {
            boardsByCursorFree: null,
            boardsByCursorSecret: null
          }
        };
      }),
    apolloClient.query<AnnouncesQuery, AnnouncesQueryVariables>({
      query: AnnouncesDocument,
      variables: {
        input: {
          paginationRequestDto: {
            count: DEFAULT_HOME_ANNOUNCE_REQUEST_COUNT
          },
          announceType: AnnounceType.EmployLab
        }
      }
    })
  ]);

  return {
    props: addInitialApolloState(apolloClient, {
      faGroups,
      announces: AnnouncesQueryResult.data.announcesByCursor?.data.filter(isNotNil),
      freeBoard: boardsByCursorFree
        ? {
            group: freeBoardGroup,
            boards: boardsByCursorFree.data.filter(isNotNil)
          }
        : null,
      secretBoard: boardsByCursorSecret
        ? {
            group: secretBoardGroup,
            boards: boardsByCursorSecret.data.filter(isNotNil)
          }
        : null
    })
  };
}

export default observer(IndexPage);
