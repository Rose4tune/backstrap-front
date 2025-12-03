import styled from '@emotion/styled';

export const UserMessageBoxArea = styled.div`
  label: user-message-box-area;
`;

export const UserMessageContainer = styled.div<{ isSender: boolean }>`
  label: user-message-container;
  max-width: 260px;
  width: fit-content;
  padding: 9px 16px;
  border-radius: 12px;
  background-color: ${({ theme, isSender }) => {
    return isSender ? theme.color.primaryDarkLight : 'white';
  }};
  margin-left: ${props => (props.isSender ? 'auto' : '0')};
  margin-right: ${props => (props.isSender ? '0' : 'auto')};
`;

export const MessageText = styled.p`
  label: message-text;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.25;
  word-break: break-word;
`;

export const MessageTimeArea = styled.div<{ isSender: boolean }>`
  label: message-time-area;
  line-height: 1;
  text-align: ${props => (props.isSender ? 'left' : 'right')};
  margin-top: 4px;
`;

export const MessageTime = styled.span`
  label: message-time;
  color: #444444;
  font-size: 11px;
  font-weight: 500;
`;
