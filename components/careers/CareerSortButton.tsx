import useScreenSize from '@hooks/useScreenSize.hook';

import GrayButton from '@common/button/GrayButton';

import {
  CareerSortButtonContainer,
  CareerSortButtonContent
} from './CareerSortButton.style';

const CareerSortButton = ({
  sortValue,
  onSortChange
}: {
  sortValue: 'UPLOAD' | 'DEADLINE';
  onSortChange: (sortType: 'UPLOAD' | 'DEADLINE') => void;
}) => {
  const screenSize = useScreenSize();

  const handleSortChange = (sortType: 'UPLOAD' | 'DEADLINE') => {
    onSortChange(sortType);
  };

  return (
    <>
      {screenSize !== 'small' ? (
        <CareerSortButtonContainer>
          <CareerSortButtonContent
            onClick={() => handleSortChange('UPLOAD')}
            sortName="UPLOAD"
            selected={sortValue}
          >
            최신순
          </CareerSortButtonContent>
          <CareerSortButtonContent
            onClick={() => handleSortChange('DEADLINE')}
            sortName="DEADLINE"
            selected={sortValue}
          >
            마감순
          </CareerSortButtonContent>
        </CareerSortButtonContainer>
      ) : sortValue === 'UPLOAD' ? (
        <GrayButton
          text="최신순"
          size="sm"
          onClick={() => handleSortChange('DEADLINE')}
        />
      ) : (
        <GrayButton text="마감순" size="sm" onClick={() => handleSortChange('UPLOAD')} />
      )}
    </>
  );
};

export default CareerSortButton;
