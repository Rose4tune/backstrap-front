import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CareerSectionContainer = styled.div`
  label: career-section-container;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

export const SectionHeader = styled.div`
  label: section-header;
  display: flex;
  flex-direction: row;
  height: 44px;
  justify-content: space-between;
  width: 100%;

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    height: 36px;
  }

  /* ~Small (~360px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    height: 36px;
  }
`;

export const SectionTitle = styled.h2`
  label: section-title;
  color: ${emotionTheme.color.gray[900]};
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;

  /* Medium (1024px ~ 1439px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    font-size: 20px;
    line-height: 30px;
  }

  /* Small (360px ~ 1023px) */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 18px;
    line-height: 28px;
  }

  /* ~Small (~360px) → 2개씩 배치 */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

export const SectionBody = styled.div<{ type: 'small' | 'large' }>`
  label: section-body;
  display: grid;
  gap: 16px;

  grid-template-columns: ${({ type }) =>
    type === 'large' ? `repeat(4, 1fr)` : `repeat(3, 1fr)`};

  /* Medium (1024px ~ 1439px) → 4개씩 배치 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
    grid-template-columns: ${({ type }) =>
      type === 'large' ? `repeat(4, 1fr)` : `repeat(3, 1fr)`};
  }

  /* Small (360px ~ 1023px) → 3개씩 배치 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    grid-template-columns: ${({ type }) =>
      type === 'large' ? `repeat(3, 1fr)` : `repeat(2, 1fr)`};
  }

  /* ~Small (~360px) → 2개씩 배치 */
  @media (max-width: ${emotionTheme.breakpoints.values.Small}px) {
    grid-template-columns: ${({ type }) =>
      type === 'large' ? `repeat(2, 1fr)` : `repeat(1, 1fr)`};
  }
`;
