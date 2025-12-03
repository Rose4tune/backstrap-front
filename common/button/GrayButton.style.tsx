import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const GrayButtonContainer = styled.button<{ size: 'sm' | 'lg' | undefined }>`
  label: gray-button-container;
  display: block;
  width: fit-content;
  background-color: ${emotionTheme.color.white};
  font-weight: 500;
  border-radius: 12px;
  white-space: nowrap;
  color: ${emotionTheme.color.gray[600]};
  padding: ${({ size }) => (size === 'sm' ? '8px 12px' : '10px 12px')};
  font-size: ${({ size }) => (size === 'sm' ? '14px' : '16px')};
  line-height: ${({ size }) => (size === 'sm' ? '20px' : '24px')};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: ${({ size }) => !size && '8px 12px'};
    font-size: ${({ size }) => !size && '20px'};
  }

  &:hover {
    background-color: ${emotionTheme.color.black1};
  }

  &:active {
    background-color: ${emotionTheme.color.black2};
  }
`;
