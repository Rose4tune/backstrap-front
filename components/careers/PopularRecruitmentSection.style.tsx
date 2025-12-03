import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const PopularRecruitmentSectionContainer = styled.div`
  label: popular-recruitment-section-container;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 16px;
  background-color: ${emotionTheme.color.turqoise[100]};

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    flex-direction: column;
    padding: 20px;
  }
`;

export const PopularRecruitmentSectionText = styled.p`
  label: popular-recruitment-section-text;
  color: ${emotionTheme.color.gray[900]};
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
`;

export const PopularRecruitmentSectionList = styled.ul`
  label: popular-recruitment-section-list;
  display: flex;
  gap: 5px;
  padding: 0 12px;
`;

export const PopularRecruitmentSectionListItem = styled.li`
  label: popular-recruitment-section-list-item;
  border-radius: 50%;
  overflow: hidden;
`;

export const PopularRecruitmentSectionPlusButton = styled.span`
  label: popular-recruitment-section-plus-button;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: ${emotionTheme.color.gray[900]};
  display: flex;
  align-items: center;
  cursor: default;
`;
