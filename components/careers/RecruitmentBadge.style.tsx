import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const RecruitmentBadgeHiddenContainer = styled.ul`
  label: recruitment-badge-hidden-container;
  visibility: hidden;
  position: absolute;
  pointer-events: none;
  height: 0;
  overflow: hidden;
`;

export const RecruitmentBadgeList = styled.ul`
  label: recruitment-badge-list;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const RecruitmentBadgeContainer = styled.li`
  label: recruitment-badge-container;
  display: flex;
  width: fit-content;
  flex: row;
  position: relative;
  padding: 4px 6px;
  box-sizing: border-box;
  background-color: ${emotionTheme.color.turqoise[700]};
  border-radius: 4px;

  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    padding: 4px;
  }
`;

export const EducationsBadgeContainer = styled(RecruitmentBadgeContainer)`
  label: educations-badge-container;
  background-color: ${emotionTheme.color.turqoise[100]};
`;

export const RecruitmentEach = styled.span`
  label: recruitment-each;
  color: ${emotionTheme.color.white};
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 10px;
    line-height: 12px;
  }
`;

export const EducationsEach = styled(RecruitmentEach)`
  label: educations-each;
  color: ${emotionTheme.color.turqoise[700]};
`;

export const HiddenCount = styled.span`
  label: hidden-count;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${emotionTheme.color.turqoise[700]};
`;
