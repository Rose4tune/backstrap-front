import SearchInput from '@common/input/SearchInput';

import Search16pxIcon from '@public/icons/search-16px.svg';

import { CareerSearchButtonContainer } from './CareerSearchButton.style';

interface CareerSearchButtonProps {
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const CareerSearchButton = ({
  value,
  isSelected,
  onSelect,
  onChange,
  onSubmit,
  onClear
}: CareerSearchButtonProps) => {
  return (
    <>
      {isSelected ? (
        <>
          <SearchInput
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            onClear={onClear}
          />
        </>
      ) : (
        <CareerSearchButtonContainer onClick={onSelect}>
          <Search16pxIcon />
        </CareerSearchButtonContainer>
      )}
    </>
  );
};

export default CareerSearchButton;
