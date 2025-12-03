import styled from '@emotion/styled';

export const TimeTableSelectArea = styled.div`
  label: time-table-select-area;
  margin-top: 1.25rem;
  margin-bottom: 0.25rem;
`;

export const TimeTableSelectBox = styled.div<{ open: boolean }>`
  label: time-table-select-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  ${({ open }) =>
    open &&
    `
      border-color: #000000;
  `}
`;

export const TimeTableName = styled.div`
  label: time-table-name;
  font-size: 24px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

export const TimeTableList = styled.div`
  label: time-table-list;
  width: 350px;
  max-height: 320px;
  overflow-y: scroll;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: white;
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
