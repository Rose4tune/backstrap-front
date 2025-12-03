import { useEffect } from 'react';

import { toJS } from 'mobx';

import careerStore from '@stores/career.store';

import useScreenSize from '@hooks/useScreenSize.hook';

import CareerSection from './CareerSection';
import { CompanyRecruitSectionContainer } from './CompanyRecruitSection.style';

const CompanyRecruitSection = () => {
  const screenSize = useScreenSize();
  const visibleItems =
    screenSize === 'small'
      ? toJS(careerStore.recruitmentResearcherAndProfessorListData.data).slice(0, 2)
      : toJS(careerStore.recruitmentResearcherAndProfessorListData.data).slice(0, 4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        careerStore.postRecruitmentResearcherAndProfessorList();
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <CompanyRecruitSectionContainer>
      <CareerSection title="기업 채용" type="large" items={visibleItems} />
    </CompanyRecruitSectionContainer>
  );
};
export default CompanyRecruitSection;
