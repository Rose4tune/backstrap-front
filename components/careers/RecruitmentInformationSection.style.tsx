import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const RecruitmentInformationSectionContainer = styled.div`
  label: recruitment-information-section-container;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background-color: ${emotionTheme.color.gray[100]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
  }
`;

export const RecruitmentInformationSectionTextContainer = styled.div`
  label: recruitment-information-section-text-container;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  &:nth-of-type(2) {
    order: 3;
  }

  &:nth-of-type(3) {
    order: 5;
  }

  &:nth-of-type(4) {
    order: 2;
  }

  &:nth-of-type(5) {
    order: 4;
  }

  &:nth-of-type(6) {
    order: 6;
  }

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    &:nth-of-type(n) {
      order: 1;
    }
  }
`;

export const RecruitmentInformationSectionTitle = styled.p`
  label: recruitment-information-section-title;
  width: 88px;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${emotionTheme.color.gray[700]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const RecruitmentInformationSectionContent = styled.p`
  label: recruitment-information-section-content;
  color: ${emotionTheme.color.gray[900]};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  white-space: nowrap;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 14px;
    line-height: 20px;
  }
`;
