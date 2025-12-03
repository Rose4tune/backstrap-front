import Overlay, { OverlayPosition } from 'elements/Overlay';
import { useCallback, useMemo, useRef, useState } from 'react';

import ListOpenIcon from '@public/icons/[layout]list-open.svg';
import TimeTabelSelectItem from './TimeTableSelectItem';
import clsx from 'clsx';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { SemesterToKR } from '@constants/timetable.constant';
import {
  TimeTableList,
  TimeTableName,
  TimeTableSelectArea,
  TimeTableSelectBox
} from './TimeTableSelect.style';

interface TimeTableSelectProps {
  onSelect: (yearAndSemester: string) => void;
}

function TimeTableSelect({ onSelect }: TimeTableSelectProps) {
  const { currentTimeTableTemplate, setCurrentTimeTableTemplate, timeTableTemplates } =
    useTimeTableContext();

  const inputRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onHideSelectList = useCallback(() => {
    setOpen(false);
  }, []);

  const handleShowSelectList = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const yearAndSemesters = useMemo(
    () =>
      timeTableTemplates.map(
        template => `${template.year}년 ${SemesterToKR[template.semester!]}`
      ),
    [timeTableTemplates]
  );

  const handleSelect = useCallback(
    (yearAndSemester: string) => {
      onSelect(yearAndSemester);
      setCurrentTimeTableTemplate(
        timeTableTemplates[yearAndSemesters.findIndex(x => x == yearAndSemester)]
      );
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <TimeTableSelectArea>
      <TimeTableSelectBox open={open} ref={inputRef} onClick={handleShowSelectList}>
        <TimeTableName>
          {currentTimeTableTemplate?.year}년{' '}
          {SemesterToKR[currentTimeTableTemplate?.semester!]}
        </TimeTableName>

        <ListOpenIcon />
      </TimeTableSelectBox>

      <Overlay
        show={open}
        target={inputRef.current}
        placement={OverlayPosition.BOTTOM}
        onHide={onHideSelectList}
        rootClose
        marginY={2}
      >
        <TimeTableList>
          {yearAndSemesters.map(yearAndSemester => (
            <TimeTabelSelectItem
              key={yearAndSemester}
              yearAndSemester={yearAndSemester!}
              onSelect={handleSelect}
            />
          ))}
        </TimeTableList>
      </Overlay>
    </TimeTableSelectArea>
  );
}

export default TimeTableSelect;
