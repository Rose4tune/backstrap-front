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
          careerStore.getRecruitmentDetail(
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

  const jobData = useMemo(() => {
    return toJS(careerStore.recruitmentDetailData);
  }, [careerStore.recruitmentDetailData]);

  const handleApplyButtonClick = () => {
    window.open(jobData?.recruitmentAnnouncementLink, '_blank');
  };

  return (
    isMobile ? <PageLayout>
      <CareerPageLayout>
        {jobData && (
          <>
            <CareersDetailPageJobHeader jobData={jobData} />
            <RecruitmentInformationSection jobData={jobData} />
          </>
        )}
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
      </CareerPageLayout>
      <CareersDetailPageFooterApplyButtonContainer>
        <CommonButton
          text="지원하기"
          size="full"
          emphasis="primary"
          onClick={handleApplyButtonClick}
        />
      </CareersDetailPageFooterApplyButtonContainer>
    </PageLayout> :
      <div className="flex flex-col w-full min-w-[1280px] max-w-[1920px] mx-auto">
        <GlobalHeader />
        <CareerPageLayout>
          {jobData && (
            <>
              <CareersDetailPageJobHeader jobData={jobData} />
              <RecruitmentInformationSection jobData={jobData} />
            </>
          )}
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
        </CareerPageLayout>
        <CareersDetailPageFooterApplyButtonContainer>
          <CommonButton
            text="지원하기"
            size="full"
            emphasis="primary"
            onClick={handleApplyButtonClick}
          />
        </CareersDetailPageFooterApplyButtonContainer>
        <Footer />
      </div>
  );
});

export default CareersDetailPage;
