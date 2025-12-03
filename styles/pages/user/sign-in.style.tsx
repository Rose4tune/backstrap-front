import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  gap: 64px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      padding-top: 44px;
    }
  `};
`;

export const PageWrap = styled.div`
  width: 100%;
  max-width: 418px;
  margin: 0 auto;

  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      margin-left: 0;
    }
  `};
`;

export const TopSection = styled.section`
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 30px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-left: 0;
      padding-right: 0;
    }

    ${theme.breakpoints.up('2xl')} {
      padding-bottom: 48px;
    }
  `};
`;

export const TopSectionText = styled.p`
  text-align: center;
  font-weight: 300;
  line-height: 1.375;
  font-size: 1.25rem;

  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      text-align: left;
      font-size: 1.5rem;
    }
  `};
`;

export const OauthButtonContainer = styled.div`
  margin-top: 16px;
`;

export const BottomSection = styled.section`
  padding-left: 40px;
  padding-right: 40px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      padding-left: 0;
      padding-right: 0;
    }
  `};
`;

export const LinkContainer = styled.div`
  margin-top: 24px;
`;

export const LinkText1 = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.color.grey5};
  font-size: 11px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      font-size: 1rem;
    }
  `};
`;

export const LinkText2 = styled(LinkText1)`
  margin-top: 8px;
`;

export const AppImageContainer = styled.div`
  display: none;
  width: 680px;
  position: relative;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.palette.primary.contrastText},
    ${({ theme }) => theme.color.primaryLight}
  );
  border-radius: 32px;
  overflow: hidden;

  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      display: block;
    }
  `};
`;

export const AppStoreContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 64px;
`;

export const AppStoreText = styled.p`
  font-weight: 300;
  line-height: 1.25;
  color: ${({ theme }) => theme.color.grey5};
  font-size: 1.25rem;
`;

export const AppStoreTextStrong = styled.strong`
  font-weight: 700;
  color: ${({ theme }) => theme.color.grey5};
  font-size: 1.25rem;
`;

export const AppStoreButtonContainer = styled.div`
  display: flex;
  gap: 6px;
  z-index: 10;
  margin-top: 20px;
`;
