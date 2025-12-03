import { DayOfWeek, SemesterType } from '@generated/graphql';

export const TimeTableColors = {
  1: '#F3DCE9',
  2: '#ECE8C5',
  3: '#DDE9F2',
  4: '#F6E2D2',
  5: '#D0C6DA',
  6: '#C6DAD8',
  7: '#F4E2E3',
  8: '#E4EDD3',
  9: '#C6CBDA',
  10: '#DACCC6',
  // 1: '#C6DAD8',
  // 2: '#C6CBDA',
  // 3: '#D0C6DA',
  // 4: '#DACCC6',
  // 5: '#ECE8C5',
  // 6: '#F3DCE9',
  // 7: '#E4EDD3',
  // 8: '#DDE9F2',
  // 9: '#F4E2E3',
  // 10: '#F6E2D2',
  Hovered: 'rgba(215, 215, 215, .8)'
} as const;

export type TimeTableColors = (typeof TimeTableColors)[keyof typeof TimeTableColors];

export const CourseSorting = {
  BOOKING_ASC: '담은 인원 많은 순',
  BOOKING_DESC: '담은 인원 적은 순',
  // RATING_ASC: '별점 높은 순',
  // RATING_DESC: '별점 낮은 순',
  SUBJECT_NAME: '기본(가나다순)'
} as const;

export const DaysOfWeekTranslator = {
  [DayOfWeek.Monday]: '월',
  [DayOfWeek.Tuesday]: '화',
  [DayOfWeek.Wednesday]: '수',
  [DayOfWeek.Thursday]: '목',
  [DayOfWeek.Friday]: '금',
  [DayOfWeek.Saturday]: '토',
  [DayOfWeek.Sunday]: '일'
} as const;

export const TIMETABLE_CELL_HEIGHT = 80;

export const SemesterToKR = {
  [SemesterType.Spring]: '1학기',
  [SemesterType.Summer]: '여름학기',
  [SemesterType.Fall]: '2학기',
  [SemesterType.Winter]: '겨울학기'
} as const;

export const DEFATUL_HOUR_RANGE = { from: 9, to: 18 };

export const DEFAULT_DAYS_OF_WEEK = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday
];

export enum FilterLabels {
  campus = '캠퍼스',
  college = '단과대',
  major = '전공/영역',
  search = '검색어',
  sorting = '정렬'
}
