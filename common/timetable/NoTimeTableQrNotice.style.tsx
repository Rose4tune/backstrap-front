import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const NoTimeTableQrNoticeArea = styled.div`
  label: no-timetable-qr-notice-area;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
`;

export const WhiteOpacityBackground = styled.div`
  label: white-opacity-background;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 86px;
  background-color: ${emotionTheme.color.white};
  opacity: 50%;
  z-index: 1;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    top: 60px;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    top: 30px;
  }
`;

export const NoTimeTableQrNoticeBox = styled.div`
  label: no-timetable-qr-notice-box;
  width: 332px;
  height: 116px;
  display: flex;
  flex-direction: row;
  padding: 20px;
  box-sizing: border-box;
  background-color: ${emotionTheme.color.gray[200]};
  border-radius: 8px;
  opacity: 100%;
  position: relative;
  z-index: 10;
  top: calc(50% - 86px);
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 160px;
    height: 180px;
    padding: 24px 20px;
    flex-direction: column;
    top: calc(50% - 60px);
  }
`;

export const NoticeTextArea = styled.div`
  label: notice-text-area;
  display: flex;
  flex-direction: column;
  gap: 4px;
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    text-align: center;
  }
`;

export const MainNotice = styled.div`
  label: main-notice;
  color: ${emotionTheme.color.gray[900]};
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  line-height: 28px;
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const NoticeDescription = styled.div`
  label: notice-description;
  color: ${emotionTheme.color.gray[700]};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 20px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const QrContainer = styled.div`
  label: qr-container;
  display: flex;
  width: 76px;
  height: 76px;
  margin-left: auto;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 60px;
    height: 60px;
    margin-top: 12px;
    margin-left: auto;
    margin-right: auto;
  }
`;
