import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const ProfileFieldRowContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.grey2};
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  `};

  ${({ theme }) => css`
    ${theme.breakpoints.up('xl')} {
      padding-left: 0;
      padding-right: 0;
    }
  `};
`;

export const ProfileFieldRowTitleContainer = styled.div`
  line-height: 1;
  align-items: center;
  justify-content: space-between;
  display: flex;
`;

export const ProfileFieldRowTitleLabelAndDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const ProfileFieldRowTitleLabel = styled.span`
  font-size: 13px;
  font-weight: 600;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 1.5rem;
    }
  `};
`;

export const ProfileFieldRowTitleDescription = styled.p`
  display: none;
  font-weight: 500;
  word-break: break-all;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.grey5};
`;

export const ProfileFieldRowTitleAction = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.primary};

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 1.25rem;
      font-weight: 400;
    }
  `};
`;

export const ProfileFieldRowValueContainer = styled.div`
  line-height: 1;
  margin-top: 12px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      margin-top: 20px;
    }
  `};
`;

export const ProfileFieldRowValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  word-break: break-all;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 1.5rem;
      font-weight: 300;
    }
  `};
`;

export const ProfileFieldContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const ProfileFieldImageChangeContainer = styled.div`
  position: relative;
  width: 77px;
  height: 77px;
  border-radius: 9999px;
  overflow: hidden;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      width: 118px;
      height: 118px;
    }
  `};
`;

export const ProfileFieldImage = styled.img`
  width: 100%;
  height: 100%;
`;

export const ProfileFieldImageChangeButton = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  opacity: 0.7;
  height: 25%;
  color: #fff;
  font-size: 0.625rem;
  cursor: pointer;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 13px;
    }
  `};
`;

export const ProfileFieldImageChangeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 4px;
`;

export const ProfileFieldImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProfileFieldImageUploadButton = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.color.grey5};
  font-size: 13px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 1.25rem;
    }
  `};
`;

export const ProfileFieldImageUploadFileName = styled.span`
  color: ${({ theme }) => theme.color.grey5};
  font-size: 11px;
  font-weight: 500;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 0.875rem;
      width: 384px;
    }
  `};
`;

export const ProfileFieldImageSaveButton = styled.span`
  text-decoration-line: underline;
  color: #fff;
  font-size: 13px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 1.25rem;
    }
  `};
`;

export const NicknameFieldContainer = styled.div``;

export const NicknameFieldSaveButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      gap: 16px;
      margin-top: 16px;
    }
  `};
`;

export const NicknameFieldValidText = styled.p<{ isNicknameValid: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ isNicknameValid, theme }) =>
    isNicknameValid ? theme.color.pointBlue : theme.color.pointRed};

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      font-size: 0.875rem;
    }
  `};
`;

export const SchoolVerificationFieldSchoolName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.color.primary};
`;

export const SchoolVerificationFieldStatusInReview = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.color.grey4};
`;

export const SchoolVerificationFieldStatusRejected = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.color.pointRed};
`;
