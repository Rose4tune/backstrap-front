import clsx from 'clsx';

import { SchoolCourseEntityView } from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import { useCallback } from 'react';
import { TimeTableColors } from '@constants/timetable.constant';

interface CourseListItemProp {
  schoolCourse: SchoolCourseEntityView;
}

function CourseListItem({ schoolCourse }: CourseListItemProp) {
  const {
    tempSchoolCourses,
    tempCustomCourses,
    setHoveredCourse,
    addTempSchoolCourse,
    courseCount
  } = useTimeTableContext();

  const handleHoverCourse = useCallback(() => {
    setHoveredCourse(schoolCourse);
  }, [setHoveredCourse, schoolCourse]);

  const handleHoverOutCourse = useCallback(() => {
    setHoveredCourse({} as SchoolCourseEntityView);
  }, [setHoveredCourse]);

  const handleClickCourse = useCallback(() => {
    const color = Object.values(TimeTableColors)[courseCount % 10];
    addTempSchoolCourse(schoolCourse, color, tempSchoolCourses);
  }, [addTempSchoolCourse, courseCount, schoolCourse]);

  return (
    <div
      className={clsx(
        'box-border p-2',
        'border-t-[2px] border-t-[#000000]/10',
        'hover:bg-[#EFF6F6]',
        'transition-all duration-200 ease-in-out',
        'cursor-pointer'
      )}
      onMouseEnter={handleHoverCourse}
      onMouseLeave={handleHoverOutCourse}
      onClick={handleClickCourse}
    >
      <div className="flex justify-between">
        <div className="font-bold text-[18px]">{schoolCourse.subjectName}</div>
        <div className="text-[#A6A6A6] text-[14px]">
          담은끈 <span className="font-bold">{schoolCourse.numBooking}</span>
        </div>
      </div>
      <div className="text-[16px]">{schoolCourse.professors}</div>
      <div className="mt-3 text-[14px]">{schoolCourse.time}</div>
      <div className="text-[14px]">{schoolCourse.roomName}</div>
      <div className="text-[14px]">
        {schoolCourse.subDescription?.replaceAll(' ', ' · ')}
      </div>
    </div>
  );
}

export default CourseListItem;
