import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const EmailFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 20px;
    }
  `};
`;

export const EmailFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmailField = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 8px;
    }
  `};
`;

export const EmailSendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('sm')} {
      flex: 1 1 0%;
    }
  `};
`;

export const EmailSendTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  width: 100%;
  height: 24px;
  min-width: 60px;
  background-color: #e5e5eb;
`;

export const EmailSendTimerText = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.color.grey5};
  font-size: 11px;
`;

export const Empty = styled.span`
  display: none;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      display: inline;
    }
  `};
`;

export const Br = styled.br`
  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      display: none;
    }
  `};
`;

export const CodeFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CodeFieldVerifiedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: solid 1px ${({ theme }) => theme.color.pointBlue};
  border-radius: 10px;
  height: 50px;
  padding-left: 12px;
  padding-right: 12px;
`;

export const CodeFieldVerifiedText = styled.p`
  font-weight: 300;
  line-height: 1;
  color: ${({ theme }) => theme.color.pointBlue};
  font-size: 1rem;
`;

export const CodeFieldInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 8px;
    }
  `};
`;
