import CompanyRecruitSection from '@components/careers/CompanyRecruitSection';
import NewJobSection from '@components/careers/NewJobSection';
import PopularJobSection from '@components/careers/PopularJobSection';
import ResearcherProfessorJobSection from '@components/careers/ResearcherProfessorJobSection';

import PageLayout from '@layouts/PageLayout';
import CareerPageLayout from '@layouts/CareerPageLayout';

import CareerBanner from '@components/careers/CareerBanner';
import { useMediaQuery } from '@mui/material';
import GlobalHeader from 'src/components/header/GlobalHeader';
import Footer from 'elements/Footer';

const Careers = () => {
  const isMobile = useMediaQuery('(max-width:550px)');

  return (
    isMobile ? <PageLayout>
      <CareerPageLayout>
        <CareerBanner />
        <PopularJobSection />
        <NewJobSection />
        {/* <CompanyRecruitSection /> */}
        <ResearcherProfessorJobSection />
      </CareerPageLayout>
    </PageLayout> :
      <div className="flex flex-col min-w-[1280px] max-w-[1920px] mx-auto">
        <GlobalHeader />
        <CareerPageLayout>
          <CareerBanner />
          <PopularJobSection />
          <NewJobSection />
          {/* <CompanyRecruitSection /> */}
          <ResearcherProfessorJobSection />
        </CareerPageLayout>
        <Footer />
      </div>
  );
};

export default Careers;
