/** @jsxImportSource @emotion/react */

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  DayOfWeek,
  TimeTableEntityView,
  useEditTimeTableMutation
} from '@generated/graphql';
import useTimeTableContext from '@hooks/context/useTimeTableContext.hook';
import Star from 'public/icons/star.svg';

import {
  StyledStarIcon,
  ButtonText,
  Container,
  IconContainer,
  SelectButtonText,
  SelectContainer,
  SelectIconContainer
} from './TimeTableListItem.style';
import { DEFAULT_DAYS_OF_WEEK } from '@constants/timetable.constant';

interface TimeTableListItemProps {
  timetable: TimeTableEntityView;
  handleShowSelectList?: () => void;
}

const TimeTableListItem = ({
  timetable,
  handleShowSelectList
}: TimeTableListItemProps) => {
  const {
    currentTimeTable,
    timeTableTemplates,
    setCurrentTimeTable,
    daysOfWeek,
    setDaysOfWeek,
    setHourRange,
    timeTablesAction,
    setCurrentTimeTableTemplate
  } = useTimeTableContext();
  const isCurrentTimeTable = timetable.uuid === currentTimeTable?.uuid;

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const isMobileView = windowWidth < 1024;

  const StarIcon = useMemo(
    () => <StyledStarIcon as={Star} isFavorite={timetable.isFavorite} />,
    [timetable.isFavorite]
  );

  const [editTimeTable] = useEditTimeTableMutation();

  const handleClickFavorite = () => {
    if (timetable) {
      editTimeTable({
        variables: {
          input: {
            uuid: timetable.uuid,
            isFavorite: !timetable.isFavorite
          }
        },
        onCompleted: data => {
          setCurrentTimeTable(data.editTimeTable);
          timeTablesAction?.upsert(timetable.uuid, data.editTimeTable);
        }
      });
    }
  };

  const handleClickItem = useCallback(() => {
    const daysToAdd = new Set<DayOfWeek>(DEFAULT_DAYS_OF_WEEK);
    let earliestStart = 24;
    let latestEnd = 0;

    const parseTime = (time: string): number => {
      const [hour] = time.split(':').map(Number);
      return hour;
    };

    timetable.customCourses?.forEach((course: any) => {
      course.dayAndTimeRanges?.forEach((range: any) => {
        if (range.dayOfWeek === 'SATURDAY') {
          daysToAdd.add(DayOfWeek.Saturday);
        } else if (range.dayOfWeek === 'SUNDAY') {
          daysToAdd.add(DayOfWeek.Saturday);
          daysToAdd.add(DayOfWeek.Sunday);
        }
        // 시간 계산
        const start = parseTime(range.timeRange.fromTime);
        const end = parseTime(range.timeRange.toTime);
        earliestStart = Math.min(earliestStart, start);
        latestEnd = Math.max(latestEnd, end);
      });
    });

    timetable.schoolCourses?.forEach((course: any) => {
      course.dayAndTimeRanges?.forEach((range: any) => {
        if (range.dayOfWeek === DayOfWeek.Saturday) {
          daysToAdd.add(DayOfWeek.Saturday);
        } else if (range.dayOfWeek === DayOfWeek.Sunday) {
          daysToAdd.add(DayOfWeek.Saturday);
          daysToAdd.add(DayOfWeek.Sunday);
        }
        // 시간 계산
        const start = parseTime(range.timeRange.fromTime);
        const end = parseTime(range.timeRange.toTime);
        earliestStart = Math.min(earliestStart, start);
        latestEnd = Math.max(latestEnd, end);
      });
    });

    const hourRange = {
      from: earliestStart < 9 ? earliestStart : 9,
      to: latestEnd > 18 ? latestEnd + 1 : 18
    };

    setHourRange(hourRange);

    setDaysOfWeek([...daysToAdd]);

    setCurrentTimeTable(timetable);

    const newCurrentTimeTableTemplate = timeTableTemplates.find(
      template =>
        template.year === timetable.year && template.semester === timetable.semester
    );

    if (newCurrentTimeTableTemplate) {
      setCurrentTimeTableTemplate(newCurrentTimeTableTemplate);
    }
  }, [setCurrentTimeTable, setCurrentTimeTableTemplate, timeTableTemplates, timetable]);

  return (
    <>
      {isMobileView ? (
        <SelectContainer
          onClick={() => {
            handleClickItem();
            if (handleShowSelectList) {
              handleShowSelectList();
            }
          }}
          isCurrentTimeTable={isCurrentTimeTable}
        >
          <SelectButtonText isCurrentTimeTable={isCurrentTimeTable}>
            {timetable.name}
          </SelectButtonText>
          <SelectIconContainer onClick={handleClickFavorite}>
            {StarIcon}
          </SelectIconContainer>
        </SelectContainer>
      ) : (
        <Container onClick={handleClickItem} isCurrentTimeTable={isCurrentTimeTable}>
          <ButtonText isCurrentTimeTable={isCurrentTimeTable}>
            {timetable.name}
          </ButtonText>
          <IconContainer onClick={handleClickFavorite}>{StarIcon}</IconContainer>
        </Container>
      )}
    </>
  );
};

export default TimeTableListItem;
