import styled from '@emotion/styled';
import { theme } from '@styles/themes/theme';

export const MessageRoomCard = styled.div`
  label: message-room-card;
  padding: 12px 0 12px 0;
`;

export const MessagePartnerInfoArea = styled.div`
  label: message-partner-info-area;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProfileImageArea = styled.div<{ isAnonymous?: boolean | null }>`
  label: profile-image-area;
  flex-shrink: 0;
  height: 44px;
  padding-bottom: ${props => (props.isAnonymous ? '1px' : '')};
  ${({ theme }) => theme.breakpoints.up('lg')} {
    height: auto;
  }
`;

export const ProfileImage = styled.img<{ isAnonymous?: boolean | null }>`
  label: profile-image;
  border-radius: 100%; /* rounded-full */
  ${({ isAnonymous }) =>
    isAnonymous ? `width: 0; height: 0;` : `width: 44px; height: 44px;`}
`;

export const PartnerNameArea = styled.div<{ isAnonymous?: boolean | null }>`
  label: partner-name-area;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-bottom: 8px;

  ${({ isAnonymous }) => isAnonymous && `padding-bottom: 0.5rem;`}
`;

export const PartnerName = styled.span<{ isAnonymous?: boolean | null }>`
  label: partner-name;
  font-size: ${props => (props.isAnonymous ? '13px' : '11px')};
  font-weight: ${props => (props.isAnonymous ? 'bold' : '500')};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChatroomArea = styled.div`
  label: chatroom-area;
  margin-top: 4px;
`;

export const LastMessageBox = styled.div`
  label: last-message-box;
  text-align: right;
  line-height: 1;
  margin-top: 2px;
`;

export const LastMessageWord = styled.span`
  label: last-message-word;
  color: ${theme.color.grey5};
  font-size: 0.625rem;
`;
