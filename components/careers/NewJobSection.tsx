import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import careerStore from '@stores/career.store';

import useScreenSize from '@hooks/useScreenSize.hook';

import CareerSection from './CareerSection';
import { NewJobSectionContainer } from './NewJobSection.style';

const PopularJobSection = observer(() => {
  const screenSize = useScreenSize();
  const visibleItems = (() => {
    const data = toJS(careerStore.recruitmentListData?.data || []);
    if (screenSize === 'xsmall') return data.slice(0, 3);
    if (screenSize === 'small') return data.slice(0, 4);
    return data.slice(0, 6);
  })();

  return (
    <NewJobSectionContainer>
      <CareerSection title="새로 올라온 공고" type="small" items={visibleItems} />
    </NewJobSectionContainer>
  );
});
export default PopularJobSection;
