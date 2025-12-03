import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerFilterButtonContainer = styled.button<{
  selected: boolean | undefined;
}>`
  label: career-filter-button-container;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  gap: 12px;
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
  letter-spacing: -0.7px;
  color: ${({ selected }) =>
    selected ? emotionTheme.color.turqoise[700] : emotionTheme.color.gray[900]};
  border: ${({ selected }) =>
    selected
      ? `1.5px solid ${emotionTheme.color.turqoise[700]}`
      : `1px solid ${emotionTheme.color.gray[300]}`};
  background-color: ${({ selected }) =>
    selected ? emotionTheme.color.turqoise[100] : emotionTheme.color.white};

  &:hover {
    border: ${({ selected }) =>
      selected
        ? `1.5px solid ${emotionTheme.color.turqoise[700]}`
        : `1px solid ${emotionTheme.color.turqoise[700]}`};
    background-color: ${({ selected }) =>
      selected ? emotionTheme.color.turqoise[200] : emotionTheme.color.white};
  }

  &:active {
    border: ${({ selected }) =>
      selected
        ? `1.5px solid ${emotionTheme.color.turqoise[700]}`
        : `1px solid ${emotionTheme.color.turqoise[700]}`};
    background-color: ${({ selected }) =>
      selected ? emotionTheme.color.white : emotionTheme.color.turqoise[100]};
  }

  &:disabled {
    border: 1px solid ${emotionTheme.color.gray[300]};
    color: ${emotionTheme.color.gray[300]};
    background-color: ${emotionTheme.color.white};
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 12px;
    line-height: 16px;
    height: 32px;
    padding: 8px 12px;
  }
`;

export const CareerFilterButtonPolygonIconContainer = styled.div<{
  selected: boolean | undefined;
  disabled: boolean | undefined;
}>`
  label: career-filter-button-polygon-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(90deg);
  color: ${({ selected, disabled }) =>
    disabled
      ? emotionTheme.color.gray[300]
      : selected
        ? emotionTheme.color.turqoise[700]
        : emotionTheme.color.gray[700]};
`;
