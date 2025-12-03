import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const DdayContainer = styled.div<{ isRed: boolean }>`
  label: dday-container;
  height: 24px;
  color: ${emotionTheme.color.white};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  border-radius: 8px;
  background-color: ${props =>
    props.isRed ? emotionTheme.color.error[400] : emotionTheme.color.gray[400]};
  padding: 4px 8px;
  text-align: center;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 20px;
    font-size: 10px;
    line-height: 12px;
    border-radius: 8px;
  }
`;
