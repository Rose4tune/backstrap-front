import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const StyledStarIcon = styled('svg')<{ isFavorite: boolean | null | undefined }>`
  label: styled-star-icon;
  width: 20px;
  height: 20px;
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  fill: ${({ isFavorite, theme }) =>
    isFavorite ? '#FFD30C' : emotionTheme.color.gray[300]};
  & > path {
    stroke: none;
  }
`;

export const Container = styled.button<{ isCurrentTimeTable: boolean }>`
  label: container;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid
    ${({ isCurrentTimeTable }) =>
      isCurrentTimeTable
        ? emotionTheme.color.turqoise[600]
        : emotionTheme.color.gray[400]};
  width: 100%;
  display: flex;

  &:hover {
    background-color: ${emotionTheme.color.turqoise[100]};
  }

  &:active {
    background-color: ${emotionTheme.color.turqoise[200]};
    border: 1px solid ${emotionTheme.color.turqoise[600]};
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const ButtonText = styled.span<{ isCurrentTimeTable: boolean }>`
  label: button-text;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${({ isCurrentTimeTable }) =>
    isCurrentTimeTable ? emotionTheme.color.turqoise[600] : emotionTheme.color.gray[900]};
`;

export const IconContainer = styled.div`
  label: icon-container;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SelectContainer = styled.button<{ isCurrentTimeTable: boolean }>`
  label: select-container;
  padding: 6px 8px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 4px;
  display: none;

  &:hover {
    background-color: ${emotionTheme.color.black1};
  }

  &:active {
    background-color: ${emotionTheme.color.black3};
  }

  &:active {
    background-color: ${emotionTheme.color.black2};
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: flex;
  }
`;

export const SelectButtonText = styled.span<{ isCurrentTimeTable: boolean }>`
  label: select-button-text;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${emotionTheme.color.gray[900]};
`;

export const SelectIconContainer = styled.div`
  label: select-icon-container;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
