import { SemesterToKR } from '@constants/timetable.constant';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { OverlayPosition } from 'elements/Overlay';
import TimeTableListItem from './TimeTableListItem';

import { ListContainer, List, TemplateText } from './TimeTableList.style';

interface TimeTableListProps {
  show: boolean;
  placement: (typeof OverlayPosition)[keyof typeof OverlayPosition];
  onHide: () => void;
}

function TimeTableList({ show, onHide }: TimeTableListProps) {
  const { timeTablesAction, timeTableTemplates } = useTimeTableContext();

  return (
    <>
      {show && (
        <ListContainer>
          {timeTableTemplates.map(template => (
            <List key={`${template.year}-${template.semester}`}>
              <TemplateText>
                {template.year}년 {SemesterToKR[template.semester!]}
              </TemplateText>
              {timeTablesAction?.toValueArray().map(timetable => {
                if (
                  timetable.year === template.year &&
                  timetable.semester === template.semester
                ) {
                  return (
                    <li key={timetable.uuid}>
                      <TimeTableListItem timetable={timetable} />
                    </li>
                  );
                }
              })}
            </List>
          ))}
        </ListContainer>
      )}
    </>
  );
}

export default TimeTableList;
