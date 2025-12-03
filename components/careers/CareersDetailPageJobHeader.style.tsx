import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareersDetailPageJobHeaderContainer = styled.div`
  label: careers-detail-page-job-header-container;
  display: flex;
  padding-left: 12px;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 0;
    flex: 1;
  }
`;

export const CareersDetailPageJobHeaderTitleImageContainer = styled.div`
  label: careers-detail-page-job-header-title-image-container;
`;

export const CareersDetailPageJobHeaderImageContainer = styled.div`
  label: careers-detail-page-job-header-image-container;
  flex: 1;
  position: relative;
  width: 76px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
`;

export const CareersDetailPageJobHeaderTitleSubText = styled.p`
  label: careers-detail-page-job-header-title-sub-text;
  margin-top: 16px;
  color: ${emotionTheme.color.gray[700]};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    margin-top: 12px;
    font-size: 12px;
    line-height: 16px;
  }
`;

export const CareersDetailPageJobHeaderTitleMainText = styled.p`
  label: careers-detail-page-job-header-title-main-text;
  margin-top: 4px;
  color: ${emotionTheme.color.gray[900]};
  font-size: 30px;
  font-weight: 700;
  line-height: 38px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 20px;
    line-height: 30px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

export const CareersDetailPageJobHeaderDdayAndActionContainer = styled.div`
  label: careers-detail-page-job-header-dday-and-action-container;
  display: flex;
  gap: 12px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
  }
`;

export const CareersDetailPageJobHeaderActionContainer = styled.div`
  label: careers-detail-page-job-header-actions-container;
  display: flex;
  gap: 4px;
`;

export const CareersDetailPageJobHeaderActionIconButton = styled.button`
  label: careers-detail-page-job-header-action-icon-button;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;

  &:hover {
    background-color: ${emotionTheme.color.black2};
  }

  &:active {
    background-color: ${emotionTheme.color.black3};
  }
`;

export const CareersDetailPageJobHeaderFloatingDdayContainer = styled.div`
  label: careers-detail-page-job-header-floating-dday-container;
  padding: 32px 24px;
  border-radius: 16px;
  background-color: ${emotionTheme.color.turqoise[100]};
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 12px 20px;
    border-radius: 8px;
  }
`;

export const CareersDetailPageJobHeaderFloatingDdayTitle = styled.span`
  label: careers-detail-page-job-header-floating-dday-title;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: ${emotionTheme.color.gray[900]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const CareersDetailPageJobHeaderFloatingDdayLine = styled.span`
  label: careers-detail-page-job-header-floating-dday-line;
  width: 1px;
  height: 44px;
  background-color: ${emotionTheme.color.gray[300]};
  margin: 0 16px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    display: none;
  }
`;

export const CareersDetailPageJobHeaderFloatingDdayText = styled.span`
  label: careers-detail-page-job-header-floating-dday-text;
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
  color: ${emotionTheme.color.turqoise[600]};
  white-space: nowrap;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 18px;
    line-height: 20px;
  }
`;
