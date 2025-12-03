import differenceInMinutes from 'date-fns/differenceInMinutes';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import round from 'lodash/round';

import { HourRange } from '@contexts/timetable.context';
import {
  CustomCourseEntityView,
  DayAndTimeRange,
  SchoolCourseEntityView,
  TimeTableEntityView,
  DayOfWeek,
  Maybe,
  TimeTableTemplate
} from '@generated/graphql';
import { TIMETABLE_CELL_HEIGHT } from '@constants/timetable.constant';
import { TempCustomCourse, TempSchoolCourse } from '@pages/my/timetable/legacy';
import html2canvas from 'html2canvas';

// ex) '09:30' -> 570 (= 9 * 60 + 30)
export function convertHHMMToMMMM(time: string) {
  const [hours, minutes] = time.split(':');
  return +hours * 60 + +minutes;
}

export function isIntersectTwoTimeRanges(
  time1: readonly [number, number],
  time2: readonly [number, number]
) {
  const startMax = Math.max(time1[0], time2[0]);
  const endMin = Math.min(time1[1], time2[1]);
  return startMax < endMin;
}

export function isPossibleToAdd(
  tempSchoolCourses: Map<DayOfWeek, TempSchoolCourse[]>,
  tempCustomCourses: Map<DayOfWeek, TempCustomCourse[]>,
  newCourse: SchoolCourseEntityView | CustomCourseEntityView
) {
  if (!newCourse?.dayAndTimeRanges) return true;

  return newCourse?.dayAndTimeRanges
    .map(range => {
      const tempSchoolCoursesOfTheDay = tempSchoolCourses.get(range?.dayOfWeek!) ?? [];
      const tempCustomCoursesOfTheDay = tempCustomCourses.get(range?.dayOfWeek!) ?? [];

      const newCourseTimeRangeOfTheDay = [
        convertHHMMToMMMM(range?.timeRange?.fromTime),
        convertHHMMToMMMM(range?.timeRange?.toTime)
      ] as const;
      const courseTimeRangesOfTheDay: [number, number][] = [];

      // timeRange만 추출
      // ex) [[0, 120], [540, 810], [900, 960], ...]
      tempSchoolCoursesOfTheDay.forEach(course => {
        course.dayAndTimeRanges?.forEach(_range => {
          if (_range?.dayOfWeek === range?.dayOfWeek) {
            courseTimeRangesOfTheDay.push([
              convertHHMMToMMMM(_range?.timeRange?.fromTime),
              convertHHMMToMMMM(_range?.timeRange?.toTime)
            ]);
          }
        });
      });

      // timeRange만 추출
      tempCustomCoursesOfTheDay.forEach(course => {
        course.dayAndTimeRanges?.forEach(_range => {
          if (_range?.dayOfWeek === range?.dayOfWeek) {
            courseTimeRangesOfTheDay.push([
              convertHHMMToMMMM(_range?.timeRange?.fromTime),
              convertHHMMToMMMM(_range?.timeRange?.toTime)
            ]);
          }
        });
      });

      // 추출한 timeRange들과 newCourse의 timeRange를 1:1씩 전부 비교해서 겹치는 게 하나라도 있으면 false, 없으면 true
      return courseTimeRangesOfTheDay.every(
        times => !isIntersectTwoTimeRanges(newCourseTimeRangeOfTheDay, times)
      );
    })
    .every((result: any) => result); // newCourse의 전체 timeRanges에서 true를 반환해야 추가 가능한 course임
}

export function convertCourseDayTimeToKey(dayTime: DayAndTimeRange) {}

export function getCoursesOfTheDay(
  timetable: TimeTableEntityView,
  day: DayOfWeek
): [Maybe<SchoolCourseEntityView>[], Maybe<CustomCourseEntityView>[]] {
  const schoolCourses = timetable.schoolCourses?.filter(course =>
    course?.dayAndTimeRanges?.filter(
      range => !!range?.dayOfWeek && range.dayOfWeek === day
    )
  );

  const customCourses = timetable.customCourses?.filter(course =>
    course?.dayAndTimeRanges?.filter(
      range => !!range?.dayOfWeek && range.dayOfWeek === day
    )
  );

  return [schoolCourses ?? [], customCourses ?? []];
}

export function getCourseBlockPositionStyle(
  dayAndTimeRange: DayAndTimeRange,
  hourRange: HourRange
) {
  const MOBILE_DAY_CELL_HEIGHT = 20;
  const DESKTOP_DAY_CELL_HEIGHT = 36;

  // NOTE: '2023-02-11T'은 Date 형식을 맞추기 위한 임의의 값
  const fromDate = Date.parse('2023-02-11T' + dayAndTimeRange.timeRange?.fromTime);
  const toDate = Date.parse('2023-02-11T' + dayAndTimeRange.timeRange?.toTime);

  const startOfDay = setMinutes(setHours(fromDate, hourRange.from), 0);
  const minutesFromStartOfDay = differenceInMinutes(fromDate, startOfDay);
  const minutes = differenceInMinutes(toDate, fromDate);
  const dayCellHeight =
    window.innerWidth < 1024 ? MOBILE_DAY_CELL_HEIGHT : DESKTOP_DAY_CELL_HEIGHT;
  return {
    height: round((minutes * TIMETABLE_CELL_HEIGHT) / 60) + 'px',
    top:
      round((minutesFromStartOfDay / 60) * TIMETABLE_CELL_HEIGHT + dayCellHeight) + 'px',
    left: '1.5px'
  };
}

export function getDayAndTimeRangeOfTheDay(
  dayAndTimeRanges: Maybe<DayAndTimeRange>[],
  day: DayOfWeek
): DayAndTimeRange | nil {
  return dayAndTimeRanges.find(range => range?.dayOfWeek === day);
}

export function isCourseInTheDay(course: SchoolCourseEntityView, day: DayOfWeek) {
  let inclueded = false;
  course.dayAndTimeRanges?.forEach(range => {
    if (range?.dayOfWeek === day) inclueded = true;
  });
  return inclueded;
}

export function downloadTimeTable(name: string, totalHeight: number) {
  const timetable = document.getElementById('timetable');

  if (timetable) {
    const currentHeight = timetable.style.height;
    timetable.style.height = totalHeight + 'px';

    html2canvas(timetable).then(canvas => {
      const url = canvas.toDataURL('image/jpg');
      const tempAnchor = document.createElement('a');

      if (typeof tempAnchor.download === 'string') {
        tempAnchor.href = url;
        tempAnchor.download = name + '.jpg';
        tempAnchor.style.display = 'none';
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
      } else {
        window.open(url, '_blank', 'noopener noreferrer');
      }
    });

    timetable.style.height = currentHeight;
  }
}

export function getFavoriteTimeTableOfTemplate(
  timetables: TimeTableEntityView[],
  template: TimeTableTemplate
) {
  return timetables.find(
    timetable =>
      timetable?.year === template?.year && timetable.semester === template.semester
  );
}
