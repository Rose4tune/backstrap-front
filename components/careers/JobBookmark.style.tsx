import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const JobBookmarkContainer = styled.div<{
  selected: boolean;
  defaultColor: 'grey' | 'white';
}>`
  label: job-bookmark-container;
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 20px;
    height: 20px;
  }
`;
