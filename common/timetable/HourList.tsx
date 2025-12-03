import range from 'lodash/range';

import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { useMemo } from 'react';
import { HourHeader, HourListArea, HourListColumn, HourText } from './HourList.style';

interface HourListProps {}

function HourList({}: HourListProps) {
  const { hourRange } = useTimeTableContext();

  const rowHeight = useMemo(
    () => `
      ${hourRange.to - hourRange.from + 1 * 50}px`,
    [hourRange.from, hourRange.to]
  );

  return (
    <HourListArea>
      <HourListColumn>
        <HourHeader key="hour-header"> </HourHeader>
        {range(hourRange.from, hourRange.to).map(hour => (
          <HourText key={hour}>{hour}</HourText>
        ))}
      </HourListColumn>
    </HourListArea>
  );
}

export default HourList;
