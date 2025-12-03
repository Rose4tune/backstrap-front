import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const TalentPoolPageContainer = styled.div`
  label: talent-pool-page-container;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    gap: 12px;
  }
`;

export const TalentPoolPageTitle = styled.p`
  label: talent-pool-page-title;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

export const TalentPoolPageBannerContainer = styled.div`
  label: talent-pool-page-banner-container;
  height: 360px;
  border-radius: 16px;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.64) 35%, rgba(0, 0, 0, 0) 100%),
    url('/images/career-banner.png') 50% 70% / cover no-repeat;

  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    height: 270px;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 160px;
    padding: 24px 12px;
  }
`;

export const TalentPoolPageBannerMainText = styled.p`
  label: talent-pool-page-banner-main-text;
  font-size: 30px;
  font-weight: 700;
  line-height: 38px;
  color: ${emotionTheme.color.gray[100]};
  margin-bottom: 20px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 18px;
    line-height: 28px;
    margin-bottom: 12px;
  }
`;

export const TalentPoolPageBannerSubText = styled.p`
  label: talent-pool-page-banner-sub-text;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  color: ${emotionTheme.color.gray[300]};
  margin-bottom: 8px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }
`;

export const TalentPoolPageBannerSubTextBr = styled.br`
  label: talent-pool-page-banner-sub-text-br;
  display: none;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: block;
  }
`;

export const TalentPoolPageAboutContainer = styled.div`
  label: talent-pool-page-about-container;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 20px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 0;
  }
`;

export const TalentPoolPageAboutItemContainer = styled.div`
  label: talent-pool-page-about-item-container;
  display: flex;
  gap: 16px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    flex-direction: column;
    gap: 0px;
  }
`;

export const TalentPoolPageAboutTitle = styled.p`
  label: talent-pool-page-about-title;
  width: 308px;
  padding: 16px;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  color: ${emotionTheme.color.gray[900]};

  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 20px;
    line-height: 30px;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: auto;
    padding: 12px 0;
    font-size: 18px;
    line-height: 28px;
  }
`;

export const TalentPoolPageAboutAnswerContainer = styled.div`
  label: talent-pool-page-about-answer-container;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  background-color: ${emotionTheme.color.gray[100]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 12px;
  }
`;

export const TalentPoolPageAboutAnswer = styled.p`
  label: talent-pool-page-about-answer;
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  color: ${emotionTheme.color.gray[900]};

  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 16px;
    line-height: 24px;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const TalentPoolPageAboutAnswerBold = styled.p`
  label: talent-pool-page-about-answer-bold;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: ${emotionTheme.color.gray[900]};

  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 16px;
    line-height: 24px;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
`;

export const TalentPoolPageAboutBr = styled.br`
  label: talent-pool-page-about-br;
  display: block;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;
