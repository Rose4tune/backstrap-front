import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import { SchoolCourseEntityView, DayOfWeek } from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { getDayAndTimeRangeOfTheDay } from '@utils/bagstrap/timetable.utils';
import { TempSchoolCourse, TempCustomCourse } from '@pages/my/timetable/legacy';
import Close from 'public/icons/close.svg';
import {
  CourseBlockArea,
  // CourseTimeRange,
  ProfessorName,
  RoomName,
  SubjectName
} from './CourseBlock.style';

interface CourseBlockProps {
  course: TempSchoolCourse | TempCustomCourse;
  day: DayOfWeek;
  style?: {
    height: string;
    top: string;
    left: string;
  };
  className?: string;
}

function CourseBlock({ course, day, style, className }: CourseBlockProps) {
  const { deleteTempSchoolCourse, deleteTempCustomCourse } = useTimeTableContext();

  const [hovering, setHovering] = useState(false);

  const handleDeleteCourse = useCallback(() => {
    if (course.hasOwnProperty('roomName')) {
      deleteTempSchoolCourse(course as TempSchoolCourse);
    } else {
      deleteTempCustomCourse(course as TempCustomCourse);
    }
  }, [course, deleteTempCustomCourse, deleteTempSchoolCourse]);

  const CloseIcon = useMemo(
    () => (
      <Close
        className={clsx(
          'w-[16px] h-[16px]',
          'opacity-0 cursor-pointer',
          'transition-all duration-200 ease-in-out',
          hovering && 'opacity-100'
        )}
        onClick={handleDeleteCourse}
      />
    ),
    [handleDeleteCourse, hovering]
  );

  return (
    <CourseBlockArea
      height={style?.height}
      top={style?.top}
      left={style?.left}
      backgroundColor={course.color}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <SubjectName>{course.subjectName}</SubjectName>
      <ProfessorName>{course.professors}</ProfessorName>
      <RoomName>
        {course.hasOwnProperty('roomName')
          ? (course as SchoolCourseEntityView).roomName
          : null}
      </RoomName>
    </CourseBlockArea>
  );
}

export default CourseBlock;
