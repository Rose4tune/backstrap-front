import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const NewModalDialogContainer = styled.div`
  label: new-modal-dialog-container;
  width: 620px;
  max-height: 720px;
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: visible;
  background-color: ${emotionTheme.color.white};
  z-index: 50;
  border-radius: 16px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 100%;
    height: 100%;
    max-height: none;
    top: 0;
    border-radius: 0px;
  }
`;

export const NewModalDialogHeader = styled.header`
  label: new-modal-dialog-header;
  position: relative;
  padding: 20px 0;
  border-bottom: 1px solid ${emotionTheme.color.gray[300]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 14px 0;
  }
`;

export const NewModalDialogHeaderCloseButton = styled.button`
  label: new-modal-dialog-header-close-button;
  position: relative;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 8px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    right: 8px;
  }
  &:hover {
    background-color: ${emotionTheme.color.black2};
  }
  &:active {
    background-color: ${emotionTheme.color.black3};
  }
`;

export const NewModalDialogBody = styled.div`
  label: new-modal-dialog-body;
  padding: 20px 24px;
  overflow-y: auto;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 20px 12px;
  }
`;

export const NewModalDialogActions = styled.div`
  label: new-modal-dialog-actions;
  padding: 24px;
  border-top: 1px solid ${emotionTheme.color.gray[300]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 24px 12px;
  }
`;
