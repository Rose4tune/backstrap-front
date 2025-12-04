import { useEffect } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useScreenSize from '@hooks/useScreenSize.hook';

import CareerSection from './CareerSection';
import { ResearcherProfessorJobSectionContainer } from './ResearcherProfessorJobSection.style';

const ResearcherProfessorJobSection = observer(() => {
  const screenSize = useScreenSize();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await careerStore.postJinhakRecruitmentList({
          cursor: null,
          count: 4
        });
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  const jinhakData = toJS(careerStore.recruitmentJinhakListData?.data || []);

  const visibleItems = (() => {
    if (screenSize === 'xsmall') return jinhakData.slice(0, 2);
    if (screenSize === 'small') return jinhakData.slice(0, 3);
    return jinhakData.slice(0, 4);
  })();

  return (
    <ResearcherProfessorJobSectionContainer>
      <CareerSection
        title="연구원/교수 임용"
        type="large"
        items={visibleItems}
        viewAllHref="/careers/jinhak"
      />
    </ResearcherProfessorJobSectionContainer>
  );
});

export default ResearcherProfessorJobSection;
