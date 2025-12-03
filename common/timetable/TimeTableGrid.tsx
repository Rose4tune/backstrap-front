import { DayOfWeek } from '@generated/graphql';
import DayColumn from './DayColumn';
import HourList from './HourList';
import { TimeTableGridArea, DayScheduleArea } from './TimeTableGrid.style';

interface TimeTableGridProps {
  daysOfWeek: DayOfWeek[];
}

function TimeTableGrid({ daysOfWeek }: TimeTableGridProps) {
  return (
    <TimeTableGridArea id="timetable">
      <HourList />
      <DayScheduleArea>
        {daysOfWeek.includes(DayOfWeek.Monday) && <DayColumn day={DayOfWeek.Monday} />}
        {daysOfWeek.includes(DayOfWeek.Tuesday) && <DayColumn day={DayOfWeek.Tuesday} />}
        {daysOfWeek.includes(DayOfWeek.Wednesday) && (
          <DayColumn day={DayOfWeek.Wednesday} />
        )}
        {daysOfWeek.includes(DayOfWeek.Thursday) && (
          <DayColumn day={DayOfWeek.Thursday} />
        )}
        {daysOfWeek.includes(DayOfWeek.Friday) && <DayColumn day={DayOfWeek.Friday} />}
        {daysOfWeek.includes(DayOfWeek.Saturday) && (
          <DayColumn day={DayOfWeek.Saturday} />
        )}
        {daysOfWeek.includes(DayOfWeek.Sunday) && <DayColumn day={DayOfWeek.Sunday} />}
      </DayScheduleArea>
    </TimeTableGridArea>
  );
}

export default TimeTableGrid;
