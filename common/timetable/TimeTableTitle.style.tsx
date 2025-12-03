import styled from '@emotion/styled';

export const TimeTableTitleArea = styled.div`
  label: time-table-buttons-area;
  padding-top: 0.75rem;
  padding-bottom: 0.25rem;
`;

export const TimeTableName = styled.div`
  label: time-table-title;
  box-sizing: border-box;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  padding-top: 0.25rem;
  font-size: 14px;
  color: #bfbfbf;
  user-select: none;
`;

export const CurrentTimeTableName = styled.div`
  label: time-table-name;
  box-sizing: border-box;
  padding: 0.25rem;
  padding-top: 0;
  font-size: 28px;
  cursor: default;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;
