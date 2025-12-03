import { TimeTableEntityView } from '@generated/graphql';
import { memo, useCallback } from 'react';
import { TimeTableSelectItemRow } from './TimeTableSelectItem.style';

interface TimeTabelSelectItemProps {
  yearAndSemester: string;
  onSelect: (yearAndSemester: string) => void;
}

function TimeTabelSelectItem({ yearAndSemester, onSelect }: TimeTabelSelectItemProps) {
  const handleClick = useCallback(() => {
    onSelect(yearAndSemester);
  }, [yearAndSemester, onSelect]);

  return (
    <TimeTableSelectItemRow onClick={handleClick}>
      {yearAndSemester}
    </TimeTableSelectItemRow>
  );
}

export default memo(TimeTabelSelectItem);
