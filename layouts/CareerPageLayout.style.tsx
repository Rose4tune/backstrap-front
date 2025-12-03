import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerPageLayoutContainer = styled.div`
  label: career-page-layout-container;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 80px;

  @media (max-width: 550px) {
    padding: 28px 12px;
  }
`;
