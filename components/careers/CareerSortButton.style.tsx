import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerSortButtonContainer = styled.div`
  height: 44px;
  border-radius: 12px;
  background-color: ${emotionTheme.color.gray[100]};
  padding: 4px;
  display: flex;
  gap: 4px;
`;

export const CareerSortButtonContent = styled.button<{
  selected: 'UPLOAD' | 'DEADLINE';
  sortName: 'UPLOAD' | 'DEADLINE';
}>`
  width: 80px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ sortName, selected }) =>
    sortName === selected ? emotionTheme.color.gray[800] : emotionTheme.color.gray[600]};
  background-color: ${({ sortName, selected }) =>
    sortName === selected ? emotionTheme.color.white : 'transparent'};
  box-shadow: ${({ sortName, selected }) =>
    sortName === selected ? '0px 2px 8px 0px rgba(0, 0, 0, 0.12)' : 'none'};
`;
