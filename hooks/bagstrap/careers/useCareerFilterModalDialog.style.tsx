import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const UseCareerFilterModalDialogHeaderText = styled.p`
  label: use-career-filter-modal-dialog-header-text;
  color: ${emotionTheme.color.gray[900]};
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

export const UseCareerFilterModalDialogBodySectionList = styled.div`
  label: use-career-filter-modal-dialog-body-section-list;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UseCareerFilterModalDialogBodySection = styled.section`
  label: use-career-filter-modal-dialog-body-section;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:last-child {
    margin-bottom: 200px;
  }
`;

export const UseCareerFilterModalDialogBodySectionTitle = styled.p`
  label: use-career-filter-modal-dialog-body-section-title;
  color: ${emotionTheme.color.gray[900]};
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
`;

export const UseCareerFilterModalDialogBodySectionCategoryList = styled.div`
  label: use-career-filter-modal-dialog-body-section-category-list;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const UseCareerFilterModalDialogBodySectionCategoryEmptyText = styled.p`
  label: use-career-filter-modal-dialog-body-section-category-empty-text;
  width: 100%;
  text-align: center;
  color: ${emotionTheme.color.gray[600]};
  font-size: 14px;
`;

export const UseCareerFilterModalDialogSelectedList = styled.ul`
  label: use-career-filter-modal-dialog-selected-list;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const UseCareerFilterModalDialogSelectedListItem = styled.li`
  lable: use-career-filter-modal-dialog-selected-list-item;
  padding: 4px 12px;
  background-color: ${emotionTheme.color.gray[200]};
  border-radius: 6px;
  font-size: 16px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 14px;
  }
`;

export const UseCareerFilterModalDialogButtonContainer = styled.div`
  label: use-career-filter-modal-dialog-button-container;
  display: flex;
  gap: 12px;
`;
