import { useCallback, useEffect, useRef, useState } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import throttle from 'lodash/throttle';

import careerStore from '@stores/career.store';

import useScreenSize from '@hooks/useScreenSize.hook';
import useIntersect from '@hooks/useIntersect.hook';
import useAuthPayload from '@hooks/useAuthPayload.hook';

import Loader from '@common/loader/loader';

import ThumbnailCard from '@components/careers/ThumbnailCard';
import CareerSearchButton from '@components/careers/CareerSearchButton';
import CareerSortButton from '@components/careers/CareerSortButton';

import type CareersMainType from '@mock/careers/types/careersMainType';
import type { PostJinhakRecruitmentListRequest } from '@dto/CareerDTO';

import PageLayout from '@layouts/PageLayout';
import CareerPageLayout from '@layouts/CareerPageLayout';

import {
  CareerAllSectionContainer,
  SectionBody,
  SectionHeader,
  SectionTitleContainer,
  SectionTitleAndSearch,
  SectionTitle,
  CareerAllLoaderContainer
} from '@styles/pages/careers/all/index.style';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const CareersJinhak = observer(() => {
  const screenSize = useScreenSize();

  const authPayload = useAuthPayload();

  const authRef = useRef(authPayload);

  const hasFetchedRef = useRef(false);

  const [searchText, setSearchText] = useState<string>('');

  const [sort, setSort] = useState<'UPLOAD' | 'DEADLINE'>('UPLOAD');

  const [searchSelected, setSearchSelected] = useState<boolean>(false);

  const [careerSliceData, setCareerSliceData] = useState<CareersMainType[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasMore, setHasMore] = useState<boolean>(true);

  const [hasTriggered, setHasTriggered] = useState(false);

  const [hasListRendered, setHasListRendered] = useState(false);

  const [shouldFetch, setShouldFetch] = useState(false);

  const REQUEST_COUNT = 15;

  const fetchData = useCallback(
    throttle(
      (
        keyword = searchText,
        newSort?: 'UPLOAD' | 'DEADLINE',
        cursor = null,
        token = authRef.current?.access_token
      ) => {
        setIsLoading(true);

        const requestBody: PostJinhakRecruitmentListRequest = {
          cursor: cursor,
          count: REQUEST_COUNT,
          sort: newSort ?? sort,
          keyword: keyword || null
        };

        if (requestBody.sort === 'DEADLINE') {
          requestBody.orderBy = 'ASC';
        }

        careerStore
          .postJinhakRecruitmentList(requestBody, token)
          .then(() => {
            const { data } = toJS(careerStore.recruitmentJinhakListData);

            setCareerSliceData(prev => [...prev, ...data]);

            if (data.length < REQUEST_COUNT) {
              setHasMore(false);
            }
          })
          .catch(err => console.error('데이터 가져오기 실패:', err))
          .finally(() => {
            setIsLoading(false);
          });
      },
      1000
    ),
    []
  );

  // authPayload가 준비되면, fetch 준비 상태로 전환
  useEffect(() => {
    const isLoggedIn = typeof authPayload !== 'undefined';
    const isTokenReady = !!authPayload?.access_token;

    if (!isLoggedIn) {
      setShouldFetch(true);
      return;
    }

    if (isLoggedIn && isTokenReady) {
      setShouldFetch(true);
    }
  }, [authPayload]);

  // fetch 조건이 true가 되었을 때, 최초 한 번만 fetch
  useEffect(() => {
    if (!shouldFetch || hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    fetchData(searchText, sort, null, authPayload?.access_token);
  }, [shouldFetch]);

  useEffect(() => {
    if (!isLoading) {
      setHasTriggered(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && careerSliceData.length > 0) {
      setHasListRendered(true);
    }
  }, [isLoading, careerSliceData]);

  const handleRefetch = (newSort = sort) => {
    setCareerSliceData([]);
    setHasMore(true);
    setHasListRendered(false);
    fetchData(searchText, newSort, null, authPayload?.access_token);
  };

  const handleSortChange = (sortValue: 'UPLOAD' | 'DEADLINE') => {
    setSort(sortValue);
    handleRefetch(sortValue);
  };

  const handleSearch = () => {
    handleRefetch();
  };

  // 무한 스크롤 콜백
  const onIntersect = useCallback(() => {
    if (
      !hasListRendered ||
      isLoading ||
      !hasMore ||
      !hasFetchedRef.current ||
      hasTriggered
    ) {
      return;
    }

    setHasTriggered(true);
    fetchData(
      searchText,
      sort,
      toJS(careerStore.recruitmentJinhakListData?.cursor),
      authPayload?.access_token
    );
  }, [
    searchText,
    sort,
    fetchData,
    isLoading,
    hasMore,
    hasTriggered,
    hasListRendered
  ]);

  // 무한 스크롤 트리거 ref
  const intersectRef = useIntersect(onIntersect, { threshold: 0.5 });

  const isMobile = useMediaQuery('(max-width:550px)');

  return isMobile ? (
    <PageLayout>
      <CareerPageLayout>
        <CareerAllSectionContainer>
          <SectionHeader>
            <SectionTitleContainer>
              <SectionTitleAndSearch>
                {!(searchSelected && screenSize === 'small') && (
                  <SectionTitle>연구직 채용 소식</SectionTitle>
                )}
                <CareerSearchButton
                  value={searchText}
                  isSelected={searchSelected}
                  onSelect={() => setSearchSelected(true)}
                  onChange={e => setSearchText(e.target.value)}
                  onSubmit={handleSearch}
                  onClear={() => setSearchText('')}
                />
              </SectionTitleAndSearch>
              <CareerSortButton sortValue={sort} onSortChange={handleSortChange} />
            </SectionTitleContainer>
          </SectionHeader>
          <SectionBody type={'large'}>
            {careerSliceData.map(item => (
              <ThumbnailCard
                key={`thumbnail_card_${item.uuid}`}
                data={item}
                defaultColor="grey"
              />
            ))}
          </SectionBody>
          {isLoading && (
            <CareerAllLoaderContainer>
              <Loader loading={isLoading} />
            </CareerAllLoaderContainer>
          )}
          {!isLoading && hasMore && hasFetchedRef.current && (
            <div ref={intersectRef} style={{ height: '30px' }} />
          )}
        </CareerAllSectionContainer>
      </CareerPageLayout>
    </PageLayout>
  ) : (
    <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
      <GlobalHeader />
      <CareerPageLayout>
        <CareerAllSectionContainer>
          <SectionHeader>
            <SectionTitleContainer>
              <SectionTitleAndSearch>
                {!(searchSelected && screenSize === 'small') && (
                  <SectionTitle>연구직 채용 소식</SectionTitle>
                )}
                <CareerSearchButton
                  value={searchText}
                  isSelected={searchSelected}
                  onSelect={() => setSearchSelected(true)}
                  onChange={e => setSearchText(e.target.value)}
                  onSubmit={handleSearch}
                  onClear={() => setSearchText('')}
                />
              </SectionTitleAndSearch>
              <CareerSortButton sortValue={sort} onSortChange={handleSortChange} />
            </SectionTitleContainer>
          </SectionHeader>
          <SectionBody type={'large'}>
            {careerSliceData.map(item => (
              <ThumbnailCard
                key={`thumbnail_card_${item.uuid}`}
                data={item}
                defaultColor="grey"
              />
            ))}
          </SectionBody>
          {isLoading && (
            <CareerAllLoaderContainer>
              <Loader loading={isLoading} />
            </CareerAllLoaderContainer>
          )}
          {!isLoading && hasMore && hasFetchedRef.current && (
            <div ref={intersectRef} style={{ height: '30px' }} />
          )}
        </CareerAllSectionContainer>
      </CareerPageLayout>
      <Footer />
    </div>
  );
});

export default CareersJinhak;
