import styled from '@emotion/styled';
import { theme } from '@styles/themes/theme';

export const MentoringPageContainer = styled.div<{ up425: boolean }>`
  margin: ${({ up425 }) => (up425 ? '20px' : '0px')};
`;

export const BannerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const BannerWrapper = styled.div`
  background-color: rgba(9, 9, 9, 0.5);
  position: absolute;
  width: 100%;
  height: 400px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px;
`;

export const BannerText = styled.div`
  margin-left: 8px;
`;

export const BannerTitle = styled.p`
  margin: 0;
  line-height: 1.5;
  color: ${theme.palette.primary.contrastText};
  font-size: 28px;
  font-weight: 700;
  height: 36px;
`;

export const BannerTitle2 = styled(BannerTitle)`
  margin-bottom: 20px;
`;

export const BannerDescriptionContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const BannerDescriptionIcon = styled.img`
  margin-top: 3px;
`;

export const BannerDescriptionText = styled.p`
  margin: 0;
  line-height: 1.5;
  color: ${theme.palette.primary.contrastText};
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
`;

export const BannerButtonText = styled.p`
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
  font-weight: 700;
`;

export const BannerPostIt = styled.img`
  width: 50%;
`;

export const Down425BannerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Down425BannerWrapper = styled.div`
  background-color: rgba(9, 9, 9, 0.5);
  position: absolute;
  top: 0;
  width: 100%;
  height: 469px;
  padding: 16px;
  align-items: center;
`;

export const Down425BannerTitle = styled(BannerTitle)`
  margin-top: 52px;
`;

export const Down425BannerTitle2 = styled(BannerTitle2)`
  font-size: 26px;
`;

export const ReviewSectionTitle1 = styled.p<{ up425: boolean }>`
  margin: 0;
  line-height: 1.5;
  color: black;
  font-size: 18px;
  font-weight: 700;
  height: 24px;
  padding-left: ${({ up425 }) => (up425 ? '0px' : '16px')};
  padding-right: ${({ up425 }) => (up425 ? '0px' : '16px')};
  margin-top: 68px;
`;

export const ReviewSectionTitle2 = styled.p<{ up425: boolean }>`
  margin: 0;
  line-height: 1.5;
  color: black;
  font-size: 24px;
  font-weight: 700;
  height: 32px;
  padding-left: ${({ up425 }) => (up425 ? '0px' : '16px')};
  padding-right: ${({ up425 }) => (up425 ? '0px' : '16px')};
  margin-bottom: 20px;
`;

export const ReviewListContainer = styled.div<{ up425: boolean }>`
  display: flex;
  flex-direction: ${({ up425 }) => (up425 ? 'row' : 'column')};
  margin-left: ${({ up425 }) => (up425 ? '0' : '12px')};
  margin-right: ${({ up425 }) => (up425 ? '0' : '12px')};
`;

export const GuideSectionTitle = styled.p<{ up425: boolean }>`
  margin: 0;
  line-height: 1.5;
  color: black;
  font-size: 24px;
  font-weight: 700;
  height: 32px;
  padding-left: ${({ up425 }) => (up425 ? '0' : '16px')};
  padding-right: ${({ up425 }) => (up425 ? '0' : '16px')};
  margin-top: 68px;
  margin-bottom: 20px;
`;

export const GuideListContainer = styled.div<{ up425: boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: ${({ up425 }) => (up425 ? '0' : '12px')};
  margin-right: ${({ up425 }) => (up425 ? '0' : '12px')};
`;

export const GuideListWrapper = styled.div<{ up425: boolean }>`
  display: flex;
  flex-direction: ${({ up425 }) => (up425 ? 'row' : 'column')};
`;
