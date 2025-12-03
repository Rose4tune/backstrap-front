import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@stores/useStore.hook';
import {
  CustomCourseEntityView,
  SchoolCourseEntityView,
  SchoolCoursesDocument,
  SchoolCourseSortType,
  SchoolCoursesQuery,
  SchoolCoursesQueryVariables,
  TimeTableEntityView,
  TimeTablesDocument,
  TimeTablesQuery,
  TimeTablesQueryVariables,
  TimeTableTemplate,
  TimeTableTemplatesDocument,
  TimeTableTemplatesQuery,
  TimeTableTemplatesQueryVariables
} from '@generated/graphql';

import { TimeTableColors } from '@constants/timetable.constant';
import { useApolloClient } from '@hooks/useApolloClient';
import { ApolloError } from '@apollo/client';

export interface TempSchoolCourse extends SchoolCourseEntityView {
  color: TimeTableColors;
}

export interface TempCustomCourse extends CustomCourseEntityView {
  color: TimeTableColors;
}

export const useTimeTable = () => {
  const { MeStore } = useStore();

  const [timeTables, setTimeTables] = useState<TimeTableEntityView[]>([]);
  const [timeTableTemplates, setTimeTableTemplates] = useState<TimeTableTemplate[]>([]);
  const [currentTimeTableTemplate, setCurrentTimeTableTemplate] =
    useState<TimeTableTemplate | null>(null);

  const [currentTimeTable, setCurrentTimeTable] = useState<
    TimeTableEntityView | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [schoolCourses, setSchoolCourses] = useState<SchoolCourseEntityView[]>([]);

  const apolloClient = useApolloClient();

  useEffect(() => {
    if (!apolloClient || !MeStore.me.uuid) return;
    const cacheKey = `timetable_cache_${MeStore.me.uuid}`;

    const cached = localStorage.getItem(cacheKey);
    let usedCache = false;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);

        setTimeTables(parsed.timeTables || []);
        setTimeTableTemplates(parsed.timeTableTemplates || []);
        setCurrentTimeTableTemplate(parsed.timeTableTemplates?.[0] || null);
        setLoading(false);
        usedCache = true;
      } catch (e) {
        console.warn('캐시 파싱 실패:', e);
      }
    }
    if (usedCache) return;

    const fetchTimeTable = async () => {
      if (!apolloClient) return;

      try {
        const [
          {
            data: { timeTables }
          },
          {
            data: { timeTableTemplates }
          },
          {
            data: { schoolCoursesByCursor }
          }
        ] = await Promise.all([
          apolloClient.query<TimeTablesQuery, TimeTablesQueryVariables>({
            query: TimeTablesDocument,
            variables: {
              input: { userUuid: MeStore.me.uuid }
            }
          }),
          apolloClient.query<TimeTableTemplatesQuery, TimeTableTemplatesQueryVariables>({
            query: TimeTableTemplatesDocument
          }),
          apolloClient.query<SchoolCoursesQuery, SchoolCoursesQueryVariables>({
            query: SchoolCoursesDocument,
            variables: {
              input: {
                paginationRequestDto: { count: 100 },
                sortType: SchoolCourseSortType.SubjectName,
                searchKeyword: { keyword: '' }
              }
            }
          })
        ]);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timeTables,
            timeTableTemplates
          })
        );

        setTimeTableTemplates(
          timeTableTemplates.filter(template => template !== null) as TimeTableTemplate[]
        );
        setCurrentTimeTableTemplate(timeTableTemplates?.[0] || null);
        setTimeTables(
          timeTables.filter(table => table !== null) as TimeTableEntityView[]
        );

        setSchoolCourses(
          (schoolCoursesByCursor?.data || []).filter(
            course => course !== null
          ) as SchoolCourseEntityView[]
        );

        setLoading(false);
      } catch (e) {
        if (e instanceof ApolloError) {
          console.error('GraphQL Errors:', e.graphQLErrors);
          console.error('Network Error:', e.networkError);
          console.error('Message:', e.message);
        } else {
          console.error('Unexpected Error:', e);
        }
        setLoading(false);
        setTimeTables([]);
        setTimeTableTemplates([]);
      }
    };
    fetchTimeTable();
  }, [apolloClient, MeStore.me.uuid]);

  return {
    timeTables,
    timeTableTemplates,
    currentTimeTableTemplate,
    setCurrentTimeTableTemplate,
    currentTimeTable,
    setCurrentTimeTable,
    loading,
    schoolCourses,
    setSchoolCourses
  };
};
