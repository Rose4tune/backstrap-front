import { useEffect } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useAuthPayload from '@hooks/useAuthPayload.hook';
import useScreenSize from '@hooks/useScreenSize.hook';

import CareerSection from './CareerSection';
import { PopularJobSectionContainer } from './PopularJobSection.style';

const PopularJobSection = observer(() => {
  const authPayload = useAuthPayload();

  const screenSize = useScreenSize();

  const visibleItems = (() => {
    const data = toJS(careerStore.recruitmentListData.data);
    if (screenSize === 'xsmall') return data.slice(0, 4);
    if (screenSize === 'small') return data.slice(0, 6);
    return data.slice(0, 8);
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        careerStore.postRecruitmentList(
          {
            paginationRequestDto: {
              cursor: null,
              count: 8
            },
            sort: 'UPLOAD',
            keyword: ''
          },
          authPayload?.access_token
        );
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, [authPayload]);

  return (
    <PopularJobSectionContainer>
      <CareerSection title="실시간 인기 채용 공고" type="large" items={visibleItems} />
    </PopularJobSectionContainer>
  );
});
export default PopularJobSection;
