import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const FormContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-top: 24px;
      gap: 48px;
    }
  `};
`;

export const StudentTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 12px;
    }
  `};
`;

export const NextStepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
