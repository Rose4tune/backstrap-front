import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const Content = styled.div`
  label: content;
  /* max-width: 1280px; */
  /* margin-left: auto;
  margin-right: auto; */

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    /* max-width: 960px; */
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    /* max-width: 960px; */
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    /* max-width: 358px; */
  }
`;
