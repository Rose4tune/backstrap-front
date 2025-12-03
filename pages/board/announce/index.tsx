import { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import clsx from 'clsx';

import { addInitialApolloState, initializeApollo } from '@libs/apolloClient';
import { useStore } from '@stores/useStore.hook';
import {
  AnnounceResponse,
  AnnouncesDocument,
  AnnouncesQuery,
  AnnouncesQueryResult,
  AnnouncesQueryVariables,
  AnnounceType,
  useAnnouncesLazyQuery
} from '@generated/graphql';
import useIntersect from '@hooks/useIntersect.hook';
import BoardPageLayout from '@layouts/BoardPageLayout';
import Loader from '@common/loader/loader';
import EmployCard from '@common/bagstrap/announce/Employ/EmployCard';
import { BoardType } from '@enums/board/board.enum';
import { DEFAULT_ANNOUNCE_REQUEST_COUNT } from '@constants/request.constant';
import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import Image from 'next/image';
import { IMAGE_DEFAULT_BLUR_DATA_URL } from '@constants/image.constant';
import AppLinkBannerSection from '@common/bagstrap/etc/AppLinkBannerSection';
import {
  PageContainer,
  PageTitle,
  CardList,
  CardItem,
  AppLinkBannerContainer,
  CardItemButton,
  CardItemTextContainer,
  CardItemCompany,
  CardItemTitle,
  EmptyBox,
  CardItemLabKeywordsContainer,
  CardItemLabKeywords,
  CardItemLabKeywordsLine,
  CardItemTotiKeywordsContainer,
  CardItemTotiKeywords,
  CardItemTotiKeywordsLine
} from '@styles/pages/board/announce/index.style';

interface AnnounceListPageProps {
  announcesQueryResult: AnnouncesQueryResult;
}

function AnnounceListPage({ announcesQueryResult }: AnnounceListPageProps) {
  const { AnnounceStore: store } = useStore();
  const up425 = useMediaQuery('(min-width:425px)');

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!store.isEmpty) {
      if (store.hasMore && !loading) {
        getAnnounceListByCursor(store.data.cursor);
      }
    }
  });

  useEffect(() => {
    if (announcesQueryResult.data?.announcesByCursor?.data) {
      store.initData();
      store.setList(
        announcesQueryResult.data?.announcesByCursor.data as AnnounceResponse[]
      );
      store.setCursor(announcesQueryResult.data?.announcesByCursor.cursor || null);
      store.setTotalCount(announcesQueryResult.data?.announcesByCursor.totalCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [getAnnounceList, { data, error, loading }] = useAnnouncesLazyQuery();

  const getAnnounceListByCursor = useCallback(
    (cursor: string | null) => {
      getAnnounceList({
        variables: {
          input: {
            announceType: AnnounceType.EmployLab,
            paginationRequestDto: {
              count: store.count,
              cursor
            }
          }
        }
      });
    },
    [getAnnounceList, store.count]
  );

  useEffect(() => {
    if (data) {
      store.pushList(data.announcesByCursor?.data as AnnounceResponse[]);
      store.setCursor(data.announcesByCursor?.cursor || null);
      store.setTotalCount(data.announcesByCursor?.totalCount);
    }
  }, [data, store]);

  return (
    <>
      <Head>
        <title>가방끈 | 채용소식끈</title>
        <link
          rel="canonical"
          href={`https://www.bagstrap.team/board/announce`}
          key="canonical"
        />
      </Head>
      <BoardPageLayout boardType={BoardType.ANNOUNCE}>
        <PageContainer up425={up425}>
          <PageTitle up425={up425}>{'석박사 채용공고'}</PageTitle>

          <CardList>
            {store.data.list.map((announce, index) => (
              <>
                {(index == 3 || index == 13) && (
                  <CardItem key={index}>
                    <AppLinkBannerContainer>
                      <AppLinkBannerSection />
                    </AppLinkBannerContainer>
                  </CardItem>
                )}

                <CardItem key={announce.uuid}>
                  <CardItemButton
                    onClick={() => {
                      window.open(announce?.content, '_blank', 'noopener, noreferrer');
                    }}
                  >
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      src={announce.imageUrl || IMAGE_DEFAULT_BLUR_DATA_URL}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        backgroundColor: '#F7F7F7',
                        aspectRatio: '296 / 169'
                      }}
                      // fill
                      alt="employ announcement image"
                      placeholder="blur"
                      blurDataURL={IMAGE_DEFAULT_BLUR_DATA_URL}
                    />
                    <CardItemTextContainer>
                      <CardItemCompany>{announce.company}</CardItemCompany>
                      <CardItemTitle>{announce.title}</CardItemTitle>
                      <EmptyBox />
                      {announce.labKeywords.length > 0 && (
                        <CardItemLabKeywordsContainer>
                          {announce.labKeywords.map(
                            (labKeyword, idx) =>
                              labKeyword && (
                                <>
                                  <CardItemLabKeywords>
                                    {labKeyword.name}
                                  </CardItemLabKeywords>
                                  {idx < announce.labKeywords.length - 1 && (
                                    <CardItemLabKeywordsLine />
                                  )}
                                </>
                              )
                          )}
                        </CardItemLabKeywordsContainer>
                      )}
                      <CardItemTotiKeywordsContainer>
                        {announce.totiKeywords.map(
                          (totiKeyword, idx) =>
                            totiKeyword && (
                              <>
                                <CardItemTotiKeywords>
                                  {totiKeyword.name}
                                </CardItemTotiKeywords>
                                {idx < announce.totiKeywords.length - 1 && (
                                  <CardItemTotiKeywordsLine />
                                )}
                              </>
                            )
                        )}
                      </CardItemTotiKeywordsContainer>
                    </CardItemTextContainer>
                  </CardItemButton>
                </CardItem>
              </>
            ))}
          </CardList>

          {loading ? <Loader /> : <div ref={ref} className="h-1" />}
        </PageContainer>

        {/*/!* header *!/*/}
        {/*<div className="text-[28px] font-semibold text-[#8DE8E1] p-2 mt-3 pl-4">*/}
        {/*    석박사 채용공고*/}
        {/*</div>*/}
        {/*/!* list *!/*/}
        {/*<div className={clsx(*/}
        {/*  "flex flex-wrap",*/}
        {/*  "p-4",*/}
        {/*  "gap-8"*/}
        {/*)}>*/}
        {/*  { store.data.list.map(announce => (*/}
        {/*    <EmployCard*/}
        {/*      key={announce.uuid}*/}
        {/*      employ={announce}*/}
        {/*      fullHeight*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</div>*/}
        {/*/!* infinite scroll target ref *!/*/}
        {/*{*/}
        {/*    loading*/}
        {/*        ? <Loader/>*/}
        {/*        : <div ref={ref} className="h-1"/>*/}
        {/*}*/}
      </BoardPageLayout>
    </>
  );
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  const announcesQueryResult = await apolloClient
    .query<AnnouncesQuery, AnnouncesQueryVariables>({
      query: AnnouncesDocument,
      variables: {
        input: {
          announceType: AnnounceType.EmployLab,
          paginationRequestDto: {
            count: DEFAULT_ANNOUNCE_REQUEST_COUNT
          }
        }
      }
    })
    .catch(e => {
      console.log(e);

      return {
        data: {
          announcesByCursor: {
            data: []
          }
        }
      };
    });

  return {
    props: addInitialApolloState(apolloClient, {
      announcesQueryResult
    })
  };
}

export default observer(AnnounceListPage);
