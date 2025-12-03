import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerPositionContentContainer = styled.article`
  label: career-position-content-container;
  width: 100%;
  max-width: 640px;
`;

export const CareerPositionContentStyledMarkdown = styled.div`
  label: career-position-content-styled-markdown;
  overflow: hidden;

  h2 {
    font-size: 22px;
    line-height: 30px;
    font-weight: 600;
    margin-bottom: 24px;

    @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
      font-size: 20px;
      line-height: 28px;
    }
  }

  h3 {
    font-size: 18px;
    line-height: 26px;
    font-weight: 600;
    margin: 24px 0 12px;
  }

  p {
    font-size: 16px;
    line-height: 26px;
    margin: 12px 0;
    white-space: pre-line;
  }

  li {
    list-style-type: disc;
    margin-left: 24px;
  }
`;
