import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareeerBannerContainer = styled.div`
  label: career-banner-container;
  position: relative;
  height: 360px;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    height: 270px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 180px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    height: 160px;
  }
`;

export const CareerBannerImage = styled.div`
  label: career-banner-image;
  position: relative;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  padding: 40px 60px;
  box-sizing: border-box;
  align-content: flex-end;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    padding: 34px 46px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 22px 16px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    padding: 16px;
  }
`;

export const BannerInfoConatiner = styled.div`
  label: banner-info-container;
  display: flex;
  position: relative;
  flex-direction: column;
`;

export const BannerTitleContainer = styled.div`
  label: banner-title-container;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    margin-bottom: 10px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    margin-bottom: 5px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    margin-bottom: 4px;
  }
`;

export const BannerLogoContainer = styled.div`
  label: banner-logo-container;
  position: relative;
  width: 72px;
  height: 53px;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 53px;
    height: 39px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 23px;
    height: 17px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    width: 21px;
    height: 16px;
  }
`;

export const BannerTitle = styled.p`
  label: banner-title;
  color: rgba(75, 85, 84, 0.8);
  font-size: 30px;
  font-weight: 500;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 22px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 10px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    font-size: 9px;
  }
`;

export const BannerTitleStrong = styled.span`
  label: banner-title-strong;
  color: #4b5554;
  font-weight: 700;
`;

export const BannerSubtitle = styled.div`
  label: banner-subtitle;
  color: #364344;
  font-size: 80px;
  font-weight: 700;
  line-height: 101px;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 59px;
    line-height: 74px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 24px;
    line-height: 33px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    font-size: 22px;
    line-height: 30px;
  }
`;

export const BannerSubtitleTop = styled.span`
  label: banner-subtitle-top;
  position: relative;
`;

export const BannerSubtitleHighlight = styled.span`
  label: banner-subtitle-highlight;
  background: linear-gradient(to top, rgba(85, 233, 231, 0.2) 70%, transparent 30%);
`;

export const BannerBackgroundImageContainer = styled.div`
  label: banner-background-image-container;
  position: absolute;
  top: -40px;
  right: -250px;
  display: flex;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    top: -40px;
    right: -210px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    top: -32px;
    right: -116px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    top: -28px;
    right: -96px;
  }
`;

export const BannerBackgroundImageStudent = styled.div`
  label: banner-background-image-student;
  position: relative;
  width: 120px;
  height: 120px;
  transform: rotate(-10deg);

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 100px;
    height: 100px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 60px;
    height: 60px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    width: 50px;
    height: 50px;
  }
`;

export const BannerBackgroundImageBriefcase = styled.div`
  label: banner-background-image-briefcase;
  position: relative;
  width: 108px;
  height: 108px;
  transform: translate(-24px, 16px) rotate(15deg);

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 89px;
    height: 89px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 50px;
    height: 50px;
    transform: translate(-14px, 10px) rotate(15deg);
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    width: 40px;
    height: 40px;
    transform: translate(-10px, 8px) rotate(15deg);
  }
`;
