/** @jsxImportSource @emotion/react */

import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { SemesterToKR } from '@constants/timetable.constant';

import {
  TimeTableListSelectBox,
  TimeTableListContainer,
  TimeTableListTitle,
  TimeTableList
} from './MobileTimeTableList.style';
import TimeTableListItem from './TimeTableListItem';

interface MobileTimeTableListProps {
  open: boolean;
  buttonWidth: number | null;
  inputRef: React.RefObject<HTMLButtonElement>;
  onHideSelectList: () => void;
  handleShowSelectList: () => void;
}

function MobileTimeTableList({
  buttonWidth,
  handleShowSelectList
}: MobileTimeTableListProps) {
  const { timeTableTemplates, timeTablesAction } = useTimeTableContext();

  return (
    <TimeTableListSelectBox buttonWidth={buttonWidth}>
      {timeTableTemplates.length > 0 && (
        <>
          {timeTableTemplates.map(template => (
            <TimeTableListContainer key={`${template.year}-${template.semester}`}>
              <TimeTableListTitle>
                {template.year}년 {SemesterToKR[template.semester!]}
              </TimeTableListTitle>
              <TimeTableList>
                {timeTablesAction?.toValueArray().map(timetable => {
                  if (
                    timetable.year === template.year &&
                    timetable.semester === template.semester
                  ) {
                    return (
                      <li key={timetable.uuid}>
                        <TimeTableListItem
                          timetable={timetable}
                          handleShowSelectList={handleShowSelectList}
                        />
                      </li>
                    );
                  }
                })}
              </TimeTableList>
            </TimeTableListContainer>
          ))}
        </>
      )}
    </TimeTableListSelectBox>
  );
}

export default MobileTimeTableList;
