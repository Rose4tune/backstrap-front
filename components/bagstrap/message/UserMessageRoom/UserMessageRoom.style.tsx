import styled from '@emotion/styled';
import { theme } from '@styles/themes/theme';

export const UserMessageRoomArea = styled.div<{ isHidden: boolean }>`
  position: fixed;
  inset: 0;
  scroll-behavior: smooth;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.primaryLight};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    position: static;
    border-left: 1px solid #e5e5eb;
    border-right: 1px solid #e5e5eb;
    border-bottom: 1px solid #e5e5eb;
  }

  ${({ isHidden, theme }) =>
    isHidden &&
    `
    display: none; 
    ${theme.breakpoints.up('lg')} {
      display: flex; 
      justify-content: center;
      align-items: center;
    }
  `}
`;

export const UserMessageArea = styled.div`
  label: user-message-area;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 76px;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-top: 0;
    margin-bottom: 64px;
  }
`;

export const NoticeArea = styled.div`
  label: notice-area;
  padding-top: 12px;
  padding-bottom: 12px;

  ${({ theme }) => theme.breakpoints.up('md')} {
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

export const Notice1 = styled.div`
  label: notice1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${theme.color.grey4};
  border-radius: 10px;
  height: 32px;
  margin: 0 16px 12px;

  ${({ theme }) => theme.breakpoints.up('md')} {
    margin: 0 28px 16px;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`;

export const NoticeWords1 = styled.p`
  label: notice-words1;
  color: #151920;
  opacity: 0.5;
  font-size: 11px;
  font-weight: 500;
`;

export const Notice2 = styled.div`
  label: notice2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  line-height: 1.25;
`;

export const NoticeWords2 = styled.p`
  label: notic-words2;
  font-size: 20px;
  font-weight: 300;
  color: ${theme.color.grey3};
  text-align: center;
`;

export const Notice3 = styled.div`
  label: notice3;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.25;
`;

export const NoticeWords3 = styled.p`
  label: notice-words3;
  font-size: 1.5rem;
  font-weight: 300;
  color: ${theme.color.grey3};
  text-align: center;
`;

export const UserMessageInputArea = styled.div`
  label: user-message-input-area;
  position: absolute;
  bottom: 1px;
  left: 1px;
  right: 1px;
  z-index: 50;
`;
