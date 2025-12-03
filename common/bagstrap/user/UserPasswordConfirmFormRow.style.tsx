import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const PasswordFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 20px;
    }
  `};
`;

export const PasswordField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
