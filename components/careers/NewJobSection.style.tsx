import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const NewJobSectionContainer = styled.div`
  label: new-job-section-container;
  width: 100%;
  margin-top: 40px;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
  }
`;
