import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const DayColumnArea = styled.div<{ rowHeight: string }>`
  label: day-column-area;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  flex: 1;

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
  }
`;

export const DayCell = styled.div`
  label: day-cell;
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${emotionTheme.color.gray[900]};
  font-weight: 600;
  font-size: 16px;
  font-family: Pretendard;
  line-height: 22.4px;
  border-left: 1px solid ${emotionTheme.color.gray[300]};
  box-sizing: content-box;

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    height: 36px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 20px;
    width: 100%;
  }
`;

export const DayCellStyle = styled.div`
  label: day-cell-style;
  display: block;
  width: 100%;
  height: 80px;
  user-select: none;
  box-sizing: border-box;
  user-select: none;
  border-left: 1px solid ${emotionTheme.color.gray[300]};
  border-top: 1px solid ${emotionTheme.color.gray[300]};

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 100%;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 100%;
  }
`;
