import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const PageContainer = styled.div`
  max-width: 484px;
  margin: 0 auto;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      margin-top: 28px;
      margin-bottom: 28px;
    }
  `};
`;

export const HeaderContainer = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  padding-bottom: 20px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-left: 32px;
      padding-right: 32px;
      padding-top: 36px;
      padding-bottom: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `};
`;

export const HeaderTitle = styled.h1`
  font-weight: 700;
  font-size: 1.25rem;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      font-size: 25px;
    }
  `};
`;

export const HeaderStep = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      margin-top: 0;
    }
  `};
`;

export const HeaderStepText = styled.p`
  font-weight: 600;
  line-height: normal;
  font-size: 0.875rem;
`;

export const Step1Section = styled.section`
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-left: 32px;
      padding-right: 32px;
      padding-bottom: 36px;
    }
  `};
`;
