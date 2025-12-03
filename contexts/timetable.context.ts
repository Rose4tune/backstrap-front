import { createContext, Dispatch, SetStateAction } from 'react';

import {
  CategoryRefViewDto,
  CustomCourseEntityView,
  DayOfWeek,
  SchoolCourseEntityView,
  TimeTableEntityView,
  TimeTableTemplate
} from '@generated/graphql';
import { CourseSorting, TimeTableColors } from '@constants/timetable.constant';
import { TempCustomCourse, TempSchoolCourse } from '@pages/my/timetable/legacy';
import { Actions } from '@hooks/useImmutableMap.hook';

const noop = () => {};

export interface HourRange {
  from: number;
  to: number;
}

export interface TimeTableContextType {
  timeTables: Map<string, TimeTableEntityView>;
  timeTablesAction?: Actions<string, TimeTableEntityView>;
  timeTableTemplates: TimeTableTemplate[];
  currentTimeTableTemplate: TimeTableTemplate | null;
  setCurrentTimeTableTemplate: (template: TimeTableTemplate | null) => void;
  currentTimeTable?: TimeTableEntityView;
  setCurrentTimeTable: (timetable?: TimeTableEntityView) => void;
  tempSchoolCourses: Map<DayOfWeek, TempSchoolCourse[]>;
  tempCustomCourses: Map<DayOfWeek, TempCustomCourse[]>;
  addTempSchoolCourse: (
    item: SchoolCourseEntityView,
    color: TimeTableColors,
    tempMap: Map<DayOfWeek, TempSchoolCourse[]>
  ) => void;
  addTempCustomCourse: (
    item: CustomCourseEntityView,
    color: TimeTableColors,
    tempMap: Map<DayOfWeek, TempCustomCourse[]>
  ) => void;
  deleteTempSchoolCourse: (course: TempSchoolCourse) => void;
  deleteTempCustomCourse: (course: TempCustomCourse) => void;
  hoveredCourse: SchoolCourseEntityView;
  setHoveredCourse: Dispatch<SetStateAction<SchoolCourseEntityView>>;
  courseCount: number;
  setCourseCount: Dispatch<SetStateAction<number>>;

  campus?: CategoryRefViewDto | undefined;
  college?: CategoryRefViewDto | undefined;
  major?: CategoryRefViewDto | undefined;
  search?: string;
  sorting?: (typeof CourseSorting)[keyof typeof CourseSorting];
  setCampus?: Dispatch<SetStateAction<CategoryRefViewDto | undefined>>;
  setCollege?: Dispatch<SetStateAction<CategoryRefViewDto | undefined>>;
  setMajor?: Dispatch<SetStateAction<CategoryRefViewDto | undefined>>;
  setSearch?: Dispatch<SetStateAction<string>>;
  setSorting?: Dispatch<
    SetStateAction<(typeof CourseSorting)[keyof typeof CourseSorting]>
  >;

  schoolCourses: SchoolCourseEntityView[];
  setSchoolCourses: Dispatch<SetStateAction<SchoolCourseEntityView[]>>;

  hourRange: HourRange;
  setHourRange: Dispatch<SetStateAction<HourRange>>;
  daysOfWeek: DayOfWeek[];
  setDaysOfWeek: Dispatch<SetStateAction<DayOfWeek[]>>;

  optionOverlayTarget: HTMLDivElement | null;
  setOptionOverlayTarget: Dispatch<SetStateAction<HTMLDivElement | null>>;
  loading: boolean;
}

export const TimeTableContext = createContext<TimeTableContextType>({
  timeTables: new Map(),
  timeTablesAction: undefined,
  timeTableTemplates: [],
  currentTimeTableTemplate: {},
  setCurrentTimeTableTemplate: noop,
  currentTimeTable: {} as TimeTableEntityView,
  setCurrentTimeTable: noop,
  tempSchoolCourses: new Map(),
  tempCustomCourses: new Map(),
  addTempSchoolCourse: noop,
  addTempCustomCourse: noop,
  deleteTempSchoolCourse: noop,
  deleteTempCustomCourse: noop,
  hoveredCourse: {} as SchoolCourseEntityView,
  setHoveredCourse: noop,
  courseCount: 0,
  setCourseCount: noop,

  campus: undefined,
  college: undefined,
  major: undefined,
  search: '',
  sorting: CourseSorting.SUBJECT_NAME,
  setCampus: noop,
  setCollege: noop,
  setMajor: noop,
  setSearch: noop,
  setSorting: noop,

  schoolCourses: [],
  setSchoolCourses: noop,

  hourRange: {
    from: 6,
    to: 20
  },
  setHourRange: noop,
  daysOfWeek: [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday
  ],
  setDaysOfWeek: noop,

  optionOverlayTarget: null,
  setOptionOverlayTarget: noop,
  loading: false
});
