import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const PageContainer = styled.div<{ up425: boolean }>`
  padding-left: ${({ up425 }) => (up425 ? '40px' : '20px')};
  padding-right: ${({ up425 }) => (up425 ? '40px' : '20px')};
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const PageTitle = styled.p<{ up425: boolean }>`
  line-height: 1.5;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: ${({ up425 }) => (up425 ? '40px' : '24px')};
  font-weight: 700;
`;

export const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 36px;
  padding-top: 36px;

  ${({ theme }) => css`
    ${theme.breakpoints.up('md')} {
      grid-template-columns: repeat(2, 1fr);
    }
  `};

  ${({ theme }) => css`
    ${theme.breakpoints.up('lg')} {
      grid-template-columns: repeat(3, 1fr);
    }
  `};
`;

export const CardItem = styled.div`
  ${({ theme }) => css`
    ${theme.breakpoints.up('2xl')} {
      font-size: 1rem;
    }
  `};
`;

export const AppLinkBannerContainer = styled.div`
  height: 100%;
  min-height: 230px;
  transform: rotate(4deg);
`;

export const CardItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  width: 100%;
  flex-direction: column;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  gap: 12px;

  &:hover {
    box-shadow:
      0px 3px 3px -2px rgba(0, 0, 0, 0.2),
      0px 3px 4px 0px rgba(0, 0, 0, 0.14),
      0px 1px 8px 0px rgba(0, 0, 0, 0.12);
  }
`;

export const CardItemTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: start;
  padding: 16px;
`;

export const CardItemCompany = styled.p`
  line-height: 1.5;
  font-size: 13px;
  font-weight: 400;
`;

export const CardItemTitle = styled.p`
  line-height: 1.5;
  font-size: 19px;
  font-weight: 700;
`;

export const EmptyBox = styled.div`
  display: flex;
`;

export const CardItemLabKeywordsContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;
export const CardItemLabKeywords = styled.p`
  color: #06c9bb;
  line-height: 1.5;
  font-size: 15px;
  font-weight: 700;
`;

export const CardItemLabKeywordsLine = styled.div`
  width: 1px;
  height: 10px;
  background-color: #00e2d1;
`;

export const CardItemTotiKeywordsContainer = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

export const CardItemTotiKeywords = styled.p`
  color: #666;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
`;

export const CardItemTotiKeywordsLine = styled.div`
  width: 1px;
  height: 10px;
  background-color: #eee;
`;
