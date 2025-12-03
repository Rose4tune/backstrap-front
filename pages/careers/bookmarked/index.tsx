import { useEffect } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import useAuthPayload from '@hooks/useAuthPayload.hook';

import careerStore from '@stores/career.store';

import ThumbnailCard from '@components/careers/ThumbnailCard';

import PageLayout from '@layouts/PageLayout';
import CareerPageLayout from '@layouts/CareerPageLayout';

import {
  BookmarkedCareerSectionContainer,
  SectionBody,
  SectionHeader,
  SectionTitle
} from '@styles/pages/careers/bookmarked/index.style';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const BookmarkedCareers = observer(() => {
  const authPayload = useAuthPayload();

  useEffect(() => {
    if (authPayload && authPayload.access_token) {
      const { access_token } = authPayload;

      const fetchData = async () => {
        try {
          careerStore.getRecruitmentBookmark(access_token);
        } catch (error) {
          console.error('데이터 가져오기 실패:', error);
        }
      };

      fetchData();
    }
  }, [authPayload]);

  const isMobile = useMediaQuery('(max-width:550px)');


  return (
    isMobile ?
      <PageLayout>
        <CareerPageLayout>
          <BookmarkedCareerSectionContainer>
            <SectionHeader>
              <SectionTitle>북마크</SectionTitle>
            </SectionHeader>
            <SectionBody type={'large'}>
              {toJS(careerStore.bookmarkListData.data)?.map(item => (
                <ThumbnailCard key={item.uuid} data={item} defaultColor="grey" />
              ))}
            </SectionBody>
          </BookmarkedCareerSectionContainer>
        </CareerPageLayout>
      </PageLayout>
      : <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
        <GlobalHeader />
        <CareerPageLayout>
          <BookmarkedCareerSectionContainer>
            <SectionHeader>
              <SectionTitle>북마크</SectionTitle>
            </SectionHeader>
            <SectionBody type={'large'}>
              {toJS(careerStore.bookmarkListData.data)?.map(item => (
                <ThumbnailCard key={item.uuid} data={item} defaultColor="grey" />
              ))}
            </SectionBody>
          </BookmarkedCareerSectionContainer>
        </CareerPageLayout>
        <Footer />
      </div>
  )
});
export default BookmarkedCareers
