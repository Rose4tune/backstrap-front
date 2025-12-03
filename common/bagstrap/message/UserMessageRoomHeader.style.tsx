import styled from '@emotion/styled';

export const UserMessageRoomHeaderArea = styled.div`
  label: user-message-room-header-area;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15); /* Tailwind box-shadow */
  height: 76px;
  padding: 8px 16px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  z-index: 100;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    position: sticky;
  }
`;

export const UserMessageRoomHeaderIconsArea = styled.div`
  label: user-message-room-header-icons-area;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProfileImageArea = styled.div`
  label: profile-image-area;
  width: 44px;
  height: 44px;
`;

export const PartnerProfileImage = styled.img`
  label: partner-profile-image;
  border-radius: 50%;
  width: 44px;
  height: 44px;
`;

export const UserMessageRoomMenu = styled.div`
  label: user-message-room-menu;
  position: relative;
`;

export const PartnerNameArea = styled.div`
  label: partner-name-area;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
`;

export const PartnerName = styled.span`
  label: partner-name;
  font-size: 0.75rem;
  font-weight: medium;
`;
