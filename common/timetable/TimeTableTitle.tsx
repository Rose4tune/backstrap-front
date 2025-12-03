import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { useCallback } from 'react';
import {
  TimeTableTitleArea,
  TimeTableName,
  CurrentTimeTableName
} from './TimeTableTitle.style';

interface TimeTableTitleProps {}

function TimeTableTitle({}: TimeTableTitleProps) {
  const { setOptionOverlayTarget, currentTimeTable } = useTimeTableContext();

  const setRef = useCallback(
    (ref: HTMLDivElement) => {
      setOptionOverlayTarget(ref);
    },
    [setOptionOverlayTarget]
  );

  return (
    <TimeTableTitleArea ref={setRef}>
      <TimeTableName>시간표 이름</TimeTableName>
      <CurrentTimeTableName>{currentTimeTable?.name}</CurrentTimeTableName>
    </TimeTableTitleArea>
  );
}

export default TimeTableTitle;
