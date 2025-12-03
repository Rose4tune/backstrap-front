import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const HourListArea = styled.div`
  label: hour-list-area;
  width: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  &:first-child {
    border-top-left-radius: 4px;
  }

  &:last-child {
    border-bottom-right-radius: 4px;
  }

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 36px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 20px;
  }
`;

export const HourListColumn = styled.div`
  label: hour-list-column;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

export const HourHeader = styled.div`
  label: hour-header;
  display: block;
  height: 36px;
  width: 36px;
  user-select: none;
  box-sizing: content-box;

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 36px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 20px;
    height: 20px;
  }
`;

export const HourText = styled.div`
  label: hour-text;
  display: block;
  width: 36px;
  height: 80px;
  padding-top: 4px;
  text-align: center;
  color: ${emotionTheme.color.gray[900]};
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  line-height: 22.5px;
  border-top: 1px solid ${emotionTheme.color.gray[300]};
  box-sizing: border-box;

  &:first-child {
    border-top-left-radius: 4px;
  }

  &:last-child {
    border-bottom-right-radius: 4px;
  }

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 36px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 20px;
  }
`;
