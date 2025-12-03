import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const TimeTableGridArea = styled.div`
  label: time-table-grid-area;
  width: 936px;
  display: flex;
  align-self: center;
  border-radius: 4px;
  font-family: Pretendard;
  overflow: hidden;
  border: 1px solid ${emotionTheme.color.gray[300]};
  border-radius: 4px;

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: auto;
    max-width: 999px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: auto;
    min-width: 336px;
  }
`;

export const DayScheduleArea = styled.div`
  label: day-schedule-area;
  display: flex;
  width: 100%;
`;
