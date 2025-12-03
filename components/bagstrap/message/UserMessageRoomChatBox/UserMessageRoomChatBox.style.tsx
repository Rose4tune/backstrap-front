import styled from '@emotion/styled';

export const UserMessageRoomChatBoxContainer = styled.div<{
  isRead: boolean | null | undefined;
  isLastSenderMe: boolean;
}>`
  label: user-message-room-chatbox-container;
  position: relative;
  flex: 1;
  width: 100%;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 4px;
  padding-bottom: 6px;
  z-index: 50;
  display: flex;
  align-items: center;
  height: 3.5rem;
  border-radius: 0.5rem;
  background-color: ${({ isRead, isLastSenderMe }) =>
    isRead || isLastSenderMe ? 'transparent' : 'var(--primary-light)'};
  border: ${({ theme, isRead, isLastSenderMe }) => {
    return isRead || isLastSenderMe ? `1px solid ${theme.color.grey3}` : 'none';
  }};

  ${({ className }) => className && `className: ${className}`};
`;

export const LastMessageArea = styled.div<{
  isRead: boolean | null | undefined;
  isLastSenderMe: boolean;
}>`
  label: last-message-area;
  z-index: 10;
  width: 100%;
  font-size: 13px;
  line-height: 1.25;
  word-break: break-word;
  color: ${({ isLastSenderMe, isRead, theme }) =>
    isLastSenderMe
      ? 'black'
      : isRead
        ? `${theme.color.grey5}`
        : `${theme.color.primary}`};
  font-weight: ${({ isLastSenderMe, isRead }) =>
    isLastSenderMe || !isRead ? 'bold' : '500'};
`;

export const LastMessage = styled.div`
  label: last-mesage;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  text-overflow: ellipsis;
`;
