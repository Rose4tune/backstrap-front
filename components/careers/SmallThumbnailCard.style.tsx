import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const SmallThumbnailCardContainer = styled.div`
  label: small-thumbnail-card-container;
  display: flex;
  flex-direction: row;
  height: 106px;
  box-sizing: border-box;
  cursor: pointer;
  align-items: center;
  width: 100%;

  /* Medium: 1024px 이상, 1439px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    height: 106px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 80px;
  }

  /* Hover 시 이미지 확대 */
  &:hover img {
    transform: scale(1.1); /* 이미지를 10% 확대 */
  }

  /* 부드러운 전환 효과 */
  img {
    transition: transform 0.3s ease-in-out;
  }
`;

export const ThumbnailContainer = styled.div`
  label: thumbnail-container;
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;

  /* Medium: 1024px 이상, 1439px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    width: 92px;
    height: 92px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    width: 75.08px;
    height: 75.08px;
  }
`;

export const JobBookmarkContainer = styled.div`
  label: job-bookmark-container;
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const JobInformation = styled.div`
  label: job-information;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  width: 100%;
  overflow: hidden;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding-left: 12px;
  }
`;

export const CompanyName = styled.div`
  label: company-name;
  font-size: 12px;
  font-weight: 500;
  color: ${emotionTheme.color.gray[700]};
  line-height: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  /* Medium: 1024px 이상, 1439px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 12px;
    line-height: 16px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 10px;
    line-height: 12px;
  }
`;

export const JobTitle = styled.div`
  label: job-title;
  font-size: 20px;
  font-weight: 700;
  color: ${emotionTheme.color.gray[900]};
  line-height: 30px;
  margin-bottom: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  /* Medium: 1024px 이상, 1439px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 20px;
    line-height: 30px;
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 16px;
    line-height: 24px;
  }
`;
