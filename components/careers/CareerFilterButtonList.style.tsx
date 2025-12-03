import styled from '@emotion/styled';

export const CareerFilterButtonListContainer = styled.div`
  label: career-filter-button-list-container;
  display: flex;
  gap: 8px;
  width: fit-content;
  cursor: grab;
  user-select: none;
  will-change: transform;

  &:active {
    cursor: grabbing;
  }
`;
