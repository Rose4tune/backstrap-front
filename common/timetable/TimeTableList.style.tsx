import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TemplateText = styled.p`
  color: ${emotionTheme.color.gray[700]};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;
