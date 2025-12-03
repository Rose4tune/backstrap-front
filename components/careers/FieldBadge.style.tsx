import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const FieldBadgeContainer = styled.div`
  label: field-badge-container;
  overflow: hidden;
`;

export const FieldEach = styled.span`
  label: field-each;
  display: inline-block;
  color: ${emotionTheme.color.gray[700]};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 4px;
  width: 100%;

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 10px;
  }
`;
