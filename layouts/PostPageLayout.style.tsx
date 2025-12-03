import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const PostPageLayoutContainer = styled.div`
  label: post-page-layout-container;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 28px;
  padding-left: 60px; 
  padding-right: 60px;
  min-width: 1280px;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  @media (min-width: 1280px) {
      min-width: 673px;
      padding-top: 28px;
  }

`;

