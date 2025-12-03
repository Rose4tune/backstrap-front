import { useCallback, useMemo } from 'react';

import { DayOfWeek } from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import {
  getCourseBlockPositionStyle,
  isCourseInTheDay
} from '@utils/bagstrap/timetable.utils';
import { DaysOfWeekTranslator, TimeTableColors } from '@constants/timetable.constant';
import CourseBlock from './CourseBlock';
import { DayColumnArea, DayCellStyle, DayCell } from './DayColumn.style';
import range from 'lodash/range';

interface DayColumnProps {
  day: DayOfWeek;
}

function DayColumn({ day }: DayColumnProps) {
  const { tempCustomCourses, tempSchoolCourses, hoveredCourse, hourRange } =
    useTimeTableContext();
  const renderSchoolCourses = useCallback(() => {
    const renderList: JSX.Element[] = [];
    tempSchoolCourses.get(day)?.forEach(course => {
      if (course?.dayAndTimeRanges) {
        course.dayAndTimeRanges.forEach(range => {
          if (
            !!range &&
            range.dayOfWeek === day &&
            parseInt(range.timeRange?.fromTime) >= hourRange.from &&
            parseInt(range.timeRange?.toTime) <= hourRange.to
          ) {
            const blockPositionStyle = getCourseBlockPositionStyle(range, hourRange);
            renderList.push(
              <CourseBlock
                key={course.uuid}
                course={course}
                day={day}
                style={blockPositionStyle}
              />
            );
          }
        });
      }
    });
    return renderList;
  }, [day, hourRange, tempSchoolCourses]);

  const renderCustomCourses = useCallback(() => {
    const renderList: JSX.Element[] = [];
    tempCustomCourses.get(day)?.forEach(course => {
      if (course?.dayAndTimeRanges) {
        course.dayAndTimeRanges.forEach(range => {
          // NOTE: 하나의 course 내에서도 여러 요일에 걸친 range를 가질 수 있기에 range에도 day 필터를 걸어줘야 함.
          if (
            !!range &&
            range.dayOfWeek === day &&
            parseInt(range.timeRange?.fromTime) >= hourRange.from &&
            parseInt(range.timeRange?.toTime) <= hourRange.to
          ) {
            const blockPositionStyle = getCourseBlockPositionStyle(range, hourRange);
            renderList.push(
              <CourseBlock
                key={course.uuid}
                course={course}
                day={day}
                style={blockPositionStyle}
              />
            );
          }
        });
      }
    });
    return renderList;
  }, [day, hourRange, tempCustomCourses]);

  const renderHoveredCourse = useCallback(() => {
    if (isCourseInTheDay(hoveredCourse, day)) {
      return hoveredCourse.dayAndTimeRanges?.map(range => {
        if (!!range) {
          const blockPositionStyle = getCourseBlockPositionStyle(range, hourRange);
          const tempHoveredCourse = { ...hoveredCourse, color: TimeTableColors.Hovered };
          return (
            <CourseBlock
              className="animate-[fade-in_0.3s_ease-in-out]"
              key={hoveredCourse.uuid}
              course={tempHoveredCourse}
              day={day}
              style={blockPositionStyle}
            />
          );
        }
      });
    }
    return null;
  }, [day, hourRange, hoveredCourse]);

  const rowHeight = useMemo(
    () => `${hourRange.to - hourRange.from + 1 * 50}px`,
    [hourRange.from, hourRange.to]
  );

  return (
    <DayColumnArea rowHeight={rowHeight}>
      <div>
        <DayCell>{DaysOfWeekTranslator[day]}</DayCell>
      </div>
      <div>
        {range(hourRange.from, hourRange.to).map(hour => (
          <DayCellStyle key={hour}></DayCellStyle>
        ))}
        {renderSchoolCourses()}
        {renderCustomCourses()}
        {renderHoveredCourse()}
      </div>
    </DayColumnArea>
  );
}

export default DayColumn;
