import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const MessageListContainer = styled.div`
  label: message-list-container;
  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      display: flex;
      gap: 18px;
      height: 896px;
    }
  `}
`;

export const MessageListSection = styled.section`
  label: message-list-section;
  height: 100%;
  overflow-y: auto;
  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      width: 360px;
    }
  `}
`;

export const MessageList = styled.ul`
  label: message-list;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem 10px;
  padding: 1rem 0.75rem;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      grid-template-columns: repeat(3, 1fr);
    }
  `}

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem 16px;
      padding-right: 1.5rem;
    }
  `}
`;

export const MessageRoomSection = styled.section`
  label: message-room-section;
  position: relative;
  height: 100%;
  flex: 1;
`;
