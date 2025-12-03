import styled from '@emotion/styled';

export const TimeTableSelectItemRow = styled.div`
  label: time-table-select-item-row;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 20px;
  box-sizing: border-box;
  padding: 1px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
