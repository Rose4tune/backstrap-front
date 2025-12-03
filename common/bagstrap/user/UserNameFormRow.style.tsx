import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const NameFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      gap: 20px;
    }
  `};
`;
