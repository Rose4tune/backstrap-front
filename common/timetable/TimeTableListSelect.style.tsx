import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const TimeTableSelectContainer = styled.div`
  label: time-table-select-container;
  margin-bottom: 8px;
`;

export const SelectButton = styled.button<{ open: boolean; isLogin?: boolean }>`
  label: select-button;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  width: 100%;

  border: ${({ isLogin }) =>
    !isLogin
      ? `1px solid ${emotionTheme.color.gray[200]}`
      : `1px solid ${emotionTheme.color.gray[300]}`};

  ${({ isLogin }) =>
    isLogin &&
    `
    &:focus {
      border: 1px solid ${emotionTheme.color.turqoise[300]};
    }

    &:active {
      border: 1px solid ${emotionTheme.color.turqoise[700]};
    }

    &:hover {
      border: 1px solid ${emotionTheme.color.turqoise[500]};
    }
  `}
`;

export const SelectButtonText = styled.span<{ isLogin?: boolean }>`
  label: select-button-text;
  width: 100%;
  text-align: start;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ isLogin }) =>
    isLogin === true ? `inherit` : `${emotionTheme.color.gray[300]}`};
`;

export const SelectButtonIconContainer = styled.div`
  label: select-button-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

export const StarIcon = styled('svg')`
  width: 20px;
  height: 20px;
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  fill: #ffd30c;

  & > path {
    stroke: none;
  }
`;

export const PolygonIconContainer = styled.div`
  label: polygon-icon-container;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
`;

export const StyledPolygonIcon = styled('svg')`
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  & > path {
    fill: ${emotionTheme.color.gray[700]};
  }
`;

export const TimeTableList = styled.ul`
  label: time-table-list;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
