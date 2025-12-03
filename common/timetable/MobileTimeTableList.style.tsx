import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const TimeTableListSelectBox = styled.div<{ buttonWidth: number | null }>`
  label: time-table-list-select-box;
  width: ${({ buttonWidth }) => `${buttonWidth}px`};
  max-height: 316px;
  padding: 8px 4px;
  overflow-y: scroll;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
  animation: fade-in 0.2s ease-in-out;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const TimeTableListContainer = styled.div`
  label: time-table-list-container;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-bottom: 1px solid ${emotionTheme.color.gray[300]};

  &:last-child {
    border-bottom: none;
  }
`;

export const TimeTableListTitle = styled.p`
  label: time-table-list-title;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  padding: 4px 8px 0 8px;
  color: ${emotionTheme.color.gray[700]};
`;

export const TimeTableList = styled.ul`
  label: time-table-list;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
