import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerSearchButtonContainer = styled.button`
  label: career-search-button-container;
  padding: 12px;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${emotionTheme.color.black1};
  }

  &:active {
    background-color: ${emotionTheme.color.black2};
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 40px;
  }
`;
