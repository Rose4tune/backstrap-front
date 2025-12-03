import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const AgreementSection = styled.section`
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-left: 32px;
      padding-right: 32px;
      gap: 24px;
    }
  `};
`;

export const AgreementDescription = styled.p`
  font-size: 13px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      font-size: 1rem;
    }
  `};
`;

export const LinkButton = styled.span`
  font-weight: 500;
  text-decoration-line: underline;
  font-size: 13px;
  color: ${({ theme }) => theme.color.primaryDark};
`;

export const CheckContainer = styled.div`
  flex-direction: column;
  gap: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckText = styled.p<{ isTermAgreed: boolean }>`
  font-size: 1rem;
  color: ${({ theme, isTermAgreed }) => (isTermAgreed ? theme.color.primary : '#000')};
  font-weight: ${({ isTermAgreed }) => (isTermAgreed ? 700 : 300)};
  text-decoration: ${({ isTermAgreed }) => (isTermAgreed ? 'underline' : 'none')};
`;

export const NextButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-bottom: 36px;
    }
  `};
`;
