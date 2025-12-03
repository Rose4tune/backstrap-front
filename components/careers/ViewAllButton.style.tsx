import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const ViewAllButtonContainer = styled.button`
  label: view-all-button-container;
  display: block;
  width: fit-content;
  font-weight: 500;
  color: ${emotionTheme.color.gray[600]};
  padding: 10px 12px;
  font-size: 16px;
  line-height: 24px;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    padding: 10px 12px;
    font-size: 16px;
    line-height: 24px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
  }
`;
