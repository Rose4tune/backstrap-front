import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const Container = styled.div`
  label: container;
  padding: 8px 12px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background-color: ${emotionTheme.color.gray[200]};
`;

export const TextContainer = styled.div`
  label: text-container;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const TopText = styled.p`
  label: top-text;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${emotionTheme.color.gray[900]};
`;

export const BottomText = styled.p`
  label: bottom-text;
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  color: ${emotionTheme.color.gray[800]};
`;
