import { useEffect, useMemo, useRef } from 'react';

import { useRouter } from 'next/router';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import PageLayout from '@layouts/PageLayout';
import CareerPageLayout from '@layouts/CareerPageLayout';

import PopularRecruitmentSection from '@components/careers/PopularRecruitmentSection';
import CareersDetailPageJobHeader from '@components/careers/CareersDetailPageJobHeader';
import RecruitmentInformationSection from '@components/careers/RecruitmentInformationSection';
import CareerPositionContent from '@components/careers/CareerPositionContent';
import JinhakRecruitmentInformationSection from '@components/careers/JinhakRecruitmentInformationSection';
import JinhakProSection from '@components/careers/JinhakProSection';
import JinhakDisclaimerSection from '@components/careers/JinhakDisclaimerSection';

import CommonButton from '@common/button/CommonButton';

import useAuthPayload from '@hooks/useAuthPayload.hook';

import type CareersMainType from '@mock/careers/types/careersMainType';

import {
  CareersDetailPagePositionContainer,
  CareersDetailPageFloatingApplyPanelContainer,
  CareersDetailPageFloatingApplyButtonContainer,
  CareersDetailPageFooterApplyButtonContainer
} from '@styles/pages/careers/[id].style';
import { useMediaQuery } from '@mui/material';
import Footer from 'elements/Footer';
import GlobalHeader from 'src/components/header/GlobalHeader';

export interface CareersDetailPageBodyJobResponsiveProps {
  jobData: CareersMainType;
}

const CareersDetailPage = observer(() => {
  const hasFetchedRef = useRef(false);
  const authPayload = useAuthPayload();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:550px)');

  const {
    query: { id: routerQuery }
  } = router;

  useEffect(() => {
    if (routerQuery && !hasFetchedRef.current) {
      hasFetchedRef.current = true;

      const fetchData = async () => {
        try {
          await careerStore.getRecruitmentDetail(
            routerQuery as string,
            authPayload?.access_token
          );
        } catch (error) {
          console.error('데이터 가져오기 실패:', error);
        }
      };

      fetchData();
    }
  }, [authPayload, routerQuery]);

  const jobData = useMemo(() => toJS(careerStore.recruitmentDetailData), [careerStore.recruitmentDetailData]);

  // 진학 데이터인지 판단
  const isJinhak = jobData?.isJinhak ?? false;

  const handleApplyButtonClick = () => {
    if (isJinhak && jobData?.recruitmentAnnouncementLink) {
      const url = new URL(jobData.recruitmentAnnouncementLink);
      url.searchParams.set('utm_source', 'bagstrap');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', 'bagstrap_recruit');
      window.open(url.toString(), '_blank');
    } else {
      window.open(jobData?.recruitmentAnnouncementLink, '_blank');
    }
  };

  const renderJinhakContent = (jobData: CareersMainType) => (
    <>
      <JinhakRecruitmentInformationSection jobData={jobData} />
      <JinhakProSection jobData={jobData} onButtonClick={handleApplyButtonClick} />
      <JinhakDisclaimerSection jobData={jobData} />
    </>
  );
  

  const renderRegularContent = (jobData: CareersMainType) => (
    <>
      <RecruitmentInformationSection jobData={jobData} />
      <PopularRecruitmentSection />
      <CareersDetailPagePositionContainer>
        {jobData?.content ? (
          <CareerPositionContent jobContent={jobData?.content} />
        ) : (
          <span>-</span>
        )}
        <CareersDetailPageFloatingApplyPanelContainer>
          <CareersDetailPageFloatingApplyButtonContainer>
            <CommonButton
              text="지원하기"
              size="full"
              emphasis="primary"
              onClick={handleApplyButtonClick}
            />
          </CareersDetailPageFloatingApplyButtonContainer>
        </CareersDetailPageFloatingApplyPanelContainer>
      </CareersDetailPagePositionContainer>
    </>
  );

  const renderFooterButton = () => {
    if (isJinhak) return null;

    return (
      <CareersDetailPageFooterApplyButtonContainer>
        <CommonButton
          text="지원하기"
          size="full"
          emphasis="primary"
          onClick={handleApplyButtonClick}
        />
      </CareersDetailPageFooterApplyButtonContainer>
    );
  };

  if (isMobile) {
    return (
      <PageLayout>
        <CareerPageLayout>
          {jobData && (
            <>
              <CareersDetailPageJobHeader
                jobData={jobData}
                isJinhak={isJinhak}
                onJinhakClick={isJinhak ? handleApplyButtonClick : undefined}
              />
              {isJinhak ? renderJinhakContent(jobData) : renderRegularContent(jobData)}
            </>
          )}
        </CareerPageLayout>
        {renderFooterButton()}
      </PageLayout>
    );
  }

  return (
    <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
      <GlobalHeader />
      <CareerPageLayout>
        {jobData && (
          <>
            <CareersDetailPageJobHeader
              jobData={jobData}
              isJinhak={isJinhak}
              onJinhakClick={isJinhak ? handleApplyButtonClick : undefined}
            />
            {isJinhak ? renderJinhakContent(jobData) : renderRegularContent(jobData)}
          </>
        )}
      </CareerPageLayout>
      {renderFooterButton()}
      <Footer />
    </div>
  );
});

export default CareersDetailPage;
