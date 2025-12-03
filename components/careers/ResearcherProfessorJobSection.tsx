import { useEffect } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useScreenSize from '@hooks/useScreenSize.hook';

import CareerSection from './CareerSection';
import { ResearcherProfessorJobSectionContainer } from './ResearcherProfessorJobSection.style';

const ResearcherProfessorJobSection = observer(() => {
  const screenSize = useScreenSize();
  const visibleItems = (() => {
    // 현재 jobTypes : ['research'] 데이터가 없어서 전체 공고 리스트 데이터 사용
    // 추후 데이터가 더 들어오면 recruitmentResearcherAndProfessorListData 사용
    const data = toJS(careerStore.recruitmentListData.data);
    // const data = toJS(careerStore.recruitmentResearcherAndProfessorListData.data);
    if (screenSize === 'xsmall') return data.slice(0, 2);
    if (screenSize === 'small') return data.slice(0, 3);
    return data.slice(0, 4);
  })();

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
    <ResearcherProfessorJobSectionContainer>
      <CareerSection title="연구원/교수 임용" type="large" items={visibleItems} />
    </ResearcherProfessorJobSectionContainer>
  );
});
export default ResearcherProfessorJobSection;
