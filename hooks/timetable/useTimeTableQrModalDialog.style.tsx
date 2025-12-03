import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const ModalContainer = styled.div`
  label: modal-container;
  width: 260px;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CloseIconContainer = styled.button`
  label: close-icon-container;
  position: absolute;
  width: 28px;
  height: 28px;
  top: 8px;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TopText = styled.p`
  label: top-text;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  color: ${emotionTheme.color.black};
  text-align: center;
`;

export const QrContainer = styled.div`
  label: qr-container;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const QrText = styled.p`
  label: qr-text;
  font-size: 16px;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
  color: ${emotionTheme.color.main};
`;

export const BottomText = styled.p`
  label: bottom-text;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;
